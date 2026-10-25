"use client";

import { AuthField } from "@/components/auth/auth-field";
import { OrganizationShell } from "@/components/organization/organization-shell";
import { OrganizationOwnerGuard } from "@/components/organization/organization-owner-guard";
import { inviteOrganizationMember } from "@/app/(dashboardGroup)/_actions/organization-actions";
import { useOrganizationStore } from "@/stores/organization-store";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const inviteSchema = z.object({
  email: z.string().trim().email("Enter a valid user email"),
});

type InviteForm = z.infer<typeof inviteSchema>;

export default function OrganizationMembersPage() {
  const organization = useOrganizationStore((state) => state.organization);
  const [message, setMessage] = useState("");
  const [serverError, setServerError] = useState("");
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } =
    useForm<InviteForm>({ resolver: zodResolver(inviteSchema) });

  if (!organization) {
    return (
      <OrganizationOwnerGuard>
        <OrganizationShell description="Connect an organization first." title="Members">
          <p className="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-900">
            Organization context is unavailable in this browser session.
          </p>
        </OrganizationShell>
      </OrganizationOwnerGuard>
    );
  }

  const onSubmit = async ({ email }: InviteForm) => {
    setMessage("");
    setServerError("");
    try {
      const response = await inviteOrganizationMember(organization.id, email);
      setMessage(response.message || `Invitation created for ${email}.`);
      reset();
    } catch (error) {
      setServerError(error instanceof Error ? error.message : "Unable to create invitation.");
    }
  };

  return (
    <OrganizationOwnerGuard>
      <OrganizationShell
        description="Invite existing Kajkorbo users to join your organization."
        title="Members"
      >
        <div className="max-w-xl rounded-3xl border border-slate-200 bg-white p-6 sm:p-8">
        <h2 className="text-lg font-semibold text-slate-950">Invite a member</h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          The user must already have a Kajkorbo account. Pending invitations are managed by the backend.
        </p>
        <form className="mt-6 space-y-5" onSubmit={handleSubmit(onSubmit)}>
          {serverError ? <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">{serverError}</p> : null}
          {message ? <p className="rounded-xl border border-lime-200 bg-lime-50 px-4 py-3 text-sm text-lime-800" role="status">{message}</p> : null}
          <AuthField
            autoComplete="email"
            error={errors.email?.message}
            label="Member email"
            placeholder="member@example.com"
            type="email"
            {...register("email")}
          />
          <button className="rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white disabled:opacity-60" disabled={isSubmitting} type="submit">
            {isSubmitting ? "Sending invitation..." : "Send invitation"}
          </button>
        </form>
        </div>
      </OrganizationShell>
    </OrganizationOwnerGuard>
  );
}
