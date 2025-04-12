import { convexTest } from "convex-test";
import { expect, test } from "vitest";

import { api } from "./_generated/api";
import schema from "./schema";

const user = {
  name: "Nayan Singhal",
  email: "nayansinghal393@gmail.com",
  subject: "user_2is1UOkNtIsBX1JclclkbtZsDS2",
  givenName: "Nayan",
  familyName: "Singhal",
  nickname: "nayansinghal23",
  pictureUrl:
    "https://img.clerk.com/eyJ0eXBlIjoicHJveHkiLCJzcmMiOiJodHRwczovL2ltYWdlcy5jbGVyay5kZXYvb2F1dGhfZ2l0aHViL2ltZ18yaXMxVU8wM1Q2RFlZRUdncVplbGZnekU5ZloifQ",
  emailVerified: true,
  phoneNumberVerified: false,
};

test("testing create docs functionality when parentDocument is not passed", async () => {
  const t = convexTest(schema);
  const identity = t.withIdentity(user);
  const today = new Date();
  const indexOf = today.toString().indexOf("GMT") - 1;

  const _id = await identity.mutation(api.documents.create, {
    time: `${today.toString().slice(0, indexOf)}`,
    title: "Untitled",
  });
  const lists = await identity.query(api.documents.getSidebar, {});

  expect(lists).toHaveLength(1);
  lists.forEach((list) => {
    expect(list).toHaveProperty("title", "Untitled");
    expect(list).toHaveProperty("_id", _id);
    expect(list).toHaveProperty("isArchived", false);
    expect(list).toHaveProperty("isPublished", false);
    expect(list).toHaveProperty("userId", user.subject);
    expect(list).toHaveProperty("shared");
    expect(list.shared).toHaveLength(1);
    expect(list.shared[0]).toBe(user.email);
  });
});
