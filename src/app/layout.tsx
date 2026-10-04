import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "KAIROS — Adaptive Biological Intelligence Platform",
  description:
    "Interactive virtual prototype of KAIROS: real-time biological sensing, AI BioFingerprint analysis, digital-twin simulation and secure decision support. All data shown is prototype simulation.",
};

export const viewport: Viewport = {
  themeColor: "#0a1a3f",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="font-sans">{children}</body>
    </html>
  );
}
