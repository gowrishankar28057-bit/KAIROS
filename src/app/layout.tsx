import type { Metadata, Viewport } from "next";
import { auth, isAuthConfigured } from "@/auth";
import { AuthProvider } from "@/components/AuthProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "KAIROS — Adaptive Biological Intelligence Platform",
  description:
    "Interactive virtual prototype of KAIROS: real-time biological sensing, AI BioFingerprint analysis, digital-twin simulation and secure decision support. All data shown is prototype simulation.",
};

export const viewport: Viewport = {
  themeColor: "#0a1a3f",
};

// session + env-driven auth settings are resolved per request
export const dynamic = "force-dynamic";

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const enabled = isAuthConfigured();
  const session = enabled ? await auth() : null;

  return (
    <html lang="en">
      <body className="font-sans">
        <AuthProvider enabled={enabled} session={session}>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
