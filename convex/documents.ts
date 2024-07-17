import { v } from "convex/values";

import { mutation, query } from "./_generated/server";
import { Doc } from "./_generated/dataModel";

export const create = mutation({
  args: {
    title: v.string(),
    parentDocument: v.optional(v.id("documents")),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const userId = identity.subject;
    const document = await ctx.db.insert("documents", {
      title: args.title,
      parentDocument: args.parentDocument,
      userId,
      isPublished: false,
      isArchived: false,
    });
    return document;
  },
});

export const getSidebar = query({
  args: {
    parentDocument: v.optional(v.id("documents")),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const userId = identity.subject;
    const documents = await ctx.db
      .query("documents")
      .withIndex("by_user_parent", (q) =>
        q.eq("userId", userId).eq("parentDocument", args.parentDocument)
      )
      .filter((q) => q.eq(q.field("isArchived"), false))
      .order("desc")
      .collect();
    return documents;
  },
});

export const archive = mutation({
  args: {
    id: v.id("documents"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const userId = identity.subject;
    const document = await ctx.db.get(args.id);
    if (!document) throw new Error("Not found");
    if (document.userId !== userId) throw new Error("Unauthorized");

    const findingAllSubChildren = async (parent: Doc<"documents">) => {
      const children = await ctx.db
        .query("documents")
        .filter((q) => q.eq(q.field("parentDocument"), parent._id))
        .collect();
      for (let child of children) {
        await findingAllSubChildren(child);
        await ctx.db.patch(child._id, {
          isArchived: true,
        });
      }
    };
    await findingAllSubChildren(document);

    const archivedDocument = await ctx.db.patch(document._id, {
      isArchived: true,
    });
    return archivedDocument;
  },
});

export const getTrash = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const userId = identity.subject;
    const documents = await ctx.db
      .query("documents")
      .filter((q) => q.eq(q.field("userId"), userId))
      .filter((q) => q.eq(q.field("isArchived"), true))
      .order("desc")
      .collect();
    return documents;
  },
});

export const restore = mutation({
  args: {
    id: v.id("documents"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const userId = identity.subject;
    const existingDocument = await ctx.db.get(args.id);
    if (!existingDocument) throw new Error("Not found");
    if (existingDocument.userId !== userId) throw new Error("Unauthorized");

    async function makeChildrenUnarchive(parent: Doc<"documents">) {
      const children = await ctx.db
        .query("documents")
        .filter((q) => q.eq(q.field("userId"), userId))
        .filter((q) => q.eq(q.field("parentDocument"), parent._id))
        .collect();
      for (let child of children) {
        await makeChildrenUnarchive(child);
        await ctx.db.patch(child._id, {
          isArchived: false,
        });
      }
    }
    makeChildrenUnarchive(existingDocument);

    const document = await ctx.db.patch(existingDocument._id, {
      isArchived: false,
      parentDocument: undefined,
    });
    return document;
  },
});

export const remove = mutation({
  args: {
    id: v.id("documents"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const userId = identity.subject;
    const existingDocument = await ctx.db.get(args.id);
    if (!existingDocument) throw new Error("Not found");
    if (existingDocument.userId !== userId) throw new Error("Unauthorized");

    const document = await ctx.db.delete(args.id);
    return document;
  },
});

export const getSearch = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const userId = identity.subject;
    const documents = await ctx.db
      .query("documents")
      .filter((q) => q.eq(q.field("userId"), userId))
      .filter((q) => q.eq(q.field("isArchived"), false))
      .order("desc")
      .collect();
    return documents;
  },
});
