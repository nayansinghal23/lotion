import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "convex/react";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";

const UpgradePlan = () => {
  const router = useRouter();
  const plans = [
    {
      name: "Free",
      charges: "$0 / month",
      limits: ["Make 5 docs only", "Up to 3 shares per doc"],
    },
    {
      name: "Monthly",
      charges: "$50 / month",
      limits: ["Make 40 docs only", "Up to 50 shares per doc"],
    },
    {
      name: "Yearly",
      charges: "$400 billed yearly",
      limits: ["Make unlimited docs", "Unlimited shares per doc"],
    },
  ];
  const displaySubscription = useQuery(api.users.displaySubscription, {});

  const [show, setShow] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const handlePayment = async (charges: string) => {
    if (!displaySubscription || typeof displaySubscription === "string") return;
    if (displaySubscription.plans_purchased.length > 0) {
      const timeline = new Date(
        displaySubscription.plans_purchased[0].purchased_at
      );
      if (displaySubscription.plans_purchased[0].plan_type !== "free") {
        if (displaySubscription.plans_purchased[0].plan_type === "monthly") {
          timeline.setDate(timeline.getDate() + 30);
        } else if (
          displaySubscription.plans_purchased[0].plan_type === "yearly"
        ) {
          timeline.setDate(timeline.getDate() + 365);
        }
        if (timeline >= new Date()) {
          toast.promise(new Promise((resolve, reject) => resolve("")), {
            loading: "Upgrading...",
            success: `Already have ${displaySubscription.plans_purchased[0].plan_type} plan!`,
            error: "Failed to purchase plan.",
          });
          return;
        }
      }
    }
    try {
      const amount: number = charges.includes("50") ? 50 : 400;
      setLoading(true);
      const response = await fetch("/api/payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ amount }),
      });
      const data = await response.json();
      if (data?.url) {
        router.push(data?.url);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-2 md:px-[10%]">
      <div className="flex items-center w-full justify-between">
        <div>
          <p className="sm:font-semibold">Upgrade Plan</p>
          <p className="hidden sm:block">
            Click on the button to {show ? "hide" : "view"} plans.
          </p>
        </div>
        <Button onClick={() => setShow((prev) => !prev)}>
          {show ? <EyeOff /> : <Eye />}
        </Button>
      </div>
      {show && (
        <div className="w-full flex flex-col sm:flex-row gap-3">
          {plans.map(({ name, limits, charges }, index: number) => (
            <div
              className="flex sm:flex-col w-full items-center sm:items-start gap-4"
              key={index}
            >
              <div className="flex flex-col flex-1 gap-2">
                <p className="text-xl text-blue-500 font-medium">{name}</p>
                <p>{charges}</p>
                {limits.map((limit: string, index: number) => (
                  <p key={index}>- {limit}</p>
                ))}
              </div>
              {name !== "Free" && (
                <Button
                  className="w-max"
                  onClick={() => handlePayment(charges)}
                  disabled={loading}
                >
                  Pay
                </Button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UpgradePlan;
