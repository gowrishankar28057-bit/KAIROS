import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

/**
 * Google sign-in (Auth.js v5). Optional: the public demo works without it.
 *
 * Required env to enable:
 *   AUTH_SECRET, AUTH_GOOGLE_ID, AUTH_GOOGLE_SECRET
 * Optional env:
 *   AUTH_REQUIRED=true          → whole site requires sign-in
 *   AUTH_ALLOWED_EMAILS=a@x.com,b@y.com   → only these accounts may sign in
 *   AUTH_ALLOWED_DOMAINS=lab.org          → only these email domains may sign in
 */
export function isAuthConfigured() {
  return Boolean(process.env.AUTH_SECRET && process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET);
}

export function isAuthRequired() {
  return isAuthConfigured() && process.env.AUTH_REQUIRED === "true";
}

const list = (v?: string) =>
  (v ?? "")
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);

export function isEmailAllowed(email?: string | null) {
  const emails = list(process.env.AUTH_ALLOWED_EMAILS);
  const domains = list(process.env.AUTH_ALLOWED_DOMAINS);
  if (!emails.length && !domains.length) return true;
  if (!email) return false;
  const e = email.toLowerCase();
  return emails.includes(e) || domains.includes(e.split("@")[1] ?? "");
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [Google],
  // Railway (and most PaaS) terminate TLS at a proxy in front of the app
  trustHost: true,
  pages: { signIn: "/signin", error: "/signin" },
  callbacks: {
    signIn({ profile }) {
      return Boolean(profile?.email_verified) && isEmailAllowed(profile?.email);
    },
  },
});
