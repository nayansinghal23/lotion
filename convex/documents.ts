import { v } from "convex/values";

import { mutation, query } from "./_generated/server";
import { Doc, Id } from "./_generated/dataModel";

export const create = mutation({
  args: {
    title: v.string(),
    parentDocument: v.optional(v.id("documents")),
    time: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity || !identity.email) throw new Error("Not authenticated");

    const userId = identity.subject;
    if (args.parentDocument) {
      const parentDocument = await ctx.db.get(args.parentDocument);
      if (parentDocument && parentDocument.shared.length > 1) {
        parentDocument.shared.forEach(async (email) => {
          const existingUsers = await ctx.db
            .query("users")
            .filter((q) => q.eq(q.field("email"), email))
            .collect();
          if (existingUsers.length !== 0) {
            const existingUser = existingUsers[0];
            await ctx.db.patch(existingUser._id, {
              unseen: existingUser.unseen + 1,
              notifications: [
                {
                  time: args.time,
                  title: `Child document of ${parentDocument.title} created by ${identity.email}`,
                  url: `${identity.pictureUrl}`,
                },
                ...existingUser.notifications,
              ],
            });
          }
        });
        const document = await ctx.db.insert("documents", {
          title: args.title,
          parentDocument: args.parentDocument,
          userId,
          isPublished: false,
          isArchived: false,
          shared: [...parentDocument.shared],
        });
        return document;
      }
    }
    const document = await ctx.db.insert("documents", {
      title: args.title,
      parentDocument: args.parentDocument,
      userId,
      isPublished: false,
      isArchived: false,
      shared: [identity.email],
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
    return documents.filter((q) => q.shared.length <= 1);
  },
});

export const getShared = query({
  args: {
    parentDocument: v.optional(v.id("documents")),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const documents = await ctx.db
      .query("documents")
      .filter((q) => q.eq(q.field("isArchived"), false))
      .order("desc")
      .collect();
    return documents.filter(
      (q) =>
        q.shared.length > 1 &&
        q.shared.includes(identity.email as string) &&
        q.parentDocument === args.parentDocument
    );
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
    if (!document) return null;
    if (document.shared.length <= 1 && document.userId !== userId) return null;

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
      .filter((q) => q.eq(q.field("isArchived"), true))
      .order("desc")
      .collect();
    return documents.filter((document) => {
      if (document.shared.length <= 1) {
        return document.userId === userId;
      } else {
        return document;
      }
    });
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
    if (
      existingDocument.shared.length <= 1 &&
      existingDocument.userId !== userId
    )
      return null;

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
    notification: v.object({
      title: v.string(),
      time: v.string(),
      url: v.string(),
    }),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const userId = identity.subject;
    const existingDocument = await ctx.db.get(args.id);
    if (!existingDocument) return "Not found";
    if (
      existingDocument.shared.length <= 1 &&
      existingDocument.userId !== userId
    )
      return null;

    if (existingDocument.shared.length > 1) {
      existingDocument.shared.forEach(async (email) => {
        const existingUsers = await ctx.db
          .query("users")
          .filter((q) => q.eq(q.field("email"), email))
          .collect();
        if (existingUsers.length !== 0) {
          const existingUser = existingUsers[0];
          await ctx.db.patch(existingUser._id, {
            notifications: [
              {
                time: args.notification.time,
                title: `${existingDocument.title} has been deleted by ${existingUser.email}`,
                url: identity.pictureUrl as string,
              },
              ...existingUser.notifications,
            ],
            unseen: existingUser.unseen + 1,
          });
        }
      });
    }

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
      .filter((q) => q.eq(q.field("isArchived"), false))
      .order("desc")
      .collect();
    return documents.filter((document) => {
      if (document.shared.length <= 1) {
        return document.userId === userId;
      } else {
        return document;
      }
    });
  },
});

export const getDocument = query({
  args: {
    id: v.string(),
  },
  handler: async (ctx, args) => {
    try {
      const identity = await ctx.auth.getUserIdentity();
      if (!identity) throw new Error("Not authenticated");

      const userId = identity.subject;
      const document = await ctx.db.get(args.id as Id<"documents">);
      if (!document) return null;
      if (document.shared.length <= 1 && document?.userId !== userId)
        return null;

      return document;
    } catch (error) {
      console.log(error);
    }
  },
});

export const getEmails = mutation({
  args: {
    id: v.id("documents"),
  },
  handler: async (ctx, args) => {
    try {
      const identity = await ctx.auth.getUserIdentity();
      if (!identity) throw new Error("Not authenticated");

      const userId = identity.subject;
      const users = await ctx.db
        .query("users")
        .filter((q) => q.eq(q.field("userId"), userId))
        .collect();

      const document = await ctx.db.get(args.id);
      if (!document) return "Document not found";
      if (
        (document.shared.length <= 1 && document?.userId !== userId) ||
        !document.shared.includes(users[0].email)
      )
        return "Not authorized";

      return document.shared;
    } catch (error) {
      return "Invalid document id";
    }
  },
});

export const modifyTitle = mutation({
  args: {
    title: v.string(),
    id: v.id("documents"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const document = await ctx.db.get(args.id);
    if (!document) return null;

    const updatedDocument = await ctx.db.patch(args.id, {
      title: args.title,
      lastEditedBy: identity.pictureUrl,
    });
    return updatedDocument;
  },
});

export const modifyIcon = mutation({
  args: {
    icon: v.string(),
    id: v.id("documents"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const document = await ctx.db.get(args.id);
    if (!document) return null;

    const updatedDocument = await ctx.db.patch(args.id, {
      icon: args.icon,
      lastEditedBy: identity.pictureUrl,
    });
    return updatedDocument;
  },
});

export const modifyCoverImage = mutation({
  args: {
    coverImage: v.string(),
    id: v.id("documents"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const document = await ctx.db.get(args.id);
    if (!document) return null;

    const updatedDocument = await ctx.db.patch(args.id, {
      coverImage: args.coverImage,
      lastEditedBy: identity.pictureUrl,
    });
    return updatedDocument;
  },
});

export const modifyContent = mutation({
  args: {
    content: v.string(),
    id: v.id("documents"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const document = await ctx.db.get(args.id);
    if (!document) return null;

    const updatedDocument = await ctx.db.patch(args.id, {
      content: args.content,
      lastEditedBy: identity.pictureUrl,
    });
    return updatedDocument;
  },
});

export const getMoveTo = query({
  args: {
    id: v.optional(v.id("documents")),
  },
  handler: async (ctx, args) => {
    if (!args.id) throw new Error("No Id found");
    const currDocument = await ctx.db.get(args.id);
    if (!currDocument) return null;

    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const userId = identity.subject;
    let documents = await ctx.db
      .query("documents")
      .filter((q) => q.eq(q.field("isArchived"), false))
      .filter((q) => q.neq(q.field("_id"), args.id))
      .order("desc")
      .collect();

    if (currDocument.shared.length <= 1) {
      documents = documents.filter(
        (q) => q.shared.length <= 1 && q.userId === userId
      );
    } else {
      documents = documents.filter(
        (q) =>
          q.shared.length > 1 && q.shared.includes(identity.email as string)
      );
    }

    const set = new Set<Id<"documents">>();
    documents.forEach((document) => set.add(document._id));

    const findingAllSubChildren = async (parent: Doc<"documents">) => {
      const children = await ctx.db
        .query("documents")
        .filter((q) => q.eq(q.field("parentDocument"), parent._id))
        .filter((q) => q.eq(q.field("isArchived"), false))
        .collect();
      for (let child of children) {
        if (set.has(child._id)) {
          set.delete(child._id);
        }
        await findingAllSubChildren(child);
      }
    };
    await findingAllSubChildren(currDocument);

    documents = documents.filter(
      (document) => set.has(document._id) && document
    );
    return documents;
  },
});

export const moveTo = mutation({
  args: {
    parentId: v.optional(v.id("documents")),
    id: v.id("documents"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const userId = identity.subject;
    const document = await ctx.db.get(args.id);
    if (!document) return null;

    if (document.userId !== userId) throw new Error("Unauthorized");

    if (document.isArchived) throw new Error("Archived");

    const updatedDocument = await ctx.db.patch(document._id, {
      parentDocument: args.parentId,
    });
    return updatedDocument;
  },
});

export const getRootLevel = query({
  args: {
    id: v.optional(v.id("documents")),
  },
  handler: async (ctx, args) => {
    if (!args.id) throw new Error("Id not found");

    const document = await ctx.db.get(args.id);
    if (!document) return null;
    if (document.isArchived) throw new Error("Archived");

    if (document.shared.length <= 1) {
      const identity = await ctx.auth.getUserIdentity();
      if (!identity) throw new Error("Not authenticated");

      const userId = identity.subject;
      if (document.userId !== userId) throw new Error("Unauthorized");
    }
    return document.parentDocument;
  },
});

export const addSharedMail = mutation({
  args: {
    id: v.id("documents"),
    to: v.string(),
    fromNotification: v.object({
      title: v.string(),
      time: v.string(),
      url: v.string(),
    }),
    toNotification: v.object({
      title: v.string(),
      time: v.string(),
      url: v.string(),
    }),
  },
  handler: async (ctx, args) => {
    if (!args.id) throw new Error("Id not found");

    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return "Not authenticated";

    const userId = identity.subject;
    const email = identity.email;
    if (!userId || !email) return "Not authenticated";

    const document = await ctx.db.get(args.id);
    if (!document) return "Document not found";
    if (document.shared.includes(args.to)) return "Notification already sent";

    const existingUsers = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("email"), email))
      .collect();
    if (existingUsers.length === 0) return "No user found";

    const children = await ctx.db
      .query("documents")
      .filter((q) => q.eq(q.field("parentDocument"), document._id))
      .order("desc")
      .collect();

    children.forEach(async (child) => {
      await ctx.db.patch(child._id, {
        parentDocument: document.parentDocument,
      });
    });
    const existingUser = existingUsers[0];
    await ctx.db.patch(existingUser._id, {
      subscription: {
        ...existingUser.subscription,
        docIds: existingUser.subscription.docIds.map((q) => {
          if (q.id === args.id) {
            return {
              ...q,
              shared: q.shared + 1,
            };
          }
          return q;
        }),
      },
      notifications: [args.fromNotification, ...existingUser.notifications],
      unseen: existingUser.unseen + 1,
    });
    await ctx.db.patch(args.id, {
      shared: [...document.shared, args.to],
      parentDocument: undefined,
    });
    const updatedDocument = await ctx.db.get(args.id);
    const remainingUsers = updatedDocument?.shared.filter((q) => q !== email);
    remainingUsers?.forEach(async (item) => {
      const fromUsers = await ctx.db
        .query("users")
        .filter((q) => q.eq(q.field("email"), item))
        .collect();
      if (fromUsers.length !== 0) {
        const fromUser = fromUsers[0];
        await ctx.db.patch(fromUser._id, {
          notifications: [args.toNotification, ...fromUser.notifications],
          unseen: fromUser.unseen + 1,
        });
      } else {
        await ctx.db.insert("users", {
          email: item,
          name: "",
          image: "",
          userId: "",
          notifications: [args.toNotification],
          unseen: 1,
          subscription: {
            docIds: [],
            limits: 5,
            plans_purchased: [],
          },
        });
      }
    });
    return "Success";
  },
});

export const addUnsharedMail = mutation({
  args: {
    id: v.id("documents"),
    emails: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    if (!args.id) throw new Error("Id not found");

    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return "Not authenticated";

    const document = await ctx.db.get(args.id);
    if (!document) return "Document not found";

    const existingUsers = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("userId"), identity.subject))
      .collect();
    if (existingUsers.length === 0) return "No user found";

    const existingUser = existingUsers[0];
    const updatedDocument = await ctx.db.patch(args.id, {
      shared: args.emails,
      parentDocument: undefined,
    });
    const childArr = await ctx.db
      .query("documents")
      .filter((q) => q.eq(q.field("parentDocument"), document._id))
      .collect();
    if (childArr.length > 0) {
      await ctx.db.patch(childArr[0]._id, {
        parentDocument: document.parentDocument,
      });
    }
    await ctx.db.patch(existingUser._id, {
      subscription: {
        ...existingUser.subscription,
        docIds: existingUser.subscription.docIds.map((q) => {
          if (q.id === args.id) {
            return {
              ...q,
              shared: args.emails.length,
            };
          }
          return q;
        }),
      },
    });
    const today = new Date();
    const indexOf = today.toString().indexOf("GMT") - 1;
    const not_shared: string[] = document.shared.filter(
      (mail) => !args.emails.includes(mail)
    );

    for (let i = 0; i < args.emails.length; i++) {
      const users = await ctx.db
        .query("users")
        .filter((q) => q.eq(q.field("email"), args.emails[i]))
        .collect();
      if (users.length > 0) {
        const user = users[0];
        await ctx.db.patch(user._id, {
          notifications: [
            {
              time: `${today.toString().slice(0, indexOf)}`,
              title: `Unshared ${document.title} by ${identity.email} from ${not_shared.join(", ")}`,
              url: `${identity.pictureUrl}`,
            },
            ...user.notifications,
          ],
          unseen: user.unseen + 1,
        });
      }
    }

    for (let i = 0; i < not_shared.length; i++) {
      const users = await ctx.db
        .query("users")
        .filter((q) => q.eq(q.field("email"), not_shared[i]))
        .collect();
      if (users.length > 0) {
        const user = users[0];
        await ctx.db.patch(user._id, {
          notifications: [
            {
              time: `${today.toString().slice(0, indexOf)}`,
              title: `Unshared ${document.title} by ${identity.email}`,
              url: `${identity.pictureUrl}`,
            },
            ...user.notifications,
          ],
          unseen: user.unseen + 1,
        });
      }
    }

    return updatedDocument;
  },
});
