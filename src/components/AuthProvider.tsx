"use client";

import type { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { createContext, useContext } from "react";

const AuthEnabledContext = createContext(false);

export function AuthProvider({
  enabled,
  session,
  children,
}: {
  enabled: boolean;
  session: Session | null;
  children: React.ReactNode;
}) {
  return (
    <AuthEnabledContext.Provider value={enabled}>
      {enabled ? <SessionProvider session={session}>{children}</SessionProvider> : children}
    </AuthEnabledContext.Provider>
  );
}

export function useAuthEnabled() {
  return useContext(AuthEnabledContext);
}
