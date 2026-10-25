"use client";

import { useAuthStore } from "@/stores/auth-store";
import Link from "next/link";

export function OrganizationOwnerGuard({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const user = useAuthStore((state) => state.user);
  const isLoading = useAuthStore((state) => state.isLoading);

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50">
        <div
          aria-label="Checking authorization"
          className="h-9 w-9 animate-spin rounded-full border-4 border-slate-200 border-t-lime-600"
          role="status"
        />
      </main>
    );
  }

  if (!user) {
    return <UnauthorizedOrganizationState message="Please sign in to manage an organization." />;
  }

  if (user.role !== "ORG_OWNER") {
    return (
      <UnauthorizedOrganizationState message="Only organization owners can access this workspace area." />
    );
  }

  return <>{children}</>;
}

function UnauthorizedOrganizationState({ message }: { message: string }) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-5 py-12">
      <section
        aria-labelledby="organization-access-title"
        className="w-full max-w-md rounded-3xl border border-red-200 bg-white p-8 shadow-sm"
      >
        <p className="text-sm font-semibold uppercase tracking-[0.14em] text-red-600">
          Access restricted
        </p>
        <h1 className="mt-3 text-2xl font-semibold tracking-tight text-slate-950" id="organization-access-title">
          You can&apos;t manage this organization
        </h1>
        <p className="mt-3 text-sm leading-6 text-slate-600">{message}</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            className="rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800"
            href="/dashboard"
          >
            Go to dashboard
          </Link>
          <Link
            className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:border-slate-400"
            href="/"
          >
            Return home
          </Link>
        </div>
      </section>
    </main>
  );
}
