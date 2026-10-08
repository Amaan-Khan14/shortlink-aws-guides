import type { Metadata } from "next";
import { ThemeProvider } from "@/components/theme-provider";
import { ValuesProvider } from "@/components/values-provider";
import "./globals.css";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "http://localhost:3000");

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: "ShortLink on AWS", template: "%s · ShortLink on AWS" },
  description: "Step-by-step deployment and CI/CD guides for the ShortLink DevOps workshop.",
  openGraph: { type: "website", siteName: "ShortLink on AWS" },
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          <ValuesProvider>{children}</ValuesProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
