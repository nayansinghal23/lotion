const ActivePlan = () => {
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
          <p className="font-bold text-2xl">Free</p>
          <p>Play around with all the features of Lotion for free.</p>
        </div>
        <p className="whitespace-nowrap m-auto">$0 / month</p>
      </div>
    </div>
  );
};

export default ActivePlan;
