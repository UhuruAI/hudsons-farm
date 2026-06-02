import { mutation } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { requireAdmin } from "./admin";

export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx): Promise<string> => {
    const userId = await getAuthUserId(ctx);
    await requireAdmin(ctx, userId);
    return await ctx.storage.generateUploadUrl();
  },
});
