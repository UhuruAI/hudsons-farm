import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { requireAdmin } from "./admin";

export const get = query({
  args: {},
  handler: async (ctx) => {
    return ctx.db.query("siteSettings").first();
  },
});

export const update = mutation({
  args: {
    deliveryFee: v.optional(v.number()),
    freeThreshold: v.optional(v.number()),
    storeOpen: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    await requireAdmin(ctx, userId);

    const existing = await ctx.db.query("siteSettings").first();
    if (existing) {
      await ctx.db.patch(existing._id, args);
    } else {
      await ctx.db.insert("siteSettings", {
        deliveryFee: args.deliveryFee ?? 8000,
        freeThreshold: args.freeThreshold ?? 50000,
        storeOpen: args.storeOpen ?? true,
      });
    }
  },
});
