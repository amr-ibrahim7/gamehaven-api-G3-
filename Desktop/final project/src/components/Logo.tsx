"use client";

import Image from "next/image";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import clsx from "clsx";

interface LogoProps {
  className?: string;
}
const Logo = ({ className }: LogoProps) => {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const logoSrc = theme === "light" ? "/logo-light.svg" : "/logo-dark.svg";

  return (
    <div className={clsx("flex items-center", className)}>
      <Image src={logoSrc} alt="CodeConnect" width={90} height={180} priority />
    </div>
  );
};

export default Logo;
