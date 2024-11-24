"use client";
import { useTranslation } from "react-i18next";

const PaymentCancel = () => {
  const { t } = useTranslation();
  const { title, description }: any = t("paymentCancel");

  return (
    <div className="w-full h-full flex flex-col justify-center items-center gap-2">
      <p className="text-3xl font-bold">{title}😥</p>
      <p>{description}</p>
    </div>
  );
};

export default PaymentCancel;
