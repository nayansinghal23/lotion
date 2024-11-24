import { useTranslation } from "react-i18next";

import { ModeToggle } from "@/components/mode-toggle";

const Appearance = () => {
  const { t } = useTranslation();
  const { appearance }: any = t("settings");

  return (
    <div className="flex items-center justify-between md:px-[10%]">
      <div>
        <p className="sm:font-semibold">{appearance.title}</p>
        <p className="hidden sm:block">{appearance.description}</p>
      </div>
      <ModeToggle />
    </div>
  );
};

export default Appearance;
