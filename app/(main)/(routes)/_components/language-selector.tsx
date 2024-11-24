import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const LanguageSelector = () => {
  const { i18n, t } = useTranslation();
  const { language }: any = t("settings");
  const languages = [
    { code: "en", lang: "English" },
    { code: "fr", lang: "French" },
    { code: "hi", lang: "Hindi" },
  ];

  return (
    <div className="flex items-center justify-between md:px-[10%]">
      <div>
        <p className="sm:font-semibold">{language.title}</p>
        <p className="hidden sm:block">{language.description}</p>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button>{language.button}</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          {languages.map(({ code, lang }) => (
            <DropdownMenuCheckboxItem
              key={code}
              checked={i18n.language === code}
              disabled={i18n.language === code}
              onCheckedChange={() => i18n.changeLanguage(code)}
            >
              {lang}
            </DropdownMenuCheckboxItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default LanguageSelector;
