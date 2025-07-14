import type { Metadata } from "next";
import { IBM_Plex_Sans_Arabic, Josefin_Sans } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import "@/styles/globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import ReduxProvider from "@/store/Provider";
import { MainNavBar } from "@/components/layout/navigation/MainNavBar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/sidebar/AppSidebar";
// import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

const josefinSans = Josefin_Sans({
  variable: "--font-josefin-sans",
  subsets: ["latin"],
});

const ibmPlexSansArabic = IBM_Plex_Sans_Arabic({
  variable: "--font-ibm-plex-sans-arabic",
  subsets: ["arabic"],
  weight: ["100", "200", "300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Code Connect",
  description:
    "A platform for collaborative coding and learning together with friends. Share your code, learn from others. Join the community!",
};

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  let locale = (await params).locale;
  const supportedLocales = ["en", "ar"];

  if (!locale || !supportedLocales.includes(locale)) locale = "en";

  let messages;
  try {
    messages = (await import(`@/messages/${locale}.json`)).default;
  } catch (error) {
    console.log(error);
    messages = (await import(`@/messages/en.json`)).default;
  }

  return (
    <html
      lang={locale}
      dir={locale === "ar" ? "rtl" : "ltr"}
      suppressHydrationWarning
    >
      <head>
        <link rel="alternate" hrefLang="en" href="/en" />
        <link rel="alternate" hrefLang="ar" href="/ar" />
      </head>
      <body className={`${ibmPlexSansArabic.variable} ${josefinSans.variable}`}>
        <NextIntlClientProvider
          key={locale}
          locale={locale}
          messages={messages}
        >
          <ReduxProvider>
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
              {children}
            </ThemeProvider>
          </ReduxProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
