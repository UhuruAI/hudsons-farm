import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

export default defineSchema({
  ...authTables,

  products: defineTable({
    name: v.string(),
    category: v.string(),
    price: v.number(),
    description: v.string(),
    image: v.optional(v.string()),
    storageId: v.optional(v.id("_storage")),
    inStock: v.boolean(),
    featured: v.optional(v.boolean()),
  })
    .index("by_category", ["category"])
    .index("by_inStock", ["inStock"]),

  orders: defineTable({
    userId: v.id("users"),
    email: v.string(),
    items: v.array(
      v.object({
        id: v.string(),
        name: v.string(),
        price: v.number(),
        quantity: v.number(),
        image: v.optional(v.string()),
      })
    ),
    subtotal: v.number(),
    deliveryFee: v.number(),
    total: v.number(),
    paystackRef: v.optional(v.string()),
    status: v.union(
      v.literal("pending"),
      v.literal("confirmed"),
      v.literal("shipped"),
      v.literal("delivered"),
      v.literal("cancelled")
    ),
    delivery: v.object({
      fullName: v.string(),
      phone: v.string(),
      address: v.string(),
      suburb: v.string(),
      city: v.string(),
      province: v.string(),
      postalCode: v.string(),
    }),
  })
    .index("by_userId", ["userId"])
    .index("by_status", ["status"]),

  userProfiles: defineTable({
    userId: v.id("users"),
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
    isAdmin: v.optional(v.boolean()),
    notifications: v.optional(v.boolean()),
  }).index("by_userId", ["userId"]),

  siteSettings: defineTable({
    deliveryFee: v.number(),
    freeThreshold: v.number(),
    storeOpen: v.boolean(),
  }),
});
