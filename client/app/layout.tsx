import type { Metadata } from "next";
import "./globals.scss";

export const metadata: Metadata = {
  title: "NEU Social",
  description: "Social media app for NEU students",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
