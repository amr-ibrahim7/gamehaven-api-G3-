import { MainNavBar } from "@/components/layout/navigation/MainNavBar";
import React from "react";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
       <>
        <MainNavBar />
        <div className="flex items-center min-h-screen flex-col max-w-screen-xl mx-auto px-1 sm:px-6 lg:px-8">
          {children}
        </div>
       </>
  );
}
