import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Hari Kishan Singh · HariOS",
  description:
    "macOS-themed portfolio of Hari Kishan Singh — data analyst, Python, and applied AI.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <body>{children}</body>
    </html>
  );
}
