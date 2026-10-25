import { apiClient, type ApiResponse } from "@/lib/api-client";

export type CreateOrganizationInput = {
  name: string;
  description?: string;
  email: string;
  phone?: string;
  address?: string;
  logo?: string;
};

export type Organization = {
  id: string;
  name: string;
  description: string | null;
  email: string;
  phone: string | null;
  address: string | null;
  plan: "FREE" | "PREMIUM" | "ENTERPRISE";
  status: "ACTIVE" | "SUSPENDED" | "DEACTIVATED";
};

export async function createOrganization(input: CreateOrganizationInput) {
  return apiClient<ApiResponse<{ organization: Organization }>>("/organizations", {
    method: "POST",
    body: JSON.stringify(input),
  });
}
