"use client";

import { OrganizationShell } from "@/components/organization/organization-shell";
import { getComplaint, resolveComplaint, updateComplaintStatus, type Complaint, complaintStatuses } from "@/app/(dashboardGroup)/_actions/complaint-actions";
import { useAuthStore } from "@/stores/auth-store";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function ComplaintDetailsPage() {
  const { complaintId } = useParams<{ complaintId: string }>();
  const user = useAuthStore((state) => state.user);
  const [complaint, setComplaint] = useState<Complaint | null>(null);
  const [error, setError] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  useEffect(() => { getComplaint(complaintId).then((response) => setComplaint(response.data.complaint)).catch((reason) => setError(reason instanceof Error ? reason.message : "Unable to load complaint.")); }, [complaintId]);
  if (!complaint) return <OrganizationShell description="Complaint details and status history." title="Complaint details"><div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-900">{error || "Loading complaint..."}</div></OrganizationShell>;
  const canModerate = user?.role === "SUPER_ADMIN" || user?.role === "ORG_OWNER";
  const apply = async (status: Complaint["status"]) => {
    if (!window.confirm(`Change this complaint to ${status.replaceAll("_", " ")}?`)) return;
    setLoading(true); setError("");
    try {
      const response = status === "RESOLVED" || status === "DISMISSED"
        ? await resolveComplaint(complaint.id, { status, resolutionNotes: notes })
        : await updateComplaintStatus(complaint.id, { status, resolutionNotes: notes || undefined });
      setComplaint(response.data.complaint); setNotes("");
    } catch (reason) { setError(reason instanceof Error ? reason.message : "Unable to update complaint."); } finally { setLoading(false); }
  };
  return <OrganizationShell description="Review the report, related context, and moderation history." title={complaint.category}>
    {error ? <p className="mb-5 rounded-xl bg-red-50 p-3 text-sm text-red-700" role="alert">{error}</p> : null}
    <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]"><section className="rounded-3xl border border-slate-200 bg-white p-6"><div className="flex justify-between gap-3"><span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold">{complaint.status}</span><time className="text-xs text-slate-500">{new Date(complaint.createdAt).toLocaleString()}</time></div><p className="mt-6 whitespace-pre-wrap text-sm leading-7 text-slate-700">{complaint.description}</p><dl className="mt-7 grid gap-4 border-t border-slate-100 pt-5 sm:grid-cols-2"><div><dt className="text-xs text-slate-500">Reported user</dt><dd className="mt-1 text-sm font-semibold">{complaint.reportedUser?.name || complaint.reportedUserId}</dd></div><div><dt className="text-xs text-slate-500">Reviewer</dt><dd className="mt-1 text-sm font-semibold">{complaint.reviewer?.name || "Unassigned"}</dd></div></dl>{complaint.resolutionNotes ? <p className="mt-5 rounded-xl bg-lime-50 p-3 text-sm text-lime-900">Resolution: {complaint.resolutionNotes}</p> : null}</section><aside className="rounded-3xl border border-slate-200 bg-white p-6"><h2 className="font-semibold text-slate-950">Status history</h2><div className="mt-5 space-y-3">{complaintStatuses.map((status) => <div className={`rounded-xl px-3 py-2 text-sm ${status === complaint.status ? "bg-lime-100 font-semibold text-lime-900" : "bg-slate-50 text-slate-500"}`} key={status}>{status.replaceAll("_", " ")}{status === complaint.status ? " · current" : ""}</div>)}</div>{canModerate ? <div className="mt-6 border-t border-slate-100 pt-5"><label className="text-sm font-medium">Resolution notes<textarea className="mt-2 block min-h-24 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm" value={notes} onChange={(event) => setNotes(event.target.value)} /></label><div className="mt-3 flex flex-wrap gap-2">{complaintStatuses.map((status) => <button className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold disabled:opacity-50" disabled={loading || ((status === "RESOLVED" || status === "DISMISSED") && !notes.trim())} key={status} onClick={() => apply(status)} type="button">{status}</button>)}</div></div> : null}</aside></div><Link className="mt-6 inline-flex text-sm font-semibold text-slate-700 underline" href="/dashboard/complaints">Back to complaints</Link>
  </OrganizationShell>;
}
