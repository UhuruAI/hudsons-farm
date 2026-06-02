import { convexAuth } from "@convex-dev/auth/server";
import { Password } from "@convex-dev/auth/providers/Password";
import { ensureAdminProfile } from "./admin";

export const { auth, signIn, signOut, store } = convexAuth({
  providers: [Password],
  callbacks: {
    async afterUserCreatedOrUpdated(ctx, { userId, profile }) {
      await ensureAdminProfile(ctx, userId, profile.email);
    },
  },
});
