"use client";

import { AuthField } from "@/components/auth/auth-field";
import { AuthShell } from "@/components/auth/auth-shell";
import { verifyEmail } from "@/lib/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const verificationSchema = z.object({
  email: z.string().trim().email("Enter a valid email address"),
  otp: z.string().regex(/^\d{6}$/, "Enter the 6-digit verification code"),
});

type VerificationForm = z.infer<typeof verificationSchema>;

export default function VerifyEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [serverError, setServerError] = useState("");
  const { register: registerField, handleSubmit, formState: { errors, isSubmitting } } =
    useForm<VerificationForm>({
      resolver: zodResolver(verificationSchema),
      defaultValues: { email: searchParams.get("email") ?? "", otp: "" },
    });

  const onSubmit = async (values: VerificationForm) => {
    setServerError("");
    try {
      await verifyEmail(values);
      router.push("/login?verified=true");
    } catch (error) {
      setServerError(error instanceof Error ? error.message : "Unable to verify your email. Please try again.");
    }
  };

  return (
    <AuthShell
      description="Enter the 6-digit code sent to your email address."
      footer={
        <>
          Need to start over?{" "}
          <Link className="font-semibold text-slate-950 hover:text-lime-700" href="/register">
            Register again
          </Link>
        </>
      }
      title="Verify your email"
    >
      <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
        {serverError ? (
          <p className="rounded-xl border border-red-200 bg-red-50 px-3.5 py-3 text-sm text-red-700" role="alert">
            {serverError}
          </p>
        ) : null}
        <AuthField
          autoComplete="email"
          error={errors.email?.message}
          label="Email address"
          placeholder="you@example.com"
          type="email"
          {...registerField("email")}
        />
        <AuthField
          autoComplete="one-time-code"
          error={errors.otp?.message}
          inputMode="numeric"
          label="Verification code"
          maxLength={6}
          placeholder="123456"
          {...registerField("otp")}
        />
        <button
          className="w-full rounded-xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
          disabled={isSubmitting}
          type="submit"
        >
          {isSubmitting ? "Verifying..." : "Verify email"}
        </button>
      </form>
    </AuthShell>
  );
}
