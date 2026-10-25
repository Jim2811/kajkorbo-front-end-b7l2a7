import { apiClient, type ApiResponse } from "@/lib/api-client";

export type TeamCapacityEntitlement = {
  id: string;
  organizationId: string;
  freeTeamCapacity: number;
  purchasedTeamCapacity: number;
  usedTeamCapacity: number;
  createdAt: string;
  updatedAt: string;
};

export type PaymentStatus =
  | "PENDING"
  | "SUCCEEDED"
  | "FAILED"
  | "CANCELLED"
  | "REFUNDED"
  | "DISPUTED";

export type Payment = {
  id: string;
  organizationId: string;
  amount: number;
  currency: string;
  purchasedTeamCapacity: number;
  status: PaymentStatus;
  paidAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export async function getTeamCapacity(organizationId: string) {
  return apiClient<ApiResponse<{ entitlement: TeamCapacityEntitlement | null }>>(
    `/billing/organizations/${organizationId}/team-capacity`,
  );
}

export async function listPayments(organizationId: string) {
  return apiClient<ApiResponse<{ payments: Payment[] }>>(
    `/billing/organizations/${organizationId}/payments`,
  );
}

export async function createCheckout(
  organizationId: string,
  additionalTeamCapacity: number,
) {
  return apiClient<
    ApiResponse<{
      checkout: {
        paymentId: string;
        status: PaymentStatus;
        checkoutSessionId: string;
        checkoutUrl: string;
      };
    }>
  >(`/billing/organizations/${organizationId}/checkout`, {
    method: "POST",
    headers: { "Idempotency-Key": crypto.randomUUID() },
    body: JSON.stringify({ additionalTeamCapacity }),
  });
}
