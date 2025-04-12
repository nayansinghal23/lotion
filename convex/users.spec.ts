import { convexTest } from "convex-test";
import { expect, test } from "vitest";

import schema from "./schema";
import { api } from "./_generated/api";

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

test("testing display subscription functionality for free user", async () => {
  const t = convexTest(schema);
  const identity = t.withIdentity(user);

  await identity.mutation(api.users.addNewUser, {
    email: user.email,
    image: user.pictureUrl,
    name: user.name,
    userId: user.subject,
  });
  const subscription = await identity.query(api.users.displaySubscription, {});

  expect(subscription).toHaveProperty("docIds", []);
  expect(subscription).toHaveProperty("limits", 5);
  expect(subscription).toHaveProperty("plans_purchased", []);
});

test("testing updating docIds for free user", async () => {
  const t = convexTest(schema);
  const identity = t.withIdentity(user);
  const today = new Date();
  const indexOf = today.toString().indexOf("GMT") - 1;

  await identity.mutation(api.users.addNewUser, {
    email: user.email,
    image: user.pictureUrl,
    name: user.name,
    userId: user.subject,
  });
  const id = await identity.mutation(api.documents.create, {
    time: `${today.toString().slice(0, indexOf)}`,
    title: "Untitled",
  });
  await identity.mutation(api.users.updatingDocIds, {
    id,
    type: "create",
  });
  const subscription = await identity.query(api.users.displaySubscription, {});

  expect(subscription).toHaveProperty("docIds", [{ id, shared: 1 }]);
  expect(subscription).toHaveProperty("limits", 5);
  expect(subscription).toHaveProperty("plans_purchased", []);
});
