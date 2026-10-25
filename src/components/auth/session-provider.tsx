"use client";

import { getCurrentUser } from "@/lib/auth";
import { useAuthStore } from "@/stores/auth-store";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

export function SessionProvider({ children }: Readonly<{ children: React.ReactNode }>) {
  const setUser = useAuthStore((state) => state.setUser);
  const setLoading = useAuthStore((state) => state.setLoading);
  const sessionQuery = useQuery({
    queryKey: ["auth", "me"],
    queryFn: getCurrentUser,
    retry: false,
    staleTime: 5 * 60 * 1000,
  });

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
