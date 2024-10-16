import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  documents: defineTable({
    title: v.string(),
    userId: v.string(),
    isArchived: v.boolean(),
    parentDocument: v.optional(v.id("documents")),
    content: v.optional(v.string()),
    coverImage: v.optional(v.string()),
    icon: v.optional(v.string()),
    isPublished: v.boolean(),
    shared: v.array(v.string()),
    lastEditedBy: v.optional(v.string()),
  })
    .index("by_user", ["userId"])
    .index("by_user_parent", ["userId", "parentDocument"]),
  users: defineTable({
    userId: v.string(),
    name: v.string(),
    email: v.string(),
    image: v.string(),
    notifications: v.array(
      v.object({
        title: v.string(),
        time: v.string(),
        url: v.string(),
      })
    ),
    unseen: v.number(),
    subscription: v.object({
      limits: v.number(),
      docIds: v.array(
        v.object({
          id: v.id("documents"),
          shared: v.number(),
        })
      ),
      plans_purchased: v.array(
        v.object({
          plan_type: v.string(),
          purchased_at: v.string(),
          amount: v.string(),
        })
      ),
    }),
  }),
});
