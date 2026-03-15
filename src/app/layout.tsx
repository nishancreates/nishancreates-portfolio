import type { Metadata } from "next";
import "./globals.css";
import { GlobalProvider } from "@/context/GlobalContext";

export const metadata: Metadata = {
  title: "nishancreates — Full-Stack Architect & Business Solutions Developer",
  description:
    "I build complete digital systems for local businesses — storefronts, dashboards, and WhatsApp checkout engines. Based in Nepal.",
  keywords: [
    "web developer nepal",
    "business website nepal",
    "cafe website",
    "restaurant website",
    "clothing brand website",
    "dashboard development",
    "nishancreates",
  ],
  openGraph: {
    title: "nishancreates",
    description: "Full-Stack Architect & Business Solutions Developer",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <GlobalProvider>{children}</GlobalProvider>
      </body>
    </html>
  );
}
