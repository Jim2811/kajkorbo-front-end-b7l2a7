"use client";

import { AdminShell } from "@/components/admin/admin-shell";
import { SuperAdminGuard } from "@/components/admin/super-admin-guard";
import { getAdminDashboard } from "@/lib/complaints";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function AdminDashboardPage() {
  const [dashboard, setDashboard] = useState<Record<string, unknown> | null>(null);
  const [error, setError] = useState("");
  useEffect(() => { getAdminDashboard().then((response) => setDashboard(response.data.dashboard)).catch((reason) => setError(reason instanceof Error ? reason.message : "Unable to load dashboard.")); }, []);
  const metrics = dashboard ? Object.entries(dashboard).filter(([, value]) => typeof value === "number").slice(0, 6) : [];
  return <SuperAdminGuard><AdminShell description="Monitor platform health and move quickly on moderation work." title="Admin dashboard">{error ? <p className="rounded-xl bg-red-50 p-4 text-sm text-red-700" role="alert">{error}</p> : null}<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{metrics.length ? metrics.map(([label, value]) => <div className="rounded-2xl border border-slate-200 bg-white p-5" key={label}><p className="text-sm text-slate-500">{label.replaceAll(/([A-Z])/g, " $1")}</p><p className="mt-2 text-3xl font-semibold text-slate-950">{value as number}</p></div>) : <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-900">Loading dashboard metrics...</div>}</div><div className="mt-8 grid gap-4 sm:grid-cols-3"><Link className="rounded-2xl bg-slate-950 p-5 font-semibold text-white" href="/admin/complaints">Moderate complaints →</Link><Link className="rounded-2xl border border-slate-200 bg-white p-5 font-semibold text-slate-950" href="/admin/users">Review users →</Link><Link className="rounded-2xl border border-slate-200 bg-white p-5 font-semibold text-slate-950" href="/admin/organizations">Review organizations →</Link></div></AdminShell></SuperAdminGuard>;
}
