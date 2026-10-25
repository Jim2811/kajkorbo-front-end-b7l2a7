import { apiClient, type ApiResponse } from "@/lib/api-client";

export type PublicOrganization = {
  id: string;
  name: string;
  description: string | null;
  logo: string | null;
  slug: string | null;
  plan: "FREE" | "PREMIUM" | "ENTERPRISE";
  createdAt: string;
};

export async function listPublicOrganizations(search?: string) {
  const query = search?.trim()
    ? `?search=${encodeURIComponent(search.trim())}`
    : "";

  return apiClient<ApiResponse<{ organizations: PublicOrganization[] }>>(
    `/organizations/public${query}`,
  );
}
