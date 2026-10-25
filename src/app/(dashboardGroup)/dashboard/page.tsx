"use client";

import { AdminDashboardView } from "../admin-dashboard/dashboard-view";
import { OrganizationDashboardView } from "../organization-dashboard/dashboard-view";
import { TeamLeaderDashboardView } from "../team-leader-dashboard/dashboard-view";
import { TeamMemberDashboardView } from "../team-member-dashboard/dashboard-view";
import { UserDashboardView } from "../user-dashboard/dashboard-view";
import { useAuthStore } from "@/stores/auth-store";
import Link from "next/link";
import { DashboardView } from "./dashboard-view";

export default function DashboardPage() {
  const user = useAuthStore((state) => state.user);
  const isLoading = useAuthStore((state) => state.isLoading);

  if (isLoading) {
    return (
      <main className="flex min-h-[calc(100vh-73px)] items-center justify-center px-5">
        <div aria-label="Loading dashboard" className="h-9 w-9 animate-spin rounded-full border-4 border-slate-200 border-t-lime-600" role="status" />
      </main>
    );
  }

  if (!user) {
    return (
      <main className="mx-auto max-w-3xl px-5 py-16 sm:px-8">
        <section className="rounded-3xl border border-red-200 bg-white p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-red-600">Session unavailable</p>
          <h1 className="mt-3 text-3xl font-semibold text-slate-950">Sign in to open your dashboard</h1>
          <Link className="mt-6 inline-flex rounded-xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white" href="/login?next=%2Fdashboard">
            Sign in
          </Link>
        </section>
      </main>
    );
  }

  const firstName = user.name.split(" ")[0];
  switch (user.role) {
    case "SUPER_ADMIN":
      return <AdminDashboardView firstName={firstName} />;
    case "ORG_OWNER":
      return <DashboardView firstName={firstName} />;
    case "ORG_MEMBER":
      return <OrganizationDashboardView firstName={firstName} />;
    case "TEAM_LEADER":
      return <TeamLeaderDashboardView firstName={firstName} />;
    case "TEAM_MEMBER":
      return <TeamMemberDashboardView firstName={firstName} />;
    case "USER":
      return <UserDashboardView firstName={firstName} />;
  }
}
