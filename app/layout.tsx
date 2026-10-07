import type { Metadata } from "next";
import { ThemeProvider } from "@/components/theme-provider";
import { ValuesProvider } from "@/components/values-provider";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "ShortLink on AWS", template: "%s · ShortLink on AWS" },
  description: "Step-by-step deployment and CI/CD guides for the ShortLink DevOps workshop.",
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
