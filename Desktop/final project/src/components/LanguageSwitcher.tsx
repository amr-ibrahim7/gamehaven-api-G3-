"use client";

import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Check, Globe } from "lucide-react";

const LanguageSwitcher = () => {
  const t = useTranslations();
  const locale = useLocale();

  const languages = [
    { code: "en", label: "EN", name: t("language.english") },
    { code: "ar", label: "AR", name: t("language.arabic") },
  ];

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Globe className="w-5 h-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {languages.map((lang) => (
          <DropdownMenuItem asChild key={lang.code}>
            <Link href={`/${lang.code}`} className="flex items-center justify-between w-full">
              <span>{lang.name}</span>
              {locale === lang.code && <Check className="w-4 h-4 " />}
            </Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSwitcher;
