"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuthActions } from "@convex-dev/auth/react";
import { useConvexAuth, useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import Link from "next/link";

function fmt(cents: number) {
  return `R${(cents / 100).toFixed(0)}`;
}

const CATEGORIES = ["Baked Goods", "Pantry", "Jam Range", "Spice Range", "Chai"];
const STATUSES = ["all", "pending", "confirmed", "shipped", "delivered", "cancelled"] as const;

const STATUS_COLORS: Record<string, { bg: string; color: string }> = {
  pending:   { bg: "#fef3c7", color: "#92400e" },
  confirmed: { bg: "#dbeafe", color: "#1e40af" },
  shipped:   { bg: "#ede9fe", color: "#5b21b6" },
  delivered: { bg: "#d1fae5", color: "#065f46" },
  cancelled: { bg: "#fee2e2", color: "#991b1b" },
};

type AdminTab = "overview" | "products" | "orders" | "clients" | "settings";

type ProductForm = {
  name: string; category: string; price: string;
  description: string; inStock: boolean; featured: boolean;
  imageMode: "upload" | "url";
  imageUrl: string;
  storageId: string | null;
  uploadPreview: string | null;
  referencePreview: string | null;
  generatedImagePreview: string | null;
  imagePrompt: string;
  customImagePrompt: string;
};

const emptyProduct: ProductForm = {
  name: "", category: "Baked Goods", price: "",
  description: "", inStock: true, featured: false,
  imageMode: "upload", imageUrl: "", storageId: null, uploadPreview: null,
  referencePreview: null, generatedImagePreview: null,
  imagePrompt: "farm-studio", customImagePrompt: "",
};

const TAB_ICONS: Record<AdminTab, string> = {
  overview: "◈", products: "▣", orders: "◉", clients: "◎", settings: "⚙",
};

const IMAGE_PROMPTS = [
  {
    id: "farm-studio",
    label: "Farm studio product",
    prompt:
      "Create a studio-quality square ecommerce product photo of {name}. Keep the actual product faithful to the reference image. Place it on a warm neutral stone surface with soft natural window light, subtle Revayah Sanctuary organic farm styling, clean background, realistic shadows, premium but honest artisanal look, no text or logos added.",
  },
  {
    id: "baked-goods",
    label: "Baked goods table",
    prompt:
      "Create a square professional food product image of {name}. Preserve the product from the reference photo. Stage it on a rustic farm kitchen table with a linen cloth, a few natural crumbs or ingredients, soft morning light, shallow depth of field, appetizing texture, no text or packaging changes.",
  },
  {
    id: "jar-pantry",
    label: "Jar or pantry item",
    prompt:
      "Create a square premium ecommerce photo of {name}. Keep the jar, bottle, or pack faithful to the reference. Stage it upright on a clean natural surface with small relevant ingredients around it, warm daylight, crisp focus, realistic reflections, organic farm pantry aesthetic, no new label text.",
  },
  {
    id: "spice-flatlay",
    label: "Spice flat lay",
    prompt:
      "Create a square overhead product flat lay for {name}. Preserve the product appearance from the reference. Use a clean dark slate or natural wood surface, tasteful scattered spices or herbs, balanced composition, studio lighting, sharp detail, no added text.",
  },
  {
    id: "minimal-white",
    label: "Clean white ecommerce",
    prompt:
      "Create a square clean ecommerce product photo of {name}. Keep the product accurate to the reference image. Use an off-white seamless background, soft shadow, centered composition, bright natural lighting, premium catalogue quality, no props and no added text.",
  },
  {
    id: "custom",
    label: "Custom prompt",
    prompt: "",
  },
] as const;

function resolveImagePrompt(form: ProductForm) {
  const selected = IMAGE_PROMPTS.find((prompt) => prompt.id === form.imagePrompt) ?? IMAGE_PROMPTS[0];
  const template = selected.id === "custom" ? form.customImagePrompt : selected.prompt;
  return template
    .replaceAll("{name}", form.name.trim() || "this Revayah Sanctuary product")
    .replaceAll("{category}", form.category)
    .replaceAll("{description}", form.description.trim() || "an artisanal farm product");
}

function readFileAsBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const value = String(reader.result ?? "");
      resolve(value.includes(",") ? value.split(",")[1] : value);
    };
    reader.onerror = () => reject(reader.error ?? new Error("Could not read image"));
    reader.readAsDataURL(file);
  });
}

async function dataUrlToFile(dataUrl: string, fileName: string): Promise<File> {
  const response = await fetch(dataUrl);
  const blob = await response.blob();
  return new File([blob], fileName, { type: blob.type || "image/png" });
}

function ImageUploadSection({
  form, setForm, fileInputRef, pendingFile, referenceFile,
}: {
  form: ProductForm;
  setForm: (f: ProductForm) => void;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  pendingFile: React.RefObject<File | null>;
  referenceFile: React.RefObject<File | null>;
}) {
  const [generating, setGenerating] = useState(false);
  const [imageError, setImageError] = useState<string | null>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const preview = URL.createObjectURL(file);
    pendingFile.current = file;
    referenceFile.current = file;
    setImageError(null);
    setForm({
      ...form,
      imageMode: "upload",
      uploadPreview: preview,
      referencePreview: preview,
      generatedImagePreview: null,
      storageId: null,
    });
  };

  const openFilePicker = () => {
    setForm({ ...form, imageMode: "upload" });
    window.setTimeout(() => fileInputRef.current?.click(), 0);
  };

  const removeImage = () => {
    pendingFile.current = null;
    referenceFile.current = null;
    if (fileInputRef.current) fileInputRef.current.value = "";
    setImageError(null);
    setForm({
      ...form,
      uploadPreview: null,
      referencePreview: null,
      generatedImagePreview: null,
      storageId: null,
    });
  };

  const deleteGeneratedImage = () => {
    pendingFile.current = referenceFile.current;
    setImageError(null);
    setForm({
      ...form,
      uploadPreview: form.referencePreview,
      generatedImagePreview: null,
      storageId: null,
    });
  };

  const generateImage = async () => {
    if (!referenceFile.current) {
      setImageError("Upload a reference product photo first.");
      return;
    }
    const prompt = resolveImagePrompt(form).trim();
    if (!prompt) {
      setImageError("Choose a prompt or write a custom prompt.");
      return;
    }

    setGenerating(true);
    setImageError(null);
    try {
      const imageData = await readFileAsBase64(referenceFile.current);
      const response = await fetch("/api/admin/generate-product-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt,
          imageData,
          mimeType: referenceFile.current.type || "image/png",
        }),
      });
      const result = await response.json();
      if (!response.ok || !result.imageDataUrl) {
        throw new Error(result.error ?? "Image generation failed");
      }

      const generatedFile = await dataUrlToFile(result.imageDataUrl, "generated-product-image.png");
      pendingFile.current = generatedFile;
      setForm({
        ...form,
        imageMode: "upload",
        uploadPreview: result.imageDataUrl,
        generatedImagePreview: result.imageDataUrl,
        storageId: null,
      });
    } catch (error) {
      setImageError(error instanceof Error ? error.message : "Image generation failed");
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="form-group full">
      <label>Product image</label>
      <div className="product-image-toolbar">
        <button type="button" onClick={openFilePicker}
          className={`action-btn${form.imageMode === "upload" ? " primary" : ""}`}>Upload file</button>
        <button type="button" onClick={() => setForm({ ...form, imageMode: "url" })}
          className={`action-btn${form.imageMode === "url" ? " primary" : ""}`}>Image URL</button>
      </div>
      {form.imageMode === "upload" ? (
        <div className="product-image-panel">
          <input type="file" accept="image/*" onChange={handleFile} style={{ display: "none" }} ref={fileInputRef} />
          {form.uploadPreview ? (
            <div className="product-image-preview-row">
              <img src={form.uploadPreview} alt="" className="product-image-preview" />
              <div className="product-image-actions">
                <button type="button" onClick={openFilePicker} className="action-btn">Change</button>
                {form.generatedImagePreview && (
                  <button type="button" onClick={deleteGeneratedImage} className="action-btn">Delete generated</button>
                )}
                <button type="button" onClick={removeImage} className="action-btn danger">Remove</button>
              </div>
            </div>
          ) : (
            <p className="product-image-empty">Upload a product photo to use as the product image or as a Gemini reference.</p>
          )}

          <div className="product-image-generator">
            <div className="form-group">
              <label>Gemini image prompt</label>
              <select value={form.imagePrompt} onChange={(e) => setForm({ ...form, imagePrompt: e.target.value })}>
                {IMAGE_PROMPTS.map((prompt) => <option key={prompt.id} value={prompt.id}>{prompt.label}</option>)}
              </select>
            </div>
            {form.imagePrompt === "custom" && (
              <div className="form-group">
                <label>Custom prompt</label>
                <textarea value={form.customImagePrompt}
                  onChange={(e) => setForm({ ...form, customImagePrompt: e.target.value })}
                  rows={3}
                  placeholder="Describe the staged product image you want Gemini to create." />
              </div>
            )}
            <div className="product-image-generate-row">
              <button type="button" onClick={generateImage} className="action-btn primary" disabled={generating || !referenceFile.current}>
                {generating ? "Generating..." : form.generatedImagePreview ? "Regenerate image" : "Generate image"}
              </button>
              {form.generatedImagePreview && (
                <span className="product-image-status">Generated image will be saved with this product.</span>
              )}
            </div>
            {imageError && <p className="product-image-error">{imageError}</p>}
          </div>
        </div>
      ) : (
        <input type="text" value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} placeholder="/images/product.png or https://..." />
      )}
    </div>
  );
}

function ProductFormFields({ form, setForm, fileInputRef, pendingFile, referenceFile }: {
  form: ProductForm;
  setForm: (f: ProductForm) => void;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  pendingFile: React.RefObject<File | null>;
  referenceFile: React.RefObject<File | null>;
}) {
  return (
    <div className="form-grid">
      <div className="form-group">
        <label>Name *</label>
        <input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
      </div>
      <div className="form-group">
        <label>Category *</label>
        <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
          {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
        </select>
      </div>
      <div className="form-group">
        <label>Price (R) *</label>
        <input type="number" required min="0" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} placeholder="e.g. 89" />
      </div>
      <div className="product-checks">
        <label>
          <input type="checkbox" checked={form.inStock} onChange={(e) => setForm({ ...form, inStock: e.target.checked })} />
          In stock
        </label>
        <label>
          <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} />
          Featured
        </label>
      </div>
      <div className="form-group full">
        <label>Description *</label>
        <textarea required value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} />
      </div>
      <ImageUploadSection form={form} setForm={setForm} fileInputRef={fileInputRef} pendingFile={pendingFile} referenceFile={referenceFile} />
    </div>
  );
}

export default function AdminPage() {
  const router = useRouter();
  const { signOut } = useAuthActions();
  const { isAuthenticated, isLoading } = useConvexAuth();
  const isAdmin = useQuery(api.users.isAdmin);

  const [tab, setTab] = useState<AdminTab>("overview");
  const [statusFilter, setStatusFilter] = useState("all");
  const [expandedOrders, setExpandedOrders] = useState<Set<string>>(new Set());
  const [viewingClientId, setViewingClientId] = useState<string | null>(null);
  const [showNewForm, setShowNewForm] = useState(false);
  const [editingId, setEditingId] = useState<Id<"products"> | null>(null);
  const [newForm, setNewForm] = useState<ProductForm>(emptyProduct);
  const [editForm, setEditForm] = useState<ProductForm>(emptyProduct);
  const [saving, setSaving] = useState(false);
  const [settingsForm, setSettingsForm] = useState({ deliveryFee: "", freeThreshold: "", storeOpen: true });
  const [settingsSaving, setSettingsSaving] = useState(false);
  const [settingsSaved, setSettingsSaved] = useState(false);

  const pendingFileNew = useRef<File | null>(null);
  const pendingFileEdit = useRef<File | null>(null);
  const referenceFileNew = useRef<File | null>(null);
  const referenceFileEdit = useRef<File | null>(null);
  const fileInputNewRef = useRef<HTMLInputElement>(null);
  const fileInputEditRef = useRef<HTMLInputElement>(null);

  const products = useQuery(api.products.listAll);
  const orders = useQuery(api.orders.listAll, {
    status: statusFilter === "all" ? undefined : statusFilter,
  });
  const allOrders = useQuery(api.orders.listAll, {});
  const clients = useQuery(api.users.listClients);
  const siteSettings = useQuery(api.settings.get);
  const clientOrders = useQuery(
    api.orders.listAll,
    viewingClientId ? { userId: viewingClientId as Id<"users"> } : "skip"
  );

  const createProduct = useMutation(api.products.create);
  const updateProduct = useMutation(api.products.update);
  const removeProduct = useMutation(api.products.remove);
  const updateOrderStatus = useMutation(api.orders.updateStatus);
  const seedProducts = useMutation(api.products.seed);
  const generateUploadUrl = useMutation(api.files.generateUploadUrl);
  const updateSettings = useMutation(api.settings.update);

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  useEffect(() => {
    if (!isLoading && isAdmin !== undefined) {
      if (!isAuthenticated) router.replace("/auth");
      else if (isAdmin === false) router.replace("/dashboard");
    }
  }, [isLoading, isAuthenticated, isAdmin, router]);

  useEffect(() => {
    if (siteSettings) {
      setSettingsForm({
        deliveryFee: (siteSettings.deliveryFee / 100).toString(),
        freeThreshold: (siteSettings.freeThreshold / 100).toString(),
        storeOpen: siteSettings.storeOpen,
      });
    }
  }, [siteSettings]);

  if (isLoading || isAdmin === undefined) {
    return <main><div style={{ padding: "4rem", textAlign: "center", color: "var(--muted)" }}>Loading…</div></main>;
  }
  if (!isAuthenticated || isAdmin === false) return null;

  async function uploadFile(file: File): Promise<string> {
    const url = await generateUploadUrl();
    const res = await fetch(url, { method: "POST", body: file, headers: { "Content-Type": file.type } });
    const { storageId } = await res.json() as { storageId: string };
    return storageId;
  }

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      let storageId: string | undefined;
      let image: string | undefined;
      if (newForm.imageMode === "upload" && pendingFileNew.current) {
        storageId = await uploadFile(pendingFileNew.current);
      } else if (newForm.imageMode === "url" && newForm.imageUrl) {
        image = newForm.imageUrl;
      }
      await createProduct({
        name: newForm.name, category: newForm.category,
        price: Math.round(parseFloat(newForm.price) * 100),
        description: newForm.description,
        inStock: newForm.inStock, featured: newForm.featured,
        image, storageId: storageId as Id<"_storage"> | undefined,
      });
      setNewForm(emptyProduct);
      pendingFileNew.current = null;
      referenceFileNew.current = null;
      setShowNewForm(false);
    } finally { setSaving(false); }
  };

  const startEdit = (p: { _id: Id<"products">; name: string; category: string; price: number; description: string; image?: string; storageId?: string; imageUrl?: string | null; inStock: boolean; featured?: boolean }) => {
    setEditingId(p._id);
    setEditForm({
      name: p.name, category: p.category, price: (p.price / 100).toString(),
      description: p.description, inStock: p.inStock, featured: p.featured ?? false,
      imageMode: p.storageId ? "upload" : "url",
      imageUrl: p.image ?? "",
      storageId: p.storageId ?? null,
      uploadPreview: p.imageUrl ?? null,
      referencePreview: null,
      generatedImagePreview: null,
      imagePrompt: "farm-studio",
      customImagePrompt: "",
    });
    pendingFileEdit.current = null;
    referenceFileEdit.current = null;
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingId) return;
    setSaving(true);
    try {
      let storageId: string | undefined = editForm.storageId ?? undefined;
      let image: string | undefined = editForm.imageMode === "url" ? editForm.imageUrl || undefined : undefined;
      if (editForm.imageMode === "upload" && pendingFileEdit.current) {
        storageId = await uploadFile(pendingFileEdit.current);
        image = undefined;
      }
      await updateProduct({
        id: editingId, name: editForm.name, category: editForm.category,
        price: Math.round(parseFloat(editForm.price) * 100),
        description: editForm.description, inStock: editForm.inStock, featured: editForm.featured,
        image, storageId: storageId as Id<"_storage"> | undefined,
      });
      setEditingId(null);
      pendingFileEdit.current = null;
      referenceFileEdit.current = null;
    } finally { setSaving(false); }
  };

  const handleDelete = async (id: Id<"products">) => {
    if (!confirm("Delete this product? This cannot be undone.")) return;
    await removeProduct({ id });
  };

  const toggleOrder = (id: string) =>
    setExpandedOrders((prev) => { const s = new Set(prev); if (s.has(id)) { s.delete(id); } else { s.add(id); } return s; });

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSettingsSaving(true);
    try {
      await updateSettings({
        deliveryFee: Math.round(parseFloat(settingsForm.deliveryFee) * 100),
        freeThreshold: Math.round(parseFloat(settingsForm.freeThreshold) * 100),
        storeOpen: settingsForm.storeOpen,
      });
      setSettingsSaved(true);
      setTimeout(() => setSettingsSaved(false), 2500);
    } finally { setSettingsSaving(false); }
  };

  // ── Stat calculations ──────────────────────────────────────────────────────
  const totalRevenue = allOrders?.filter((o) => o.status !== "cancelled" && o.status !== "pending").reduce((s, o) => s + o.total, 0) ?? 0;
  const pendingCount = allOrders?.filter((o) => o.status === "pending").length ?? 0;
  const totalOrders = allOrders?.length ?? 0;
  const totalClients = clients?.length ?? 0;

  const TABS: { id: AdminTab; label: string }[] = [
    { id: "overview", label: "Overview" },
    { id: "products", label: "Products" },
    { id: "orders", label: "Orders" },
    { id: "clients", label: "Clients" },
    { id: "settings", label: "Settings" },
  ];

  return (
    <main>
      <div className="page-hero">
        <div className="container" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <span className="eyebrow">Admin</span>
            <h1>Admin Panel</h1>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap" }}>
            <Link href="/dashboard" className="btn btn-secondary" style={{ minHeight: "auto", padding: "0.5rem 1rem", fontSize: "0.875rem" }}>My account</Link>
            <button onClick={handleSignOut} className="btn btn-secondary" style={{ minHeight: "auto", padding: "0.5rem 1rem", fontSize: "0.875rem" }}>
              Sign out
            </button>
          </div>
        </div>
      </div>

      <section className="section">
        <div className="container">
          {/* Mobile tabs */}
          <div className="admin-mobile-tabs">
            {TABS.map((t) => (
              <button key={t.id} onClick={() => setTab(t.id)}
                className={`admin-mobile-tab${tab === t.id ? " active" : ""}`}>
                {t.label}
              </button>
            ))}
          </div>

          <div className="admin-layout">
            {/* Desktop sidebar */}
            <nav className="admin-sidebar">
              {TABS.map((t) => (
                <button key={t.id} onClick={() => setTab(t.id)}
                  className={`admin-nav-btn${tab === t.id ? " active" : ""}`}>
                  <span style={{ fontSize: "1rem" }}>{TAB_ICONS[t.id]}</span>
                  {t.label}
                </button>
              ))}
            </nav>

            <div className="admin-content">

              {/* ── OVERVIEW ─────────────────────────────────────────────── */}
              {tab === "overview" && (
                <div>
                  <h2 style={{ fontSize: "1.25rem", marginBottom: "1.5rem" }}>Overview</h2>
                  <div className="admin-stats">
                    <div className="stat-card">
                      <p className="stat-label">Revenue</p>
                      <p className="stat-value">{fmt(totalRevenue)}</p>
                      <p className="stat-sub">Confirmed + shipped + delivered</p>
                    </div>
                    <div className="stat-card">
                      <p className="stat-label">Pending</p>
                      <p className="stat-value">{pendingCount}</p>
                      <p className="stat-sub">Awaiting confirmation</p>
                    </div>
                    <div className="stat-card">
                      <p className="stat-label">Total orders</p>
                      <p className="stat-value">{totalOrders}</p>
                      <p className="stat-sub">All time</p>
                    </div>
                    <div className="stat-card">
                      <p className="stat-label">Clients</p>
                      <p className="stat-value">{totalClients}</p>
                      <p className="stat-sub">Registered accounts</p>
                    </div>
                  </div>

                  {/* Recent orders preview */}
                  <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--r-md)", padding: "1.25rem 1.5rem" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                      <p style={{ fontWeight: 600, fontSize: "0.9375rem" }}>Recent orders</p>
                      <button onClick={() => setTab("orders")} className="action-btn">View all</button>
                    </div>
                    {allOrders === undefined ? (
                      <p style={{ color: "var(--muted)", fontSize: "0.875rem" }}>Loading…</p>
                    ) : allOrders.length === 0 ? (
                      <p style={{ color: "var(--muted)", fontSize: "0.875rem" }}>No orders yet.</p>
                    ) : (
                      allOrders.slice(0, 5).map((o) => (
                        <div key={o._id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.625rem 0", borderBottom: "1px solid var(--border)", flexWrap: "wrap", gap: "0.5rem" }}>
                          <div>
                            <p style={{ fontWeight: 600, fontSize: "0.875rem", fontFamily: "monospace" }}>#{o._id.slice(-8).toUpperCase()}</p>
                            <p style={{ fontSize: "0.8125rem", color: "var(--muted)" }}>{o.email}</p>
                          </div>
                          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                            <span style={{ padding: "0.2rem 0.625rem", borderRadius: "var(--r-full)", fontSize: "0.75rem", fontWeight: 600, background: STATUS_COLORS[o.status]?.bg, color: STATUS_COLORS[o.status]?.color }}>
                              {o.status.charAt(0).toUpperCase() + o.status.slice(1)}
                            </span>
                            <span style={{ fontWeight: 700, fontSize: "0.9rem" }}>{fmt(o.total)}</span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* ── PRODUCTS ─────────────────────────────────────────────── */}
              {tab === "products" && (
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem", flexWrap: "wrap", gap: "0.75rem" }}>
                    <h2 style={{ fontSize: "1.25rem" }}>Products ({products?.length ?? 0})</h2>
                    <div style={{ display: "flex", gap: "0.75rem" }}>
                      <button onClick={() => seedProducts()} className="action-btn">Seed 15 products</button>
                      <button onClick={() => { setShowNewForm((v) => !v); setEditingId(null); pendingFileNew.current = null; referenceFileNew.current = null; }}
                        className={`action-btn${showNewForm ? "" : " primary"}`}>
                        {showNewForm ? "Cancel" : "+ Add product"}
                      </button>
                    </div>
                  </div>

                  {showNewForm && (
                    <div style={{ background: "var(--surface)", border: "2px solid var(--accent)", borderRadius: "var(--r-md)", padding: "1.5rem", marginBottom: "1.5rem" }}>
                      <p style={{ fontWeight: 600, marginBottom: "1.25rem", fontSize: "1rem" }}>New product</p>
                      <form onSubmit={handleCreate}>
                        <ProductFormFields form={newForm} setForm={setNewForm} fileInputRef={fileInputNewRef} pendingFile={pendingFileNew} referenceFile={referenceFileNew} />
                        <div style={{ marginTop: "1.25rem", display: "flex", gap: "0.75rem" }}>
                          <button type="submit" className="btn btn-primary" style={{ minHeight: "auto", padding: "0.5rem 1.25rem" }} disabled={saving}>
                            {saving ? "Saving…" : "Create product"}
                          </button>
                          <button type="button" onClick={() => { setShowNewForm(false); pendingFileNew.current = null; referenceFileNew.current = null; }} className="action-btn">Cancel</button>
                        </div>
                      </form>
                    </div>
                  )}

                  <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem" }}>
                    {products?.map((p) => (
                      <div key={p._id}>
                        {editingId === p._id ? (
                          <div style={{ background: "var(--surface)", border: "2px solid var(--accent)", borderRadius: "var(--r-md)", padding: "1.5rem" }}>
                            <p style={{ fontWeight: 600, marginBottom: "1.25rem" }}>Editing: {p.name}</p>
                            <form onSubmit={handleUpdate}>
                              <ProductFormFields form={editForm} setForm={setEditForm} fileInputRef={fileInputEditRef} pendingFile={pendingFileEdit} referenceFile={referenceFileEdit} />
                              <div style={{ marginTop: "1.25rem", display: "flex", gap: "0.75rem" }}>
                                <button type="submit" className="btn btn-primary" style={{ minHeight: "auto", padding: "0.5rem 1.25rem" }} disabled={saving}>
                                  {saving ? "Saving…" : "Save changes"}
                                </button>
                                <button type="button" onClick={() => { setEditingId(null); pendingFileEdit.current = null; referenceFileEdit.current = null; }} className="action-btn">Cancel</button>
                              </div>
                            </form>
                          </div>
                        ) : (
                          <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--r-md)", padding: "0.875rem 1.125rem", display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
                            {p.imageUrl ? (
                              <img src={p.imageUrl} alt={p.name} style={{ width: 52, height: 52, objectFit: "cover", borderRadius: "var(--r-sm)", border: "1px solid var(--border)", flexShrink: 0 }} />
                            ) : (
                              <div style={{ width: 52, height: 52, borderRadius: "var(--r-sm)", border: "1px dashed var(--border)", background: "var(--bg)", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--muted)", fontSize: "0.75rem" }}>No img</div>
                            )}
                            <div style={{ flex: 1, minWidth: 160 }}>
                              <p style={{ fontWeight: 600, marginBottom: "0.125rem" }}>{p.name}</p>
                              <p style={{ fontSize: "0.8125rem", color: "var(--muted)" }}>{p.category} · {fmt(p.price)}</p>
                            </div>
                            <div style={{ display: "flex", gap: "0.375rem", flexWrap: "wrap" }}>
                              <span style={{ padding: "0.2rem 0.625rem", borderRadius: "var(--r-full)", fontSize: "0.75rem", fontWeight: 600, background: p.inStock ? "#d1fae5" : "#fee2e2", color: p.inStock ? "#065f46" : "#991b1b" }}>
                                {p.inStock ? "In stock" : "Out of stock"}
                              </span>
                              {p.featured && <span style={{ padding: "0.2rem 0.625rem", borderRadius: "var(--r-full)", fontSize: "0.75rem", fontWeight: 600, background: "#fef3c7", color: "#92400e" }}>Featured</span>}
                            </div>
                            <div style={{ display: "flex", gap: "0.5rem" }}>
                              <button onClick={() => { startEdit(p); setShowNewForm(false); }} className="action-btn">Edit</button>
                              <button onClick={() => handleDelete(p._id)} className="action-btn danger">Delete</button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ── ORDERS ───────────────────────────────────────────────── */}
              {tab === "orders" && (
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem", flexWrap: "wrap", gap: "0.75rem" }}>
                    <h2 style={{ fontSize: "1.25rem" }}>Orders</h2>
                    <div style={{ display: "flex", gap: "0.375rem", flexWrap: "wrap" }}>
                      {STATUSES.map((s) => (
                        <button key={s} onClick={() => setStatusFilter(s)}
                          style={{ padding: "0.3rem 0.75rem", borderRadius: "var(--r-full)", fontSize: "0.8125rem", fontWeight: 600, border: "1px solid", cursor: "pointer", background: statusFilter === s ? "var(--accent)" : "transparent", borderColor: statusFilter === s ? "var(--accent)" : "var(--border)", color: statusFilter === s ? "#fff" : "var(--muted)", transition: "all 0.15s" }}>
                          {s.charAt(0).toUpperCase() + s.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>

                  {orders === undefined ? (
                    <div style={{ textAlign: "center", padding: "2rem", color: "var(--muted)" }}>Loading…</div>
                  ) : orders.length === 0 ? (
                    <div style={{ textAlign: "center", padding: "3rem", color: "var(--muted)" }}>No orders found.</div>
                  ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                      {orders.map((order) => (
                        <div key={order._id} style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--r-md)", padding: "1.125rem 1.375rem" }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "0.75rem" }}>
                            <div>
                              <p style={{ fontWeight: 700, fontFamily: "monospace", fontSize: "0.875rem", marginBottom: "0.2rem" }}>#{order._id.slice(-8).toUpperCase()}</p>
                              <p style={{ fontSize: "0.8125rem", color: "var(--muted)" }}>
                                {new Date(order._creationTime).toLocaleDateString("en-ZA", { day: "numeric", month: "short", year: "numeric" })}
                                {" · "}{order.email}
                              </p>
                            </div>
                            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap" }}>
                              <span style={{ padding: "0.2rem 0.625rem", borderRadius: "var(--r-full)", fontSize: "0.75rem", fontWeight: 700, background: STATUS_COLORS[order.status]?.bg, color: STATUS_COLORS[order.status]?.color }}>
                                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                              </span>
                              <span style={{ fontWeight: 700 }}>{fmt(order.total)}</span>
                              <select value={order.status} onChange={(e) => updateOrderStatus({ id: order._id, status: e.target.value as "pending" | "confirmed" | "shipped" | "delivered" | "cancelled" })}
                                style={{ padding: "0.3rem 0.625rem", borderRadius: "var(--r-sm)", fontSize: "0.8125rem", border: "1px solid var(--border)", background: "var(--bg)", color: "var(--fg)", cursor: "pointer" }}>
                                {STATUSES.slice(1).map((s) => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                              </select>
                              <button onClick={() => toggleOrder(order._id)} className="action-btn">
                                {expandedOrders.has(order._id) ? "Collapse ↑" : "Expand ↓"}
                              </button>
                            </div>
                          </div>

                          {expandedOrders.has(order._id) && (
                            <div style={{ marginTop: "1rem", paddingTop: "1rem", borderTop: "1px solid var(--border)", display: "grid", gap: "1rem" }}>
                              <div>
                                <p style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--muted)", marginBottom: "0.5rem" }}>Items</p>
                                {order.items.map((item) => (
                                  <div key={item.id} style={{ display: "flex", justifyContent: "space-between", fontSize: "0.875rem", padding: "0.3rem 0", borderBottom: "1px solid var(--border)" }}>
                                    <span>{item.name} × {item.quantity}</span>
                                    <span style={{ fontWeight: 600 }}>{fmt(item.price * item.quantity)}</span>
                                  </div>
                                ))}
                                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8125rem", marginTop: "0.5rem", color: "var(--muted)" }}>
                                  <span>Subtotal + Delivery</span>
                                  <span>{fmt(order.subtotal)} + {fmt(order.deliveryFee)} = <strong style={{ color: "var(--fg)" }}>{fmt(order.total)}</strong></span>
                                </div>
                              </div>
                              <div>
                                <p style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--muted)", marginBottom: "0.375rem" }}>Delivery address</p>
                                <address style={{ fontStyle: "normal", fontSize: "0.875rem", lineHeight: 1.7 }}>
                                  {order.delivery.fullName}<br />
                                  {order.delivery.address}, {order.delivery.suburb}<br />
                                  {order.delivery.city}, {order.delivery.province} {order.delivery.postalCode}<br />
                                  {order.delivery.phone}
                                </address>
                              </div>
                              {order.paystackRef && (
                                <div>
                                  <p style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--muted)", marginBottom: "0.25rem" }}>Paystack reference</p>
                                  <p style={{ fontFamily: "monospace", fontSize: "0.875rem" }}>{order.paystackRef}</p>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* ── CLIENTS ──────────────────────────────────────────────── */}
              {tab === "clients" && (
                <div>
                  {viewingClientId ? (
                    <div>
                      <button onClick={() => setViewingClientId(null)} className="action-btn" style={{ marginBottom: "1.25rem" }}>← Back to clients</button>
                      {(() => {
                        const client = clients?.find((c) => c._id === viewingClientId);
                        return client ? (
                          <div style={{ marginBottom: "1.5rem" }}>
                            <p style={{ fontWeight: 700, fontSize: "1.125rem" }}>{client.name ?? client.email}</p>
                            <p style={{ color: "var(--muted)", fontSize: "0.875rem" }}>{client.name ? client.email : ""} · {client.orderCount} order{client.orderCount !== 1 ? "s" : ""} · {fmt(client.totalSpent)} total</p>
                          </div>
                        ) : null;
                      })()}
                      {clientOrders === undefined ? (
                        <p style={{ color: "var(--muted)" }}>Loading…</p>
                      ) : clientOrders.length === 0 ? (
                        <p style={{ color: "var(--muted)" }}>No orders for this client.</p>
                      ) : (
                        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                          {clientOrders.map((order) => (
                            <div key={order._id} style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--r-md)", padding: "1rem 1.25rem" }}>
                              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.5rem" }}>
                                <div>
                                  <p style={{ fontWeight: 700, fontFamily: "monospace", fontSize: "0.875rem" }}>#{order._id.slice(-8).toUpperCase()}</p>
                                  <p style={{ fontSize: "0.8125rem", color: "var(--muted)" }}>{new Date(order._creationTime).toLocaleDateString("en-ZA", { day: "numeric", month: "short", year: "numeric" })}</p>
                                </div>
                                <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
                                  <span style={{ padding: "0.2rem 0.625rem", borderRadius: "var(--r-full)", fontSize: "0.75rem", fontWeight: 700, background: STATUS_COLORS[order.status]?.bg, color: STATUS_COLORS[order.status]?.color }}>
                                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                  </span>
                                  <span style={{ fontWeight: 700 }}>{fmt(order.total)}</span>
                                </div>
                              </div>
                              <p style={{ fontSize: "0.8125rem", color: "var(--muted)", marginTop: "0.5rem" }}>
                                {order.items.map((i) => `${i.name} ×${i.quantity}`).join(", ")}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
                        <h2 style={{ fontSize: "1.25rem" }}>Clients ({clients?.length ?? 0})</h2>
                      </div>
                      {clients === undefined ? (
                        <p style={{ color: "var(--muted)" }}>Loading…</p>
                      ) : clients.length === 0 ? (
                        <p style={{ color: "var(--muted)" }}>No registered clients yet.</p>
                      ) : (
                        <div style={{ overflowX: "auto" }}>
                          <table className="data-table">
                            <thead>
                              <tr>
                                <th>Email</th>
                                <th>Name</th>
                                <th>Joined</th>
                                <th>Orders</th>
                                <th>Total spent</th>
                                <th></th>
                              </tr>
                            </thead>
                            <tbody>
                              {clients.map((client) => (
                                <tr key={client._id}>
                                  <td>{client.email}</td>
                                  <td style={{ color: client.name ? "var(--fg)" : "var(--muted)" }}>{client.name ?? "N/A"}</td>
                                  <td style={{ color: "var(--muted)", fontSize: "0.8125rem", whiteSpace: "nowrap" }}>
                                    {new Date(client.joinDate).toLocaleDateString("en-ZA", { day: "numeric", month: "short", year: "numeric" })}
                                  </td>
                                  <td>{client.orderCount}</td>
                                  <td style={{ fontWeight: 600 }}>{fmt(client.totalSpent)}</td>
                                  <td>
                                    <button onClick={() => setViewingClientId(client._id)} className="action-btn">View orders</button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* ── SETTINGS ─────────────────────────────────────────────── */}
              {tab === "settings" && (
                <div>
                  <h2 style={{ fontSize: "1.25rem", marginBottom: "1.75rem" }}>Store settings</h2>
                  <form onSubmit={handleSaveSettings} style={{ maxWidth: 480 }}>
                    <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--r-md)", padding: "1.5rem", marginBottom: "1.5rem" }}>
                      <p style={{ fontWeight: 600, marginBottom: "1.25rem" }}>Delivery</p>
                      <div className="form-group" style={{ marginBottom: "1rem" }}>
                        <label>Delivery fee (R)</label>
                        <input type="number" min="0" step="1" value={settingsForm.deliveryFee}
                          onChange={(e) => setSettingsForm((f) => ({ ...f, deliveryFee: e.target.value }))} placeholder="80" />
                        <p style={{ fontSize: "0.8125rem", color: "var(--muted)", marginTop: "0.25rem" }}>Charged on orders below the free threshold</p>
                      </div>
                      <div className="form-group">
                        <label>Free delivery threshold (R)</label>
                        <input type="number" min="0" step="1" value={settingsForm.freeThreshold}
                          onChange={(e) => setSettingsForm((f) => ({ ...f, freeThreshold: e.target.value }))} placeholder="500" />
                        <p style={{ fontSize: "0.8125rem", color: "var(--muted)", marginTop: "0.25rem" }}>Orders at or above this amount get free delivery</p>
                      </div>
                    </div>

                    <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--r-md)", padding: "1.5rem", marginBottom: "1.5rem" }}>
                      <p style={{ fontWeight: 600, marginBottom: "1rem" }}>Store status</p>
                      <label style={{ display: "flex", alignItems: "center", gap: "0.75rem", cursor: "pointer" }}>
                        <input type="checkbox" checked={settingsForm.storeOpen}
                          onChange={(e) => setSettingsForm((f) => ({ ...f, storeOpen: e.target.checked }))}
                          style={{ width: "auto" }} />
                        <span>Store is open, accepting new orders</span>
                      </label>
                    </div>

                    <button type="submit" className="btn btn-primary" disabled={settingsSaving}>
                      {settingsSaved ? "Saved ✓" : settingsSaving ? "Saving…" : "Save settings"}
                    </button>
                  </form>
                </div>
              )}

            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
