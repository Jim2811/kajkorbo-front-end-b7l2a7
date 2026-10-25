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

export type Team = {
  id: string;
  organizationId: string;
  name: string;
  description: string | null;
  leaderId: string | null;
  status: "ACTIVE" | "ARCHIVED" | "DELETED";
};

export type Invitation = {
  id: string;
  invitedEmail: string;
  status: string;
};

export async function inviteOrganizationMember(organizationId: string, email: string) {
  return apiClient<ApiResponse<{ invitation: Invitation }>>(
    `/organizations/${organizationId}/members`,
    { method: "POST", body: JSON.stringify({ email }) },
  );
}

export async function createTeam(
  organizationId: string,
  input: { name: string; description?: string },
) {
  return apiClient<ApiResponse<{ team: Team }>>(`/organizations/${organizationId}/teams`, {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function deleteTeam(teamId: string) {
  return apiClient<ApiResponse<{ team: Team }>>(`/organizations/teams/${teamId}`, {
    method: "DELETE",
  });
}

export async function addTeamMember(teamId: string, userId: string) {
  return apiClient<ApiResponse<{ membership: { id: string; teamId: string; userId: string } }>>(
    `/organizations/teams/${teamId}/members`,
    { method: "POST", body: JSON.stringify({ userId }) },
  );
}

export async function removeTeamMember(teamId: string, userId: string) {
  return apiClient<ApiResponse<{ membership: { id: string; teamId: string; userId: string } }>>(
    `/organizations/teams/${teamId}/members/${userId}`,
    { method: "DELETE" },
  );
}

export async function assignTeamLeader(teamId: string, userId: string) {
  return apiClient<ApiResponse<{ team: Team }>>(`/organizations/teams/${teamId}/leader`, {
    method: "PATCH",
    body: JSON.stringify({ userId }),
  });
}
