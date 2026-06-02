import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { ensureAdminProfile, isAdminEmail, userIsAdmin } from "./admin";

export const getProfile = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;
    return ctx.db
      .query("userProfiles")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .first();
  },
});

export const updateProfile = mutation({
  args: {
    name: v.optional(v.string()),
    phone: v.optional(v.string()),
    address: v.optional(
      v.object({
        street: v.optional(v.string()),
        suburb: v.optional(v.string()),
        city: v.optional(v.string()),
        province: v.optional(v.string()),
        postalCode: v.optional(v.string()),
      })
    ),
    notifications: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    const existing = await ctx.db
      .query("userProfiles")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .first();
    if (existing) {
      await ctx.db.patch(existing._id, args);
    } else {
      await ctx.db.insert("userProfiles", { userId, ...args });
    }
  },
});

export const isAdmin = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return false;
    return userIsAdmin(ctx, userId);
  },
});

export const getViewer = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;
    return ctx.db.get(userId);
  },
});

export const listClients = query({
  args: {},
  handler: async (ctx) => {
    const requesterId = await getAuthUserId(ctx);
    if (!requesterId) return [];
    if (!(await userIsAdmin(ctx, requesterId))) return [];

    const users = await ctx.db.query("users").collect();

    return Promise.all(
      users.map(async (user) => {
        const profile = await ctx.db
          .query("userProfiles")
          .withIndex("by_userId", (q) => q.eq("userId", user._id))
          .first();

        const orders = await ctx.db
          .query("orders")
          .withIndex("by_userId", (q) => q.eq("userId", user._id))
          .collect();

        const orderCount = orders.length;
        const totalSpent = orders
          .filter((o) => o.status !== "cancelled")
          .reduce((sum, o) => sum + o.total, 0);

        return {
          _id: user._id,
          email: (user as { email?: string }).email ?? "",
          name: profile?.name ?? null,
          joinDate: user._creationTime,
          orderCount,
          totalSpent,
          isAdmin: profile?.isAdmin === true || isAdminEmail((user as { email?: string }).email),
        };
      })
    );
  },
});

export const syncAdminProfile = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    const user = await ctx.db.get(userId);
    await ensureAdminProfile(ctx, userId, user?.email);
  },
});
