import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ShortLink on AWS",
  description: "Step-by-step deployment and CI/CD guides for the ShortLink DevOps workshop.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
