import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

const orderItemValidator = v.object({
  id: v.string(),
  name: v.string(),
  price: v.number(),
  quantity: v.number(),
  image: v.optional(v.string()),
});

const deliveryValidator = v.object({
  fullName: v.string(),
  phone: v.string(),
  address: v.string(),
  suburb: v.string(),
  city: v.string(),
  province: v.string(),
  postalCode: v.string(),
});

export const create = mutation({
  args: {
    items: v.array(orderItemValidator),
    subtotal: v.number(),
    deliveryFee: v.number(),
    total: v.number(),
    delivery: deliveryValidator,
    email: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    return ctx.db.insert("orders", {
      ...args,
      userId,
      status: "pending",
    });
  },
});

export const confirmPayment = mutation({
  args: { id: v.id("orders"), paystackRef: v.string() },
  handler: async (ctx, { id, paystackRef }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    const order = await ctx.db.get(id);
    if (!order || order.userId !== userId) throw new Error("Order not found");
    await ctx.db.patch(id, { status: "confirmed", paystackRef });
  },
});

export const cancel = mutation({
  args: { id: v.id("orders") },
  handler: async (ctx, { id }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    const order = await ctx.db.get(id);
    if (!order || order.userId !== userId) throw new Error("Order not found");
    await ctx.db.patch(id, { status: "cancelled" });
  },
});

export const listMine = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];
    return ctx.db
      .query("orders")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .order("desc")
      .collect();
  },
});

export const listAll = query({
  args: {
    status: v.optional(v.string()),
    userId: v.optional(v.id("users")),
  },
  handler: async (ctx, { status, userId: filterUserId }) => {
    const requesterId = await getAuthUserId(ctx);
    if (!requesterId) return [];
    const profile = await ctx.db
      .query("userProfiles")
      .withIndex("by_userId", (q) => q.eq("userId", requesterId))
      .first();
    if (!profile?.isAdmin) return [];

    if (filterUserId) {
      return ctx.db
        .query("orders")
        .withIndex("by_userId", (q) => q.eq("userId", filterUserId))
        .order("desc")
        .collect();
    }

    if (status && status !== "all") {
      return ctx.db
        .query("orders")
        .withIndex("by_status", (q) =>
          q.eq(
            "status",
            status as "pending" | "confirmed" | "shipped" | "delivered" | "cancelled"
          )
        )
        .order("desc")
        .collect();
    }
    return ctx.db.query("orders").order("desc").collect();
  },
});

export const updateStatus = mutation({
  args: {
    id: v.id("orders"),
    status: v.union(
      v.literal("pending"),
      v.literal("confirmed"),
      v.literal("shipped"),
      v.literal("delivered"),
      v.literal("cancelled")
    ),
  },
  handler: async (ctx, { id, status }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    const profile = await ctx.db
      .query("userProfiles")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .first();
    if (!profile?.isAdmin) throw new Error("Not authorized");
    await ctx.db.patch(id, { status });
  },
});
