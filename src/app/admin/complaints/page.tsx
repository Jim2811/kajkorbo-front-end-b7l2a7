"use client";

import { AdminShell } from "@/components/admin/admin-shell";
import { SuperAdminGuard } from "@/components/admin/super-admin-guard";
import { listAdminComplaints, complaintStatuses } from "@/lib/complaints";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function AdminComplaintsPage() {
  const [items, setItems] = useState<Awaited<ReturnType<typeof listAdminComplaints>>["data"]["complaints"]>([]);
  const [filter, setFilter] = useState("ALL");
  const [error, setError] = useState("");
  useEffect(() => { listAdminComplaints().then((response) => setItems(response.data.complaints)).catch((reason) => setError(reason instanceof Error ? reason.message : "Unable to load complaints.")); }, []);
  const visible = filter === "ALL" ? items : items.filter((item) => item.status === filter);
  return <SuperAdminGuard><AdminShell description="Review reports across every organization." title="Complaint moderation">{error ? <p className="mb-5 rounded-xl bg-red-50 p-3 text-sm text-red-700" role="alert">{error}</p> : null}<div className="rounded-3xl border border-slate-200 bg-white p-6"><div className="flex flex-wrap justify-between gap-3"><h2 className="text-lg font-semibold">All complaints</h2><select className="rounded-xl border border-slate-200 px-3 py-2 text-sm" onChange={(event) => setFilter(event.target.value)} value={filter}><option value="ALL">All statuses</option>{complaintStatuses.map((status) => <option key={status} value={status}>{status}</option>)}</select></div><div className="mt-5 divide-y divide-slate-100">{visible.map((item) => <Link className="block py-4 hover:bg-slate-50" href={`/admin/complaints/${item.id}`} key={item.id}><div className="flex justify-between gap-3"><p className="font-semibold">{item.category}</p><span className="text-xs text-slate-500">{item.status}</span></div><p className="mt-1 text-sm text-slate-600">{item.organization?.name || item.organizationId} · {item.reportedUser?.name || item.reportedUserId}</p><p className="mt-1 text-xs text-slate-400">{new Date(item.createdAt).toLocaleString()}</p></Link>)}</div></div></AdminShell></SuperAdminGuard>;
}
