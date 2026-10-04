"use client";

import { LogIn, LogOut } from "lucide-react";
import { signIn, signOut, useSession } from "next-auth/react";
import { useAuthEnabled } from "@/components/AuthProvider";

export function GoogleMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden>
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z" />
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
      <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z" />
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z" />
    </svg>
  );
}

function initials(name?: string | null, email?: string | null) {
  const src = name || email || "?";
  return src
    .split(/[\s@.]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");
}

function SessionMenu() {
  const { data, status } = useSession();
  if (status === "loading") return <span className="h-8 w-20 animate-pulse rounded-lg bg-sci-50" aria-hidden />;
  if (!data?.user) {
    return (
      <button
        onClick={() => signIn("google")}
        className="inline-flex h-9 items-center gap-2 whitespace-nowrap rounded-xl border border-sci-200 bg-white px-3 text-[13px] font-semibold text-navy-900 hover:border-sci-400 hover:bg-sci-50"
      >
        <GoogleMark className="h-4 w-4" />
        <span className="hidden sm:inline">Sign in</span>
        <LogIn className="h-3.5 w-3.5 sm:hidden" />
      </button>
    );
  }
  return (
    <div className="flex items-center gap-2">
      <span
        title={`${data.user.name ?? ""} ${data.user.email ?? ""}`.trim()}
        className="flex h-8 w-8 items-center justify-center rounded-full bg-navy-900 text-xs font-bold text-teal-glow"
      >
        {initials(data.user.name, data.user.email)}
      </span>
      <button
        onClick={() => signOut()}
        className="rounded-lg p-2 text-slate-500 hover:bg-sci-50 hover:text-navy-900"
        aria-label="Sign out"
        title="Sign out"
      >
        <LogOut className="h-4 w-4" />
      </button>
    </div>
  );
}

/** Renders nothing when Google sign-in isn't configured on the server. */
export function UserMenu() {
  const enabled = useAuthEnabled();
  return enabled ? <SessionMenu /> : null;
}

function OperatorInner() {
  const { data } = useSession();
  return data?.user ? (
    <>
      <span className="font-semibold text-navy-900">{data.user.email}</span> · authenticated via Google OAuth 2.0 · role:{" "}
      <span className="font-semibold text-teal-700">Operator (demo)</span>
    </>
  ) : (
    <>
      Not signed in · role: <span className="font-semibold">Public viewer</span> ·{" "}
      <button onClick={() => signIn("google")} className="font-semibold text-sci-600 hover:underline">
        Sign in with Google
      </button>
    </>
  );
}

/** Live identity line for the cybersecurity section. */
export function OperatorIdentity() {
  const enabled = useAuthEnabled();
  return (
    <p className="text-sm text-slate-600">
      {enabled ? <OperatorInner /> : <>Public demo mode · Google sign-in not configured on this deployment</>}
    </p>
  );
}
