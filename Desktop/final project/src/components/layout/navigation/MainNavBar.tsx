"use client";

import * as React from "react";
import UserMenu from "./UserMenu";
import NavBar from "./NavBar";
import BrandWithSearch from "./BrandWithSearch";
import MobileMenuWithIcon from "./MobileMenuWithIcon";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useParams } from "next/navigation";

export function MainNavBar() {
  // const [menuOpen, setMenuOpen] = React.useState(false);
  const [activeIndex, setActiveIndex] = React.useState<number | null>(null);
  const { locale } = useParams();
  const isRtl = locale === "ar";

  return (
    <nav className="w-full border-b ">
      <div className="max-w-screen-xl mx-auto px-1 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center gap-4">
          {/* Hamburger menu - visible on small screens the first component */}
          <MobileMenuWithIcon
            activeIndex={activeIndex}
            setActiveIndex={setActiveIndex}
          />
          {/* logo and search box  */}
          <BrandWithSearch />
          {/* navigation bar */}
          <NavBar activeIndex={activeIndex} setActiveIndex={setActiveIndex} />
          {/* User menu Todo : implement this actual dropdown as this is a placeholder */}
          <div
            className={`flex flex-row justify-center items-center gap-1 ${
              isRtl ? "mr-auto" : "ml-auto"
            }`}
          >
            <LanguageSwitcher />
            <ThemeSwitcher />
          </div>
          <UserMenu />
          {/* this is the second menu component of the mobile menu */}
          {/* Hamburger menu - visible on small screens */}
          {/* <HamburgerButton setMenuOpen={setMenuOpen} menuOpen={menuOpen} /> */}
        </div>
      </div>
      {/* Mobile menu - shows icons vertically when toggled */}
      {/* {menuOpen && (
        <MobileMenu activeIndex={activeIndex} setActiveIndex={setActiveIndex} />
        )} */}
    </nav>
  );
}
