import React from "react";
import {
  NavigationMenuItem,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import Link from "next/link";
import { motion } from "framer-motion";
import { NavItemProps } from "./nav.types";

export default function NavItem({
  item,
  index,
  isActive,
  setActiveIndex,
}: NavItemProps) {
  React.useEffect(() => {
    console.log("isActive", isActive);
  }, [isActive]);

  return (
    <NavigationMenuItem
      asChild
      className={navigationMenuTriggerStyle()}
      key={index}
    >
      <Link
        href={item.href}
        onClick={() => setActiveIndex(index)}
        className="relative flex flex-col items-center justify-center w-full h-full"
      >
        {/* Icon */}
        <div className="flex justify-center items-center h-10">
          {isActive ? item.iconFilled : item.iconOutline}
        </div>
        {/* Indicator */}
        {isActive && (
          <motion.span
            layoutId="underline"
            className="absolute -bottom-1 h-0.5 w-16 bg-gray-800 dark:bg-white  rounded-full"
            transition={{
              type: "spring",
              stiffness: 500,
              damping: 25,
            }}
          ></motion.span>
        )}
      </Link>
    </NavigationMenuItem>
  );
}
