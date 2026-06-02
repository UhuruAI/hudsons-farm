import { GenericId } from "convex/values";

const ADMIN_EMAILS = new Set(["peter@hudsons-farm.co.za"]);

export function isAdminEmail(email?: string | null) {
  return email !== undefined && email !== null && ADMIN_EMAILS.has(email.toLowerCase());
}

export async function userIsAdmin(ctx: any, userId: GenericId<"users">) {
  const profile = await ctx.db
    .query("userProfiles")
    .withIndex("by_userId", (q: any) => q.eq("userId", userId))
    .first();
  if (profile?.isAdmin === true) return true;

  const user = await ctx.db.get(userId);
  return isAdminEmail(user?.email);
}

export async function requireAdmin(ctx: any, userId: GenericId<"users"> | null) {
  if (!userId) throw new Error("Not authenticated");
  if (!(await userIsAdmin(ctx, userId))) throw new Error("Not authorized");
}

export async function ensureAdminProfile(ctx: any, userId: GenericId<"users">, email?: string | null) {
  if (!isAdminEmail(email)) return;

  const existing = await ctx.db
    .query("userProfiles")
    .withIndex("by_userId", (q: any) => q.eq("userId", userId))
    .first();

  if (existing) {
    if (existing.isAdmin !== true) {
      await ctx.db.patch(existing._id, { isAdmin: true });
    }
  } else {
    await ctx.db.insert("userProfiles", { userId, isAdmin: true });
  }
}
