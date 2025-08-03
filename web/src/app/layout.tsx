import "@/styles/globals.css";

import { type Metadata } from "next";
import { Geist } from "next/font/google";

import { TRPCReactProvider } from "@/trpc/react";
import { NextIntlClientProvider } from 'next-intl';
import { getLocale } from 'next-intl/server';
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/sonner";
import { PostHogProvider } from "@/components/PostHogProvider";
import { auth } from "@/server/auth";


export const metadata: Metadata = {
  title: "Helpdesk AI",
  description: "Automated helpdesk system",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://www.helpdesk-ai.org",
    title: "Helpdesk AI",
    description: "Automated helpdesk system",
    siteName: "Helpdesk AI",
    images: [
      {
        url: "https://www.helpdesk-ai.org/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Helpdesk AI",
      },
    ],
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
};

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const locale = await getLocale();

  const session = await auth();

  return (
    <html lang={locale} className={`${geist.variable}`} suppressHydrationWarning>
      <body>
        <PostHogProvider session={session}>
          <NextIntlClientProvider>
            <TRPCReactProvider>
              <ThemeProvider
                attribute="class"
                defaultTheme="system"
                enableSystem
                disableTransitionOnChange
              >
                {children}
                <Toaster />
              </ThemeProvider>
            </TRPCReactProvider>
          </NextIntlClientProvider>
        </PostHogProvider>
      </body>
    </html>
  );
}