const PaymentSuccess = ({
  searchParams: { amount },
}: {
  searchParams: { amount: string };
}) => {
  return (
    <div className="w-full h-full flex flex-col justify-center items-center gap-2">
      <p className="text-3xl font-bold">Thank you😊</p>
      <p>You successfully sent ${amount}</p>
    </div>
  );
};

export default PaymentSuccess;
