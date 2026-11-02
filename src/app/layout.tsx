import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import SiteHeader from "@/app/components/SiteHeader";
import SiteFooter from "@/app/components/SiteFooter";
import { getCurrentUser } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Guzo — Find your tera in Addis Ababa",
  description:
    "Guzo maps every taxi station in Addis Ababa: find the nearest tera, see where minibuses, city buses and the light rail go, compare fares and travel time, and keep the map fresh with rider reports.",
  applicationName: "Guzo",
  manifest: "/manifest.webmanifest",
  icons: { icon: "/icon.svg", apple: "/icon-192.svg" },
  keywords: ["Addis Ababa", "taxi station", "tera", "minibus", "Ethiopia", "transport", "Guzo", "ጉዞ"],
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Guzo",
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  themeColor: "#124532",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default async function RootLayout({ children }: { children: ReactNode }) {
  const user = await getCurrentUser();

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Guzo" />
        <meta name="mobile-web-app-capable" content="yes" />
        <link rel="apple-touch-icon" href="/icon-192.svg" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var t = localStorage.getItem('guzo-theme');
                  var d = t === 'dark' || (!t && window.matchMedia('(prefers-color-scheme: dark)').matches);
                  if (d) document.documentElement.classList.add('dark');
                } catch(e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="min-h-screen bg-cream text-ink antialiased">
        <SiteHeader user={user} />
        <main className="min-h-[60vh]">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
