import { apiClient, type ApiResponse } from "@/lib/api-client";

export const complaintStatuses = ["OPEN", "UNDER_REVIEW", "RESOLVED", "DISMISSED"] as const;
export type ComplaintStatus = (typeof complaintStatuses)[number];

export type Complaint = {
  id: string;
  organizationId: string;
  complainantId: string;
  reportedUserId: string;
  teamId?: string | null;
  taskId?: string | null;
  subtaskId?: string | null;
  category: string;
  description: string;
  evidenceUrl?: string | null;
  status: ComplaintStatus;
  resolutionNotes?: string | null;
  createdAt: string;
  updatedAt?: string;
  resolvedAt?: string | null;
  organization?: { id: string; name: string };
  complainant?: { id: string; name: string; email: string };
  reportedUser?: { id: string; name: string; email: string };
  reviewer?: { id: string; name: string; email: string } | null;
};

export async function createComplaint(input: {
  organizationId: string;
  reportedUserId: string;
  teamId?: string;
  taskId?: string;
  subtaskId?: string;
  category: string;
  description: string;
  evidenceUrl?: string;
}) {
  return apiClient<ApiResponse<{ complaint: Complaint }>>("/complaints", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function listComplaints(organizationId?: string) {
  const query = organizationId ? `?organizationId=${encodeURIComponent(organizationId)}` : "";
  return apiClient<ApiResponse<{ complaints: Complaint[] }>>(`/complaints${query}`);
}

export async function getComplaint(complaintId: string) {
  return apiClient<ApiResponse<{ complaint: Complaint }>>(`/complaints/${complaintId}`);
}

export async function updateComplaintStatus(
  complaintId: string,
  input: { status: ComplaintStatus; resolutionNotes?: string },
) {
  return apiClient<ApiResponse<{ complaint: Complaint }>>(`/complaints/${complaintId}/status`, {
    method: "PATCH",
    body: JSON.stringify(input),
  });
}

export async function resolveComplaint(
  complaintId: string,
  input: { status: "RESOLVED" | "DISMISSED"; resolutionNotes: string },
) {
  return apiClient<ApiResponse<{ complaint: Complaint }>>(`/complaints/${complaintId}/resolve`, {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function getAdminDashboard() {
  return apiClient<ApiResponse<{ dashboard: Record<string, unknown> }>>("/super-admin/dashboard");
}

export async function listAdminUsers(search?: string, status?: string) {
  const params = new URLSearchParams();
  if (search) params.set("search", search);
  if (status) params.set("status", status);
  return apiClient<ApiResponse<{ users: Array<Record<string, unknown>> }>>(
    `/super-admin/users?${params.toString()}`,
  );
}

export async function listAdminOrganizations(search?: string, status?: string) {
  const params = new URLSearchParams();
  if (search) params.set("search", search);
  if (status) params.set("status", status);
  return apiClient<ApiResponse<{ organizations: Array<Record<string, unknown>> }>>(
    `/super-admin/organizations?${params.toString()}`,
  );
}

export async function listAdminComplaints() {
  return apiClient<ApiResponse<{ complaints: Complaint[] }>>("/super-admin/complaints");
}

export async function updateAdminComplaintStatus(
  complaintId: string,
  input: { status: ComplaintStatus; resolutionNotes?: string },
) {
  return apiClient<ApiResponse<{ complaint: Complaint }>>(`/super-admin/complaints/${complaintId}/status`, {
    method: "PATCH",
    body: JSON.stringify(input),
  });
}
