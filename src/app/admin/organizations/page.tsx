"use client";

import { AdminShell } from "@/components/admin/admin-shell";
import { SuperAdminGuard } from "@/components/admin/super-admin-guard";
import { listAdminOrganizations } from "@/lib/complaints";
import { useEffect, useState } from "react";

export default function AdminOrganizationsPage() {
  const [organizations, setOrganizations] = useState<Array<Record<string, unknown>>>([]);
  const [error, setError] = useState("");
  useEffect(() => { listAdminOrganizations().then((response) => setOrganizations(response.data.organizations)).catch((reason) => setError(reason instanceof Error ? reason.message : "Unable to load organizations.")); }, []);
  return <SuperAdminGuard><AdminShell description="Review organization health and status." title="Organizations"><div className="rounded-3xl border border-slate-200 bg-white p-6">{error ? <p className="text-sm text-red-700">{error}</p> : null}<div className="divide-y divide-slate-100">{organizations.map((organization) => <div className="flex flex-wrap justify-between gap-3 py-4" key={String(organization.id)}><div><p className="font-semibold">{String(organization.name)}</p><p className="text-sm text-slate-500">{String(organization.email)}</p></div><span className="text-xs font-semibold text-slate-500">{String(organization.status)} · {String(organization.plan)}</span></div>)}</div></div></AdminShell></SuperAdminGuard>;
}
