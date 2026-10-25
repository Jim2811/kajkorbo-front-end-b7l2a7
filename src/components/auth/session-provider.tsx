"use client";

import { useAuthMeQuery } from "@/lib/auth-query";
import { useAuthStore } from "@/stores/auth-store";
import { useEffect } from "react";

export function SessionProvider({ children }: Readonly<{ children: React.ReactNode }>) {
  const setUser = useAuthStore((state) => state.setUser);
  const setLoading = useAuthStore((state) => state.setLoading);
  const sessionQuery = useAuthMeQuery();

  useEffect(() => {
    if (sessionQuery.isSuccess) {
      setUser(sessionQuery.data.data.profile);
      setLoading(false);
      return;
    }

    if (sessionQuery.isError) {
      setUser(null);
      setLoading(false);
    }
  }, [
    sessionQuery.data,
    sessionQuery.error,
    sessionQuery.isError,
    sessionQuery.isSuccess,
    setLoading,
    setUser,
  ]);

  return <>{children}</>;
}
