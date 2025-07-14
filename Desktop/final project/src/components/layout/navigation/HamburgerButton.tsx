import { Menu } from "lucide-react";
import React from "react";

type HamburgerButtonProps = {
  setMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
  menuOpen: boolean;
};
export default function HamburgerButton({
  setMenuOpen,
  menuOpen,
}: HamburgerButtonProps) {
  const iconSize = 28;
  return (
    <button
      onClick={() => setMenuOpen(!menuOpen)}
      className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none"
      aria-label="Toggle menu"
    >
      <Menu size={iconSize} />
    </button>
  );
}
