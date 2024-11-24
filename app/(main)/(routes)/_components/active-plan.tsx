"use client";
import { useTranslation } from "react-i18next";
import { useQuery } from "convex/react";

import { api } from "@/convex/_generated/api";

const ActivePlan = () => {
  const { t } = useTranslation();
  const { active_plan, free, monthly, yearly }: any = t("settings");
  const displaySubscription = useQuery(api.users.displaySubscription, {});

  const getPlans = () => {
    if (
      !displaySubscription ||
      typeof displaySubscription === "string" ||
      displaySubscription.plans_purchased.length === 0 ||
      !displaySubscription.plans_purchased[0].status
    )
      return {
        plan_type: free.name,
        amount: free.amount,
        description: free.description,
      };
    return {
      plan_type:
        displaySubscription.plans_purchased[0].plan_type[0].toUpperCase() +
          displaySubscription.plans_purchased[0].plan_type.slice(1) ===
        "Monthly"
          ? monthly.name
          : yearly.name,
      amount:
        displaySubscription.plans_purchased[0].amount === "50"
          ? monthly.amount
          : yearly.amount,
      description: monthly.description,
    };
  };

  return (
    <div className="flex flex-col gap-2 md:px-[10%]">
      <div className="flex items-center w-full justify-between">
        <div>
          <p className="sm:font-semibold">{active_plan.title}</p>
          <p className="hidden sm:block">{active_plan.description}</p>
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
