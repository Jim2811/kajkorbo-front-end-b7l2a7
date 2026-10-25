import { apiClient, type ApiResponse } from "@/lib/api-client";

export type UserRole =
  | "USER"
  | "SUPER_ADMIN"
  | "ORG_OWNER"
  | "ORG_MEMBER"
  | "TEAM_LEADER"
  | "TEAM_MEMBER";

export type AuthUser = {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar: string | null;
  provider: string;
  isVerified: boolean;
};

type AuthPayload = {
  user: AuthUser;
  accessToken?: string;
  refreshToken?: string;
};

export type LoginInput = {
  email: string;
  password: string;
};

export type RegisterInput = {
  name: string;
  email: string;
  password: string;
};

export async function login(input: LoginInput) {
  return apiClient<ApiResponse<AuthPayload>>("/auth/login", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function register(input: RegisterInput) {
  return apiClient<ApiResponse<{ user: AuthUser }>>("/auth/register", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function verifyEmail(input: { email: string; otp: string }) {
  return apiClient<ApiResponse<{ user: AuthUser }>>("/auth/verify-email", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function getCurrentUser() {
  return apiClient<ApiResponse<{ profile: AuthUser }>>("/auth/me");
}

export type DemoRole = "admin" | "owner" | "member";

export async function demoLogin(role: DemoRole) {
  const response = await fetch("/api/auth/demo-login", {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ role }),
  });
  const body = (await response.json().catch(() => null)) as
    | ApiResponse<AuthPayload>
    | { message?: string }
    | null;

  if (!response.ok) {
    throw new Error(
      body && "message" in body && body.message
        ? body.message
        : "Demo login is not available.",
    );
  }

  return body as ApiResponse<AuthPayload>;
}
