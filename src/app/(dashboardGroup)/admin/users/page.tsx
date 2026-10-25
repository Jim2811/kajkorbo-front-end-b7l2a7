"use client";

import { AdminShell } from "@/components/admin/admin-shell";
import { SuperAdminGuard } from "@/components/admin/super-admin-guard";
import { listAdminUsers } from "@/app/(dashboardGroup)/_actions/complaint-actions";
import { useEffect, useState } from "react";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<Array<Record<string, unknown>>>([]);
  const [error, setError] = useState("");
  useEffect(() => { listAdminUsers().then((response) => setUsers(response.data.users)).catch((reason) => setError(reason instanceof Error ? reason.message : "Unable to load users.")); }, []);
  return <SuperAdminGuard><AdminShell description="Review account identity and status." title="Users"><div className="rounded-3xl border border-slate-200 bg-white p-6">{error ? <p className="text-sm text-red-700">{error}</p> : null}<div className="divide-y divide-slate-100">{users.map((user) => <div className="flex flex-wrap justify-between gap-3 py-4" key={String(user.id)}><div><p className="font-semibold">{String(user.name)}</p><p className="text-sm text-slate-500">{String(user.email)}</p></div><span className="text-xs font-semibold text-slate-500">{String(user.status)} · {String(user.role)}</span></div>)}</div></div></AdminShell></SuperAdminGuard>;
}
