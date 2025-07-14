import { GalleryVerticalEnd } from "lucide-react"
import React from "react"
import { ThemeSwitcher } from "@/components/ThemeSwitcher"
import LanguageSwitcher from "@/components/LanguageSwitcher"
import Logo from "../Logo"
import Link from "next/link"

interface AuthPageLayoutProps {
  children: React.ReactNode
  maxWidth?: string
}

export function AuthPageLayout({ children, maxWidth = "max-w-xs" }: AuthPageLayoutProps) {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="bg-muted relative hidden lg:block">
        <img
          src="/sign.jpg"
          alt="Image"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.6] dark:grayscale"
        />
      </div>
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-between items-center mb-4">
          <div className="flex justify-center gap-2 md:justify-start">
            <Logo />
          </div>
          <div className="flex gap-2">
            <LanguageSwitcher />
            <ThemeSwitcher />
          </div>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className={`w-full ${maxWidth}`}>
            {children}
          </div>
        </div>
      </div>
    </div>
  )
} 