"use client";

import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";

const ActivePlan = () => {
  const displaySubscription = useQuery(api.users.displaySubscription, {});

  const getPlans = () => {
    if (
      !displaySubscription ||
      typeof displaySubscription === "string" ||
      displaySubscription.plans_purchased.length === 0
    )
      return {
        plan_type: "Free",
        amount: "$0 / month",
        description: "Play around with all the features of Lotion for free.",
      };
    return {
      plan_type:
        displaySubscription.plans_purchased[0].plan_type[0].toUpperCase() +
        displaySubscription.plans_purchased[0].plan_type.slice(1),
      amount:
        displaySubscription.plans_purchased[0].amount === "50"
          ? "$50 / month"
          : "$400 billed yearly",
      description:
        "Play around with all the features of Lotion and please keep an eye on when your plan ends.",
    };
  };

  return (
    <div className="flex flex-col gap-2 md:px-[10%]">
      <div className="flex items-center w-full justify-between">
        <div>
          <p className="sm:font-semibold">Active Plan</p>
          <p className="hidden sm:block">Please view your current plan.</p>
        </div>
      </div>
      <div className="w-full flex gap-5 border border-black dark:border-white dark:bg-[#2b2929] bg-neutral-300 rounded-xl p-5">
        <div>
          <p className="font-bold text-2xl">{getPlans().plan_type}</p>
          <p>{getPlans().description}</p>
        </div>
        <p className="whitespace-nowrap m-auto">{getPlans().amount}</p>
      </div>
    </div>
  );
};

export default ActivePlan;
