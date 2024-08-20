import { v } from "convex/values";

import { mutation, query } from "./_generated/server";

export const addNewUser = mutation({
  args: {
    userId: v.string(),
    name: v.string(),
    email: v.string(),
    image: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return "Unauthenticated";

    const userId = identity.subject;
    if (!userId || userId !== args.userId) return "Not authenticated";

    const existingUsers = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("email"), args.email))
      .collect();

    if (existingUsers.length === 0) {
      const user = await ctx.db.insert("users", {
        email: args.email,
        image: args.image,
        name: args.name,
        userId,
        notifications: [],
      });
      return user;
    }
    const existingUser = existingUsers[0];
    const updatedUser = await ctx.db.patch(existingUser._id, {
      email: args.email,
      image: args.image,
      name: args.name,
      userId,
    });
    return updatedUser;
  },
});

export const getNotifications = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return "Unauthenticated";

    const userId = identity.subject;
    if (!userId) return "Not authenticated";

    const users = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("userId"), userId))
      .collect();
    if (users.length === 0) return "User not found";

    const user = users[0];
    return user.notifications;
  },
});
