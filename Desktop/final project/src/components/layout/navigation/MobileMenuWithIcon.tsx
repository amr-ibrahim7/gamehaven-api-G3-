import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Menu } from "lucide-react";
import React from "react";
import MobileMenu from "./MobileMenu";
import { activeMenuProps } from "./nav.types";

export default function MobileMenuWithIcon({
  activeIndex,
  setActiveIndex,
}: activeMenuProps) {
  return (
    <NavigationMenu className="md:hidden ">
      <NavigationMenuList>
        <NavigationMenuItem className="relative w-[40px]">
          <NavigationMenuTrigger className="p-2">
            {/* <HamburgerButton setMenuOpen={setMenuOpen} menuOpen={menuOpen} /> */}
            <Menu size={18} />
          </NavigationMenuTrigger>

          <NavigationMenuContent>
            <MobileMenu 
              activeIndex={activeIndex}
              setActiveIndex={setActiveIndex}
            />
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}
