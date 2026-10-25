"use client";

import { AuthField } from "@/components/auth/auth-field";
import { AuthShell } from "@/components/auth/auth-shell";
import { createOrganization } from "@/lib/organization";
import { useAuthMeQuery } from "@/lib/auth-query";
import { useAuthStore } from "@/stores/auth-store";
import { useOrganizationStore } from "@/stores/organization-store";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const organizationSchema = z.object({
  name: z.string().trim().min(1, "Organization name is required"),
  email: z.string().trim().email("Enter a valid organization email"),
  description: z.string().trim().optional(),
  phone: z.string().trim().optional(),
  address: z.string().trim().optional(),
});

type OrganizationForm = z.infer<typeof organizationSchema>;

export default function OrganizationOnboardingPage() {
  const user = useAuthStore((state) => state.user);
  const isSessionLoading = useAuthStore((state) => state.isLoading);
  const setUser = useAuthStore((state) => state.setUser);
  const setOrganization = useOrganizationStore((state) => state.setOrganization);
  const sessionQuery = useAuthMeQuery();
  const [serverError, setServerError] = useState("");
  const [createdOrganization, setCreatedOrganization] = useState<string | null>(null);
  const { register, handleSubmit, setValue, formState: { errors, isSubmitting } } =
    useForm<OrganizationForm>({
      resolver: zodResolver(organizationSchema),
      defaultValues: { email: user?.email ?? "" },
    });
  const currentUser = user ?? sessionQuery.data?.data.profile;

  useEffect(() => {
    if (sessionQuery.data?.data.profile && !user) {
      setUser(sessionQuery.data.data.profile);
    }
    if (currentUser?.email) {
      setValue("email", currentUser.email);
    }
  }, [currentUser?.email, sessionQuery.data, setUser, setValue, user]);

  const onSubmit = async (values: OrganizationForm) => {
    setServerError("");
    try {
      const response = await createOrganization({
        ...values,
        description: values.description || undefined,
        phone: values.phone || undefined,
        address: values.address || undefined,
      });
      setCreatedOrganization(response.data.organization.name);
      setOrganization(response.data.organization);
      if (currentUser) {
        setUser({ ...currentUser, role: "ORG_OWNER" });
      }
    } catch (error) {
      setServerError(
        error instanceof Error
          ? error.message
          : "Unable to create your organization. Please try again.",
      );
    }
  };

  if (isSessionLoading || sessionQuery.isPending) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="h-9 w-9 animate-spin rounded-full border-4 border-slate-200 border-t-lime-600" />
      </main>
    );
  }

  if (!currentUser) {
    return null;
  }

  if (currentUser.role !== "USER" && !createdOrganization) {
    return (
      <AuthShell
        description="Your account already belongs to an organization."
        footer={
          <Link className="font-semibold text-slate-950 hover:text-lime-700" href="/">
            Return home
          </Link>
        }
        title="Onboarding is complete"
      >
        <p className="rounded-xl bg-lime-50 px-4 py-3 text-sm leading-6 text-lime-900">
          Organization onboarding is only available for new USER accounts.
        </p>
      </AuthShell>
    );
  }

  if (createdOrganization) {
    return (
      <AuthShell
        description="Your workspace is ready. You are now the organization owner."
        footer={
          <Link className="font-semibold text-slate-950 hover:text-lime-700" href="/">
            Return home
          </Link>
        }
        title="Organization created"
      >
        <div className="rounded-2xl border border-lime-200 bg-lime-50 p-4">
          <p className="text-sm text-lime-800">Your organization</p>
          <p className="mt-1 text-lg font-semibold text-lime-950">{createdOrganization}</p>
        </div>
        <Link
          className="mt-6 block w-full rounded-xl bg-slate-950 px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-slate-800"
          href="/"
        >
          Continue to Kajkorbo
        </Link>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      description="Set up your organization to start managing teams and tasks in Kajkorbo."
      footer={
        <Link className="font-semibold text-slate-950 hover:text-lime-700" href="/">
          Do this later
        </Link>
      }
      title="Create your organization"
    >
      <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
        {serverError ? (
          <p className="rounded-xl border border-red-200 bg-red-50 px-3.5 py-3 text-sm text-red-700" role="alert">
            {serverError}
          </p>
        ) : null}
        <AuthField
          autoComplete="organization"
          error={errors.name?.message}
          label="Organization name"
          placeholder="Acme Studio"
          {...register("name")}
        />
        <AuthField
          autoComplete="email"
          error={errors.email?.message}
          label="Organization email"
          placeholder="hello@acme.com"
          type="email"
          {...register("email")}
        />
        <label className="block">
          <span className="text-sm font-medium text-slate-800">Description</span>
          <textarea
            className="mt-2 block min-h-24 w-full resize-y rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-lime-500 focus:ring-4 focus:ring-lime-100"
            placeholder="What does your organization do?"
            {...register("description")}
          />
          {errors.description ? (
            <span className="mt-1.5 block text-xs text-red-600">{errors.description.message}</span>
          ) : null}
        </label>
        <AuthField
          autoComplete="tel"
          error={errors.phone?.message}
          label="Phone (optional)"
          placeholder="+880 1XXX XXXXXX"
          {...register("phone")}
        />
        <label className="block">
          <span className="text-sm font-medium text-slate-800">Address (optional)</span>
          <textarea
            className="mt-2 block min-h-20 w-full resize-y rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-lime-500 focus:ring-4 focus:ring-lime-100"
            placeholder="Organization address"
            {...register("address")}
          />
          {errors.address ? (
            <span className="mt-1.5 block text-xs text-red-600">{errors.address.message}</span>
          ) : null}
        </label>
        <button
          className="w-full rounded-xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
          disabled={isSubmitting}
          type="submit"
        >
          {isSubmitting ? "Creating organization..." : "Create organization"}
        </button>
      </form>
    </AuthShell>
  );
}
