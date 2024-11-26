import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.scss";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "NEU Social",
  description: "Social media app for NEU students",
};

const montserrat = Montserrat({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="light">
      <body className={montserrat.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
