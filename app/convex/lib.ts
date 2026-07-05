import { ConvexError } from "convex/values";
import type { QueryCtx, MutationCtx } from "./_generated/server";

/** Get the authenticated user's profile, throws ConvexError if not found. */
export async function getAuthUser(ctx: QueryCtx | MutationCtx) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) throw new ConvexError("NOT_AUTHENTICATED");

  const user = await ctx.db
    .query("userProfile")
    .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
    .unique();
  if (!user) throw new ConvexError("USER_NOT_FOUND");

  return user;
}

/** Get authenticated user or return null (for queries that allow unauthenticated). */
export async function getAuthUserOrNull(ctx: QueryCtx | MutationCtx) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) return null;

  return ctx.db
    .query("userProfile")
    .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
    .unique();
}
