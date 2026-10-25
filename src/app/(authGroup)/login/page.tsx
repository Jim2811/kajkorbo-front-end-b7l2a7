"use client";

import { AuthField } from "@/components/auth/auth-field";
import { AuthShell } from "@/components/auth/auth-shell";
import { demoLogin, login, type DemoRole } from "@/lib/auth";
import { useAuthStore } from "@/stores/auth-store";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().trim().email("Enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const setUser = useAuthStore((state) => state.setUser);
  const [serverError, setServerError] = useState("");
  const [demoLoading, setDemoLoading] = useState<DemoRole | null>(null);
  const { register: registerField, handleSubmit, formState: { errors, isSubmitting } } =
    useForm<LoginForm>({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (values: LoginForm) => {
    setServerError("");
    try {
      const response = await login(values);
      setUser(response.data.user);
      queryClient.setQueryData(["auth", "me"], {
        success: true,
        statusCode: 200,
        message: "Profile retrieved successfully",
        data: { profile: response.data.user },
      });
      router.push(response.data.user.role === "USER" ? "/onboarding/organization" : "/");
      router.refresh();
    } catch (error) {
      setServerError(error instanceof Error ? error.message : "Unable to log in. Please try again.");
    }
  };

  const onDemoLogin = async (role: DemoRole) => {
    setServerError("");
    setDemoLoading(role);
    try {
      const response = await demoLogin(role);
      setUser(response.data.user);
      queryClient.setQueryData(["auth", "me"], {
        ...response,
        data: { profile: response.data.user },
      });
      router.push(response.data.user.role === "USER" ? "/onboarding/organization" : "/");
      router.refresh();
    } catch (error) {
      setServerError(error instanceof Error ? error.message : "Demo login is unavailable.");
    } finally {
      setDemoLoading(null);
    }
  };

  return (
    <AuthShell
      description="Sign in to continue to your Kajkorbo workspace."
      footer={
        <>
          Don&apos;t have an account?{" "}
          <Link className="font-semibold text-slate-950 hover:text-lime-700" href="/register">
            Create one
          </Link>
        </>
      }
      title="Welcome back"
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
          autoComplete="current-password"
          error={errors.password?.message}
          label="Password"
          placeholder="Enter your password"
          type="password"
          {...registerField("password")}
        />
        <button
          className="w-full rounded-xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
          disabled={isSubmitting}
          type="submit"
        >
          {isSubmitting ? "Signing in..." : "Sign in"}
        </button>
      </form>
      <div className="mt-7 border-t border-slate-200 pt-6">
        <p className="text-center text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
          Try a demo workspace
        </p>
        <div className="mt-4 grid gap-2">
          {([
            ["admin", "Platform admin"],
            ["owner", "Organization owner"],
            ["member", "Delivery team"],
          ] as const).map(([role, label]) => (
            <button
              className="rounded-xl border border-slate-200 px-3.5 py-2.5 text-left text-sm font-medium text-slate-700 transition hover:border-lime-500 hover:bg-lime-50 disabled:cursor-not-allowed disabled:opacity-60"
              disabled={isSubmitting || demoLoading !== null}
              key={role}
              onClick={() => onDemoLogin(role)}
              type="button"
            >
              {demoLoading === role ? "Signing in..." : label}
            </button>
          ))}
        </div>
      </div>
    </AuthShell>
  );
}
