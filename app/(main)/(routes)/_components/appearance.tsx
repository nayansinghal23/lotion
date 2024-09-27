import { ModeToggle } from "@/components/mode-toggle";

const Appearance = () => {
  return (
    <div className="flex items-center justify-between md:px-[10%]">
      <div>
        <p className="sm:font-semibold">Appearance</p>
        <p className="hidden sm:block">
          Click on the button to toggle theme to light or dark.
        </p>
      </div>
      <ModeToggle />
    </div>
  );
};

export default Appearance;
