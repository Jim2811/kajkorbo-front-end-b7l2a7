"use client";

import { AuthField } from "@/components/auth/auth-field";
import { OrganizationShell } from "@/components/organization/organization-shell";
import { createComplaint, listComplaints } from "@/lib/complaints";
import { useOrganizationStore } from "@/stores/organization-store";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const schema = z.object({
  reportedUserId: z.string().trim().min(1, "Reported user ID is required"),
  category: z.string().trim().min(1, "Category is required"),
  description: z.string().trim().min(1, "Description is required"),
  evidenceUrl: z.string().url("Enter a valid URL").optional().or(z.literal("")),
});
type Form = z.infer<typeof schema>;

export default function ComplaintsPage() {
  const organization = useOrganizationStore((state) => state.organization);
  const [complaints, setComplaints] = useState<Awaited<ReturnType<typeof listComplaints>>["data"]["complaints"]>([]);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [error, setError] = useState("");
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<Form>({ resolver: zodResolver(schema) });
  useEffect(() => { if (organization) listComplaints(organization.id).then((response) => setComplaints(response.data.complaints)).catch((reason) => setError(reason instanceof Error ? reason.message : "Unable to load complaints.")); }, [organization]);
  const onSubmit = async (values: Form) => {
    if (!organization) return;
    setError("");
    try {
      const response = await createComplaint({ ...values, organizationId: organization.id, evidenceUrl: values.evidenceUrl || undefined });
      setComplaints((items) => [response.data.complaint, ...items]);
      reset();
    } catch (reason) { setError(reason instanceof Error ? reason.message : "Unable to submit complaint."); }
  };
  const visible = statusFilter === "ALL" ? complaints : complaints.filter((item) => item.status === statusFilter);
  return <OrganizationShell description="Submit and follow complaints related to your organization." title="Complaints">
    {!organization ? <p className="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-900">Organization context is unavailable.</p> : <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
      <form className="h-fit space-y-4 rounded-3xl border border-slate-200 bg-white p-6" onSubmit={handleSubmit(onSubmit)}>
        <h2 className="text-lg font-semibold text-slate-950">File a complaint</h2>
        {error ? <p className="rounded-xl bg-red-50 p-3 text-sm text-red-700" role="alert">{error}</p> : null}
        <AuthField error={errors.reportedUserId?.message} label="Reported user ID" placeholder="User ID" {...register("reportedUserId")} />
        <AuthField error={errors.category?.message} label="Category" placeholder="Missed deadline" {...register("category")} />
        <label className="block text-sm font-medium text-slate-800">Description<textarea className="mt-2 block min-h-28 w-full rounded-xl border border-slate-200 px-3 py-3 text-sm" {...register("description")} /></label>
        <AuthField error={errors.evidenceUrl?.message} label="Evidence URL (optional)" placeholder="https://..." {...register("evidenceUrl")} />
        <button className="rounded-xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white disabled:opacity-60" disabled={isSubmitting} type="submit">{isSubmitting ? "Submitting..." : "Submit complaint"}</button>
      </form>
      <section className="rounded-3xl border border-slate-200 bg-white p-6">
        <div className="flex flex-wrap items-center justify-between gap-3"><h2 className="text-lg font-semibold text-slate-950">Complaint history</h2><select className="rounded-xl border border-slate-200 px-3 py-2 text-sm" onChange={(event) => setStatusFilter(event.target.value)} value={statusFilter}><option value="ALL">All statuses</option><option value="OPEN">Open</option><option value="UNDER_REVIEW">Under review</option><option value="RESOLVED">Resolved</option><option value="DISMISSED">Dismissed</option></select></div>
        <div className="mt-5 divide-y divide-slate-100">{visible.length ? visible.map((complaint) => <Link className="block py-4 hover:bg-slate-50" href={`/dashboard/complaints/${complaint.id}`} key={complaint.id}><div className="flex justify-between gap-3"><p className="font-semibold text-slate-950">{complaint.category}</p><span className="text-xs font-semibold text-slate-500">{complaint.status}</span></div><p className="mt-1 line-clamp-2 text-sm text-slate-600">{complaint.description}</p><p className="mt-2 text-xs text-slate-400">{new Date(complaint.createdAt).toLocaleString()}</p></Link>) : <p className="py-8 text-center text-sm text-slate-500">No complaints found.</p>}</div>
      </section>
    </div>}
  </OrganizationShell>;
}
