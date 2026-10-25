"use client";

import { useAuthStore } from "@/stores/auth-store";
import Link from "next/link";

export function SuperAdminGuard({ children }: Readonly<{ children: React.ReactNode }>) {
  const user = useAuthStore((state) => state.user);
  const isLoading = useAuthStore((state) => state.isLoading);
  if (isLoading) return <main className="flex min-h-screen items-center justify-center bg-slate-50"><div className="h-9 w-9 animate-spin rounded-full border-4 border-slate-200 border-t-lime-600" /></main>;
  if (user?.role !== "SUPER_ADMIN") {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 px-5">
        <section className="w-full max-w-md rounded-3xl border border-red-200 bg-white p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-red-600">Access restricted</p>
          <h1 className="mt-3 text-2xl font-semibold text-slate-950">Admin access required</h1>
          <p className="mt-3 text-sm leading-6 text-slate-600">Only platform administrators can view moderation and platform data.</p>
          <Link className="mt-6 inline-flex rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white" href="/dashboard">Go to dashboard</Link>
        </section>
      </main>
    );
  }
  return <>{children}</>;
}
