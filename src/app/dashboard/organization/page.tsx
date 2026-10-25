"use client";

import { OrganizationShell } from "@/components/organization/organization-shell";
import { useOrganizationStore } from "@/stores/organization-store";
import Link from "next/link";

export default function OrganizationOverviewPage() {
  const organization = useOrganizationStore((state) => state.organization);

  if (!organization) {
    return (
      <OrganizationShell
        description="Your organization details will appear here once your workspace is connected."
        title="Organization overview"
      >
        <div className="rounded-3xl border border-amber-200 bg-amber-50 p-6">
          <h2 className="text-lg font-semibold text-amber-950">Organization context unavailable</h2>
          <p className="mt-2 max-w-xl text-sm leading-6 text-amber-900">
            Create your organization through onboarding, or sign in from the same browser where
            it was created. The current backend does not yet expose a read-organization endpoint.
          </p>
          <Link
            className="mt-5 inline-flex rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white"
            href="/onboarding/organization"
          >
            Open onboarding
          </Link>
        </div>
      </OrganizationShell>
    );
  }

  return (
    <OrganizationShell
      description="A quick view of your workspace identity and current plan."
      title={organization.name}
    >
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:col-span-2">
          <p className="text-sm text-slate-500">About the organization</p>
          <p className="mt-3 text-base leading-7 text-slate-700">
            {organization.description || "Add a description to help your team understand this workspace."}
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-slate-950 p-5 text-white">
          <p className="text-sm text-slate-400">Current plan</p>
          <p className="mt-3 text-2xl font-semibold">{organization.plan}</p>
          <span className="mt-3 inline-flex rounded-full bg-lime-300 px-2.5 py-1 text-xs font-bold text-lime-950">
            {organization.status}
          </span>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:col-span-3">
          <p className="text-sm font-semibold text-slate-950">Contact details</p>
          <dl className="mt-4 grid gap-4 text-sm sm:grid-cols-3">
            <div><dt className="text-slate-500">Email</dt><dd className="mt-1 font-medium text-slate-900">{organization.email}</dd></div>
            <div><dt className="text-slate-500">Phone</dt><dd className="mt-1 font-medium text-slate-900">{organization.phone || "Not provided"}</dd></div>
            <div><dt className="text-slate-500">Address</dt><dd className="mt-1 font-medium text-slate-900">{organization.address || "Not provided"}</dd></div>
          </dl>
        </div>
      </div>
      <Link
        className="mt-6 inline-flex rounded-xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white hover:bg-slate-800"
        href="/dashboard/organization/settings"
      >
        Manage organization settings
      </Link>
    </OrganizationShell>
  );
}
