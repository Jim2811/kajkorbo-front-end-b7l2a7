"use client";

import { AuthField } from "@/components/auth/auth-field";
import { OrganizationShell } from "@/components/organization/organization-shell";
import { updateOrganization } from "@/lib/organization";
import { useOrganizationStore } from "@/stores/organization-store";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { z } from "zod";

const settingsSchema = z.object({
  name: z.string().trim().min(1, "Organization name is required"),
  email: z.string().trim().email("Enter a valid organization email"),
  description: z.string().trim().optional(),
  phone: z.string().trim().optional(),
  address: z.string().trim().optional(),
});

type SettingsForm = z.infer<typeof settingsSchema>;

export default function OrganizationSettingsPage() {
  const organization = useOrganizationStore((state) => state.organization);
  const setOrganization = useOrganizationStore((state) => state.setOrganization);
  const [serverError, setServerError] = useState("");
  const [saved, setSaved] = useState(false);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<SettingsForm>({
    resolver: zodResolver(settingsSchema),
    values: organization
      ? {
          name: organization.name,
          email: organization.email,
          description: organization.description ?? "",
          phone: organization.phone ?? "",
          address: organization.address ?? "",
        }
      : undefined,
  });

  if (!organization) {
    return (
      <OrganizationShell description="Connect an organization before changing its settings." title="Organization settings">
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-900">
          No organization is available in this browser session.{" "}
          <Link className="font-semibold underline" href="/onboarding/organization">Open onboarding</Link>
        </div>
      </OrganizationShell>
    );
  }

  const onSubmit = async (values: SettingsForm) => {
    setServerError("");
    setSaved(false);
    try {
      const response = await updateOrganization(organization.id, {
        ...values,
        description: values.description || undefined,
        phone: values.phone || null,
        address: values.address || null,
      });
      setOrganization(response.data.organization);
      setSaved(true);
    } catch (error) {
      setServerError(error instanceof Error ? error.message : "Unable to save settings.");
    }
  };

  return (
    <OrganizationShell description="Update the details your team and members see." title="Organization settings">
      <form className="max-w-2xl space-y-5 rounded-3xl border border-slate-200 bg-white p-6 sm:p-8" onSubmit={handleSubmit(onSubmit)}>
        {serverError ? <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">{serverError}</p> : null}
        {saved ? <p className="rounded-xl border border-lime-200 bg-lime-50 px-4 py-3 text-sm text-lime-800" role="status">Organization settings saved.</p> : null}
        <AuthField error={errors.name?.message} label="Organization name" {...register("name")} />
        <AuthField error={errors.email?.message} label="Organization email" type="email" {...register("email")} />
        <label className="block text-sm font-medium text-slate-800">
          Description
          <textarea className="mt-2 block min-h-28 w-full rounded-xl border border-slate-200 px-3.5 py-3 text-sm outline-none focus:border-lime-500 focus:ring-4 focus:ring-lime-100" {...register("description")} />
        </label>
        <AuthField error={errors.phone?.message} label="Phone" {...register("phone")} />
        <label className="block text-sm font-medium text-slate-800">
          Address
          <textarea className="mt-2 block min-h-24 w-full rounded-xl border border-slate-200 px-3.5 py-3 text-sm outline-none focus:border-lime-500 focus:ring-4 focus:ring-lime-100" {...register("address")} />
        </label>
        <button className="rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white disabled:opacity-60" disabled={isSubmitting} type="submit">
          {isSubmitting ? "Saving..." : "Save changes"}
        </button>
      </form>
    </OrganizationShell>
  );
}
