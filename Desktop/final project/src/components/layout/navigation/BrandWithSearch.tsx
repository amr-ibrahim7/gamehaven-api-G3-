"use client";
import Logo from "@/components/Logo";
import { NavigationMenu } from "@/components/ui/navigation-menu";
import Link from "next/link";
import React from "react";
import { NavBarSearchInput } from "./NavBarSearchInput";
import { useParams } from "next/navigation";

export default function BrandWithSearch() {
  const { locale } = useParams();
  const isRTL = locale === "ar";

  return (
    <NavigationMenu
      dir={isRTL ? "rtl" : "ltr"}
      className="flex items-center justify-start gap-4 px-1 py-2 rounded-md"
    >
      <Link href="/" className="flex items-center">
        <Logo className="h-10 w-auto" />
      </Link>
      <NavBarSearchInput />
    </NavigationMenu>
  );
}
