"use client";

import { AuthField } from "@/components/auth/auth-field";
import { AuthShell } from "@/components/auth/auth-shell";
import { register } from "@/lib/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const registerSchema = z
  .object({
    name: z.string().trim().min(1, "Name is required"),
    email: z.string().trim().email("Enter a valid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type RegisterForm = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const [serverError, setServerError] = useState("");
  const { register: registerField, handleSubmit, formState: { errors, isSubmitting } } =
    useForm<RegisterForm>({ resolver: zodResolver(registerSchema) });

  const onSubmit = async ({ confirmPassword: _confirmPassword, ...values }: RegisterForm) => {
    setServerError("");
    try {
      await register(values);
      router.push(`/verify-email?email=${encodeURIComponent(values.email)}`);
    } catch (error) {
      setServerError(error instanceof Error ? error.message : "Unable to create your account. Please try again.");
    }
  };

  return (
    <AuthShell
      description="Create your account and start organizing meaningful work."
      footer={
        <>
          Already have an account?{" "}
          <Link className="font-semibold text-slate-950 hover:text-lime-700" href="/login">
            Sign in
          </Link>
        </>
      }
      title="Create your account"
    >
      <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
        {serverError ? (
          <p className="rounded-xl border border-red-200 bg-red-50 px-3.5 py-3 text-sm text-red-700" role="alert">
            {serverError}
          </p>
        ) : null}
        <AuthField
          autoComplete="name"
          error={errors.name?.message}
          label="Full name"
          placeholder="Your name"
          {...registerField("name")}
        />
        <AuthField
          autoComplete="email"
          error={errors.email?.message}
          label="Email address"
          placeholder="you@example.com"
          type="email"
          {...registerField("email")}
        />
        <AuthField
          autoComplete="new-password"
          error={errors.password?.message}
          label="Password"
          placeholder="At least 6 characters"
          type="password"
          {...registerField("password")}
        />
        <AuthField
          autoComplete="new-password"
          error={errors.confirmPassword?.message}
          label="Confirm password"
          placeholder="Repeat your password"
          type="password"
          {...registerField("confirmPassword")}
        />
        <button
          className="w-full rounded-xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
          disabled={isSubmitting}
          type="submit"
        >
          {isSubmitting ? "Creating account..." : "Create account"}
        </button>
      </form>
    </AuthShell>
  );
}
