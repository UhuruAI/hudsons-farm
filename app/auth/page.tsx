"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthActions } from "@convex-dev/auth/react";
import { useConvexAuth, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import Link from "next/link";

type Flow = "signIn" | "signUp";

export default function AuthPage() {
  const router = useRouter();
  const { signIn, signOut } = useAuthActions();
  const { isAuthenticated, isLoading } = useConvexAuth();
  const adminCheck = useQuery(api.users.isAdmin);

  const [flow, setFlow] = useState<Flow>("signIn");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isLoading && isAuthenticated && !success) {
      if (adminCheck === true) {
        router.replace("/admin");
      } else if (adminCheck === false) {
        router.replace("/dashboard");
      }
    }
  }, [isLoading, isAuthenticated, adminCheck, router, success]);

  if (!isLoading && isAuthenticated && !success) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (flow === "signUp" && password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setSubmitting(true);
    try {
      await signIn("password", { email, password, flow });

      if (flow === "signUp") {
        await signOut();
        setSuccess("Account created successfully. Please sign in with your credentials.");
        setFlow("signIn");
        setPassword("");
        setConfirm("");
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setError(
        msg.includes("Invalid") || msg.includes("credentials")
          ? "Invalid email or password."
          : msg.includes("exists") || msg.includes("duplicate")
          ? "An account with this email already exists."
          : "Something went wrong. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main>
      <div className="page-hero">
        <div className="container">
          <span className="eyebrow">Revayah Sanctuary</span>
          <h1>{flow === "signIn" ? "Sign in" : "Create account"}</h1>
        </div>
      </div>

      <section className="section">
        <div className="container" style={{ maxWidth: 440, margin: "0 auto" }}>
          <div className="auth-card">
            <div className="auth-crest">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M11 20A7 7 0 0 1 4 13c0-5 4-9 9-9 0 0 3 5 3 9a7 7 0 0 1-5 7Z" /><path d="M11 20c0-4 2-7.5 5-9.5" /></svg>
              <span>REVAYAH SANCTUARY</span>
            </div>

            <div className="auth-tabs">
              {(["signIn", "signUp"] as Flow[]).map((f) => (
                <button
                  key={f}
                  className={`auth-tab${flow === f ? " active" : ""}`}
                  onClick={() => { setFlow(f); setError(""); setSuccess(""); }}
                >
                  {f === "signIn" ? "Sign in" : "Register"}
                </button>
              ))}
            </div>

            {success && <div className="booking-success" style={{ marginBottom: "1.25rem", padding: "0.875rem 1rem" }}>{success}</div>}

            <form onSubmit={handleSubmit}>
              <div className="form-group" style={{ marginBottom: "1rem" }}>
                <label>Email address</label>
                <input type="email" required placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div className="form-group" style={{ marginBottom: "1rem" }}>
                <label>Password</label>
                <input type="password" required placeholder="At least 8 characters" value={password} onChange={(e) => setPassword(e.target.value)} />
              </div>
              {flow === "signUp" && (
                <div className="form-group" style={{ marginBottom: "1rem" }}>
                  <label>Confirm password</label>
                  <input type="password" required placeholder="Repeat your password" value={confirm} onChange={(e) => setConfirm(e.target.value)} />
                </div>
              )}

              {error && <div className="auth-error">{error}</div>}

              <button type="submit" className="btn btn-solid" style={{ width: "100%" }} disabled={submitting}>
                {submitting ? "Please wait…" : flow === "signIn" ? "Sign in" : "Create account"}
              </button>
            </form>

            <p style={{ textAlign: "center", fontSize: "0.8125rem", color: "var(--muted)", marginTop: "1.25rem" }}>
              {flow === "signIn" ? "Don't have an account? " : "Already have an account? "}
              <button
                onClick={() => { setFlow(flow === "signIn" ? "signUp" : "signIn"); setError(""); setSuccess(""); }}
                style={{ background: "none", border: "none", cursor: "pointer", color: "var(--accent)", fontWeight: 600, fontSize: "0.8125rem", padding: 0 }}
              >
                {flow === "signIn" ? "Create one" : "Sign in"}
              </button>
            </p>
          </div>

          <p style={{ textAlign: "center", fontSize: "0.8125rem", color: "var(--muted)", marginTop: "1.5rem" }}>
            <Link href="/shop" style={{ color: "var(--muted)" }}>← Back to shop</Link>
          </p>
        </div>
      </section>
    </main>
  );
}
