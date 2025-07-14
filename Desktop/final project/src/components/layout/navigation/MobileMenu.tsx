"use client";

import * as React from "react";
import {
  NavigationMenu,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import navItems from "@/config/nav.config";
import NavItem from "@/components/layout/navigation/NavItem";
import { activeMenuProps } from "./nav.types";

export default function MobileMenu({
  activeIndex,
  setActiveIndex,
}: activeMenuProps) {
  return (
    // <div className="md:hidden bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 px-4 py-2 space-y-2">
    //   <NavigationMenu>
    //     <NavigationMenuList className="flex flex-col space-y-1">
    //       {navItems.map((item, index) => {
    //         return (
    //           <NavItem
    //             key={index}
    //             item={item}
    //             index={index}
    //             isActive={activeIndex === index}
    //             setActiveIndex={setActiveIndex}
    //           />
    //         );
    //       })}
    //     </NavigationMenuList>
    //   </NavigationMenu>
    // </div>
    <div className="fixed flex justify-center  bottom-0 left-0 right-0 md:hidden bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 px-4 py-2">
  <NavigationMenu>
    <NavigationMenuList className="flex flex-row justify-between items-center">
      {navItems.map((item, index) => {
        return (
          <NavItem
            key={index}
            item={item}
            index={index}
            isActive={activeIndex === index}
            setActiveIndex={setActiveIndex}
          />
        );
      })}
    </NavigationMenuList>
  </NavigationMenu>
</div>

  );
}
