import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { requireAdmin } from "./admin";

async function resolveImageUrl(ctx: { storage: { getUrl: (id: string) => Promise<string | null> } }, p: { storageId?: string; image?: string }) {
  if (p.storageId) return await ctx.storage.getUrl(p.storageId);
  return p.image ?? null;
}

export const list = query({
  args: { category: v.optional(v.string()) },
  handler: async (ctx, { category }) => {
    let products;
    if (category && category !== "All") {
      products = await ctx.db
        .query("products")
        .withIndex("by_category", (q) => q.eq("category", category))
        .filter((q) => q.eq(q.field("inStock"), true))
        .collect();
    } else {
      products = await ctx.db
        .query("products")
        .withIndex("by_inStock", (q) => q.eq("inStock", true))
        .collect();
    }
    return Promise.all(
      products.map(async (p) => ({ ...p, imageUrl: await resolveImageUrl(ctx, p) }))
    );
  },
});

export const listAll = query({
  args: {},
  handler: async (ctx) => {
    const products = await ctx.db.query("products").collect();
    return Promise.all(
      products.map(async (p) => ({ ...p, imageUrl: await resolveImageUrl(ctx, p) }))
    );
  },
});

export const get = query({
  args: { id: v.id("products") },
  handler: async (ctx, { id }) => {
    const p = await ctx.db.get(id);
    if (!p) return null;
    return { ...p, imageUrl: await resolveImageUrl(ctx, p) };
  },
});

export const create = mutation({
  args: {
    name: v.string(),
    category: v.string(),
    price: v.number(),
    description: v.string(),
    image: v.optional(v.string()),
    storageId: v.optional(v.id("_storage")),
    inStock: v.boolean(),
    featured: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx, await getAuthUserId(ctx));
    return ctx.db.insert("products", args);
  },
});

export const update = mutation({
  args: {
    id: v.id("products"),
    name: v.optional(v.string()),
    category: v.optional(v.string()),
    price: v.optional(v.number()),
    description: v.optional(v.string()),
    image: v.optional(v.string()),
    storageId: v.optional(v.id("_storage")),
    inStock: v.optional(v.boolean()),
    featured: v.optional(v.boolean()),
  },
  handler: async (ctx, { id, ...fields }) => {
    await requireAdmin(ctx, await getAuthUserId(ctx));
    await ctx.db.patch(id, fields);
  },
});

export const remove = mutation({
  args: { id: v.id("products") },
  handler: async (ctx, { id }) => {
    await requireAdmin(ctx, await getAuthUserId(ctx));
    const product = await ctx.db.get(id);
    if (product?.storageId) {
      await ctx.storage.delete(product.storageId);
    }
    await ctx.db.delete(id);
  },
});

export const seed = mutation({
  args: {},
  handler: async (ctx) => {
    const existing = await ctx.db.query("products").first();
    if (existing) return "Already seeded";

    const products = [
      { name: "Ginger Molasses Biscuits", category: "Baked Goods", price: 8900, description: "12 biscuits, ±420g. Warming ginger and rich molasses in every bite.", inStock: true, featured: true },
      { name: "Chocolate Chip Biscuits", category: "Baked Goods", price: 12900, description: "12 biscuits, ±500g. Classic comfort with premium chocolate chips.", inStock: true, featured: false },
      { name: "Red Velvet White Chocolate Biscuits", category: "Baked Goods", price: 13900, description: "12 biscuits, ±500g. Indulgent red velvet with white chocolate.", inStock: true, featured: false },
      { name: "Premium Fudgy Brownies", category: "Baked Goods", price: 21000, description: "Box of 4. Dense, fudgy, and deeply chocolatey.", inStock: true, featured: true },
      { name: "Shallot Chilli Crunch", category: "Pantry", price: 14900, description: "250ml jar. Crispy shallots, chilli, and umami depth.", inStock: true, featured: true },
      { name: "Durban Fire Relish", category: "Pantry", price: 7000, description: "250ml jar. Bold Durban heat with a fruity backbone.", inStock: true, featured: false },
      { name: "Caramelised Onion & Thyme Marmalade", category: "Pantry", price: 15500, description: "250ml jar. Sweet, savoury, and slow-cooked.", inStock: true, featured: false },
      { name: "Basil & Almond Pesto", category: "Pantry", price: 14500, description: "250ml jar. Farm-fresh basil with toasted almonds.", inStock: true, featured: false },
      { name: "Strawberry Vanilla Jam", category: "Jam Range", price: 11500, description: "250ml jar. Classic strawberry lifted with real vanilla.", inStock: true, featured: false },
      { name: "Blueberry Jam", category: "Jam Range", price: 13500, description: "250ml jar. Rich, antioxidant-packed blueberry preserve.", inStock: true, featured: false },
      { name: "Roasted Pineapple & Ginger Jam", category: "Jam Range", price: 13000, description: "250ml jar. Caramelised pineapple with a ginger kick.", inStock: true, featured: true },
      { name: "Signature Roasted Masala", category: "Spice Range", price: 12000, description: "150g pack. The house blend — roasted and deeply aromatic.", inStock: true, featured: false },
      { name: "Garam Masala", category: "Spice Range", price: 12500, description: "150g pack. Warm, balanced, and freshly ground.", inStock: true, featured: false },
      { name: "Royal Biryani Masala", category: "Spice Range", price: 13500, description: "150g pack. Fragrant and complex — made for layered rice dishes.", inStock: true, featured: false },
      { name: "Artisan Chai Spice Blend", category: "Chai", price: 12500, description: "150g pouch. Cinnamon, cardamom, ginger, cloves, and black pepper.", inStock: true, featured: true },
    ];

    for (const product of products) {
      await ctx.db.insert("products", product);
    }
    return "Seeded 15 products";
  },
});

export const seedImages = mutation({
  args: {},
  handler: async (ctx) => {
    const imageMap: Record<string, string> = {
      "Ginger Molasses Biscuits":            "/products/ginger-molasses-biscuits.jpg",
      "Chocolate Chip Biscuits":             "/products/chocolate-chip-biscuits.jpg",
      "Red Velvet White Chocolate Biscuits": "/products/red-velvet-white-chocolate-biscuits.jpg",
      "Premium Fudgy Brownies":              "/products/premium-fudgy-brownies.jpg",
      "Shallot Chilli Crunch":               "/products/shallot-chilli-crunch.jpg",
      "Durban Fire Relish":                  "/products/durban-fire-relish.jpg",
      "Caramelised Onion & Thyme Marmalade": "/products/caramelised-onion-thyme-marmalade.jpg",
      "Basil & Almond Pesto":                "/products/basil-almond-pesto.jpg",
      "Strawberry Vanilla Jam":              "/products/strawberry-vanilla-jam.jpg",
      "Blueberry Jam":                       "/products/blueberry-jam.jpg",
      "Roasted Pineapple & Ginger Jam":      "/products/roasted-pineapple-ginger-jam.jpg",
      "Signature Roasted Masala":            "/products/signature-roasted-masala.jpg",
      "Garam Masala":                        "/products/garam-masala.jpg",
      "Royal Biryani Masala":                "/products/royal-biryani-masala.jpg",
      "Artisan Chai Spice Blend":            "/products/artisan-chai-spice-blend.jpg",
    };

    const products = await ctx.db.query("products").collect();
    let updated = 0;
    for (const p of products) {
      const img = imageMap[p.name];
      if (img && p.image !== img) {
        await ctx.db.patch(p._id, { image: img });
        updated++;
      }
    }
    return `Updated ${updated} product images`;
  },
});
