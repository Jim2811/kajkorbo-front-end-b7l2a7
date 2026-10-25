"use client";

import { getCurrentUser } from "@/lib/auth";
import { useQuery } from "@tanstack/react-query";

export const authMeQueryKey = ["auth", "me"] as const;

export function useAuthMeQuery() {
  return useQuery({
    queryKey: authMeQueryKey,
    queryFn: getCurrentUser,
    retry: false,
    staleTime: 5 * 60 * 1000,
  });
}
