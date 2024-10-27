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
        unseen: 0,
        subscription: {
          docIds: [],
          limits: 5,
          plans_purchased: [],
        },
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

export const toggleSeen = mutation({
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
    await ctx.db.patch(user._id, {
      unseen: 0,
    });
    return "Seen updated";
  },
});

export const displayUnseen = query({
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
    return user.unseen;
  },
});

export const addSubscription = mutation({
  args: {
    limits: v.number(),
    plan_type: v.string(),
    amount: v.string(),
    purchased_at: v.string(),
  },
  handler: async (ctx, args) => {
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

    const updatedUser = await ctx.db.patch(user._id, {
      subscription: {
        ...user.subscription,
        limits: args.limits,
        plans_purchased: [
          {
            plan_type: args.plan_type,
            purchased_at: args.purchased_at,
            amount: args.amount,
            status: true,
          },
          ...user.subscription.plans_purchased.map((plan) => {
            plan.status = false;
            return plan;
          }),
        ],
      },
      notifications: [
        {
          title: `🥳Congrats on successfully upgrading to ${args.plan_type} plan by paying $${args.amount}.`,
          time: args.purchased_at,
          url: `${identity.pictureUrl}`,
        },
        ...user.notifications,
      ],
      unseen: user.unseen + 1,
    });
    return updatedUser;
  },
});

export const displaySubscription = query({
  handler: async (ctx, args) => {
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
    return user.subscription;
  },
});

export const updatingDocIds = mutation({
  args: {
    id: v.id("documents"),
    type: v.string(),
  },
  handler: async (ctx, args) => {
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

    if (args.type === "create") {
      const documents = await ctx.db
        .query("documents")
        .filter((q) => q.eq(q.field("_id"), args.id))
        .order("desc")
        .collect();
      if (documents.length === 0) return "Document not found";
      const document = documents[0];

      const updatedUser = await ctx.db.patch(user._id, {
        subscription: {
          ...user.subscription,
          docIds: [
            ...user.subscription.docIds,
            {
              id: args.id,
              shared: document.shared.length,
            },
          ],
        },
      });
      return updatedUser;
    }
    const updatedUser = await ctx.db.patch(user._id, {
      subscription: {
        ...user.subscription,
        docIds: user.subscription.docIds.filter((q) => q.id !== args.id),
      },
    });
    return updatedUser;
  },
});

export const paymentTimesUp = mutation({
  args: {
    time: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return "Unauthenticated";

    const userId = identity.subject;
    if (!userId) return "Not authenticated";

    const users = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("userId"), userId))
      .collect();
    if (!users || users.length === 0) return "User not found";

    const user = users[0];
    user.subscription.docIds.forEach(async ({ id, shared }, index: number) => {
      const documents = await ctx.db
        .query("documents")
        .filter((q) => q.eq(q.field("_id"), id))
        .collect();
      if (!documents || documents.length === 0) return "Document not found";
      const document = documents[0];
      if (index >= 5) {
        await ctx.db.delete(document._id);
      } else {
        await ctx.db.patch(document._id, {
          shared: document.shared.filter((doc, i) => {
            if (i <= 2) return doc;
          }),
        });
      }
    });
    await ctx.db.patch(user._id, {
      subscription: {
        plans_purchased: user.subscription.plans_purchased.map(
          (plan, index) => {
            if (index === 0) plan.status = false;
            return plan;
          }
        ),
        limits: 5,
        docIds: user.subscription.docIds.slice(0, 5).map((docId) => {
          if (docId.shared >= 3) {
            docId.shared = 3;
          }
          return docId;
        }),
      },
      notifications: [
        {
          time: args.time,
          title: `Your ${user.subscription.plans_purchased[0].plan_type} subscription has been expired😥.`,
          url: identity.pictureUrl as string,
        },
        ...user.notifications,
      ],
      unseen: user.unseen + 1,
    });
  },
});
