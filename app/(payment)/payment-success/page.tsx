"use client";
import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useMutation } from "convex/react";

import { api } from "@/convex/_generated/api";

const PaymentSuccess = ({
  searchParams: { amount },
}: {
  searchParams: { amount: string };
}) => {
  const { t } = useTranslation();
  const { title, description }: any = t("paymentSuccess");
  const addSubscription = useMutation(api.users.addSubscription);
  const initialized = useRef(false);

  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;
      const today = new Date();
      const indexOf = today.toString().indexOf("GMT") - 1;
      addSubscription({
        limits: amount === "50" ? 40 : Infinity,
        plan_type: amount === "50" ? "monthly" : "yearly",
        amount,
        purchased_at: `${today.toString().slice(0, indexOf)}`,
      });
    }
  }, []);

  return (
    <div className="w-full h-full flex flex-col justify-center items-center gap-2">
      <p className="text-3xl font-bold">{title}😊</p>
      <p>
        {description} ${amount}
      </p>
    </div>
  );
};

export default PaymentSuccess;
