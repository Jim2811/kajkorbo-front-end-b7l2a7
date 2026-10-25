"use client";

import { AdminShell } from "@/components/admin/admin-shell";
import { SuperAdminGuard } from "@/components/admin/super-admin-guard";
import { getComplaint, resolveComplaint, type Complaint } from "@/app/(dashboardGroup)/_actions/complaint-actions";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function AdminComplaintDetailsPage() {
  const { complaintId } = useParams<{ complaintId: string }>();
  const [complaint, setComplaint] = useState<Complaint | null>(null);
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");
  useEffect(() => { getComplaint(complaintId).then((response) => setComplaint(response.data.complaint)).catch((reason) => setError(reason instanceof Error ? reason.message : "Unable to load complaint.")); }, [complaintId]);
  const resolve = async (status: "RESOLVED" | "DISMISSED") => {
    if (!notes.trim() || !window.confirm(`Confirm ${status.toLowerCase()} action?`)) return;
    try {
      const response = await resolveComplaint(complaintId, { status, resolutionNotes: notes });
      setComplaint(response.data.complaint); setNotes("");
    } catch (reason) { setError(reason instanceof Error ? reason.message : "Unable to resolve complaint."); }
  };
  return <SuperAdminGuard><AdminShell description="Make a documented moderation decision." title="Complaint review">{error ? <p className="rounded-xl bg-red-50 p-3 text-sm text-red-700" role="alert">{error}</p> : null}{complaint ? <div className="rounded-3xl border border-slate-200 bg-white p-6"><span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold">{complaint.status}</span><h2 className="mt-5 text-xl font-semibold">{complaint.category}</h2><p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-slate-700">{complaint.description}</p><p className="mt-5 text-sm text-slate-500">Reported user: {complaint.reportedUser?.name || complaint.reportedUserId}</p><label className="mt-6 block text-sm font-medium">Resolution notes<textarea className="mt-2 block min-h-28 w-full rounded-xl border border-slate-200 p-3 text-sm" value={notes} onChange={(event) => setNotes(event.target.value)} /></label><div className="mt-4 flex gap-3"><button className="rounded-xl bg-lime-600 px-4 py-3 text-sm font-semibold text-white disabled:opacity-50" disabled={!notes.trim()} onClick={() => resolve("RESOLVED")} type="button">Resolve</button><button className="rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 disabled:opacity-50" disabled={!notes.trim()} onClick={() => resolve("DISMISSED")} type="button">Dismiss</button></div></div> : <p className="rounded-xl bg-amber-50 p-4 text-sm text-amber-900">Loading complaint...</p>}</AdminShell></SuperAdminGuard>;
}
