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

export type UpdateOrganizationInput = Omit<Partial<CreateOrganizationInput>, "phone" | "address"> & {
  phone?: string | null;
  address?: string | null;
  logo?: string | null;
};

export async function updateOrganization(
  organizationId: string,
  input: UpdateOrganizationInput,
) {
  return apiClient<ApiResponse<{ organization: Organization }>>(
    `/organizations/${organizationId}`,
    {
      method: "PATCH",
      body: JSON.stringify(input),
    },
  );
}
