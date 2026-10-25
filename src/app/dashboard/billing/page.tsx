"use client";

import { OrganizationOwnerGuard } from "@/components/organization/organization-owner-guard";
import { OrganizationShell } from "@/components/organization/organization-shell";
import {
  createCheckout,
  getTeamCapacity,
  listPayments,
  type Payment,
  type TeamCapacityEntitlement,
} from "@/lib/billing";
import { useOrganizationStore } from "@/stores/organization-store";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

function formatAmount(amount: number, currency: string) {
  try {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency: currency.toUpperCase(),
    }).format(amount / 100);
  } catch {
    return `${(amount / 100).toFixed(2)} ${currency.toUpperCase()}`;
  }
}

function statusClasses(status: Payment["status"]) {
  if (status === "SUCCEEDED") return "bg-lime-100 text-lime-800";
  if (status === "PENDING") return "bg-amber-100 text-amber-800";
  return "bg-slate-100 text-slate-600";
}

export default function BillingPage() {
  const organization = useOrganizationStore((state) => state.organization);
  const searchParams = useSearchParams();
  const checkoutState = searchParams.get("checkout");
  const [entitlement, setEntitlement] = useState<TeamCapacityEntitlement | null>(null);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [additionalCapacity, setAdditionalCapacity] = useState("5");
  const [loading, setLoading] = useState(true);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!organization) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");
    Promise.all([getTeamCapacity(organization.id), listPayments(organization.id)])
      .then(([capacityResponse, paymentsResponse]) => {
        setEntitlement(capacityResponse.data.entitlement);
        setPayments(paymentsResponse.data.payments);
      })
      .catch((reason) => {
        setError(reason instanceof Error ? reason.message : "Unable to load billing details.");
      })
      .finally(() => setLoading(false));
  }, [checkoutState, organization]);

  const totalCapacity = useMemo(
    () => (entitlement ? entitlement.freeTeamCapacity + entitlement.purchasedTeamCapacity : 0),
    [entitlement],
  );
  const remainingCapacity = entitlement ? Math.max(0, totalCapacity - entitlement.usedTeamCapacity) : 0;
  const usagePercent = totalCapacity
    ? Math.min(100, Math.round((entitlement!.usedTeamCapacity / totalCapacity) * 100))
    : 0;
  const isFreePlan = organization?.plan === "FREE";

  const startCheckout = async () => {
    if (!organization) return;
    const quantity = Number(additionalCapacity);
    if (!Number.isInteger(quantity) || quantity < 1 || quantity > 100) {
      setError("Enter an additional capacity between 1 and 100.");
      return;
    }

    setIsCheckingOut(true);
    setError("");
    try {
      const response = await createCheckout(organization.id, quantity);
      window.location.assign(response.data.checkout.checkoutUrl);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Unable to start checkout.");
      setIsCheckingOut(false);
    }
  };

  if (!organization) {
    return (
      <OrganizationOwnerGuard>
        <OrganizationShell description="Connect an organization before managing billing." title="Billing">
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-900">
            No organization is available in this browser session.{" "}
            <Link className="font-semibold underline" href="/onboarding/organization">
              Open onboarding
            </Link>
          </div>
        </OrganizationShell>
      </OrganizationOwnerGuard>
    );
  }

  return (
    <OrganizationOwnerGuard>
      <OrganizationShell
        description="Review your current plan, team capacity, and payment history."
        title="Billing"
      >
        {checkoutState === "success" ? (
          <div className="mb-6 rounded-2xl border border-lime-200 bg-lime-50 p-5" role="status">
            <p className="font-semibold text-lime-950">Checkout completed</p>
            <p className="mt-1 text-sm leading-6 text-lime-900">
              Stripe confirmed the checkout return. Billing data has been refreshed; your capacity
              may update shortly while the payment webhook is processed.
            </p>
          </div>
        ) : null}
        {checkoutState === "cancelled" ? (
          <div className="mb-6 rounded-2xl border border-amber-200 bg-amber-50 p-5" role="status">
            <p className="font-semibold text-amber-950">Checkout cancelled</p>
            <p className="mt-1 text-sm leading-6 text-amber-900">
              No capacity was added. You can return to checkout whenever you are ready.
            </p>
          </div>
        ) : null}
        {error ? (
          <p className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
            {error}
          </p>
        ) : null}
        {loading ? (
          <div className="rounded-3xl border border-slate-200 bg-white p-8 text-sm text-slate-500">
            Loading billing details...
          </div>
        ) : (
          <div className="space-y-8">
            <section className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-3xl border border-slate-200 bg-slate-950 p-6 text-white">
                <p className="text-sm text-slate-400">Current plan</p>
                <p className="mt-3 text-3xl font-semibold">{organization.plan}</p>
                <p className="mt-2 text-sm text-slate-400">{organization.status}</p>
              </div>
              <div className="rounded-3xl border border-slate-200 bg-white p-6">
                <p className="text-sm text-slate-500">Team capacity</p>
                <p className="mt-3 text-3xl font-semibold text-slate-950">
                  {entitlement ? totalCapacity : "Unavailable"}
                </p>
                <p className="mt-2 text-sm text-slate-500">
                  {entitlement ? `${remainingCapacity} remaining` : "The backend returned no entitlement."}
                </p>
              </div>
              <div className="rounded-3xl border border-slate-200 bg-white p-6">
                <p className="text-sm text-slate-500">Capacity used</p>
                <p className="mt-3 text-3xl font-semibold text-slate-950">
                  {entitlement ? `${usagePercent}%` : "Unavailable"}
                </p>
                {entitlement ? (
                  <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100">
                    <div className="h-full rounded-full bg-lime-500" style={{ width: `${usagePercent}%` }} />
                  </div>
                ) : null}
              </div>
            </section>

            {isFreePlan || (entitlement && remainingCapacity <= 1) ? (
              <section className="rounded-3xl border border-lime-200 bg-lime-50 p-6">
                <p className="text-sm font-semibold uppercase tracking-[0.14em] text-lime-800">
                  {isFreePlan ? "Upgrade your workspace" : "Capacity is running low"}
                </p>
                <h2 className="mt-2 text-2xl font-semibold text-lime-950">
                  Add room for more teams
                </h2>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-lime-900">
                  Purchase additional team capacity through secure Stripe checkout. The entitlement
                  updates after payment confirmation.
                </p>
                <div className="mt-5 flex flex-wrap items-end gap-3">
                  <label className="text-sm font-medium text-lime-950">
                    Additional capacity
                    <input
                      className="mt-2 block w-36 rounded-xl border border-lime-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-lime-600 focus:ring-4 focus:ring-lime-100"
                      max={100}
                      min={1}
                      onChange={(event) => setAdditionalCapacity(event.target.value)}
                      type="number"
                      value={additionalCapacity}
                    />
                  </label>
                  <button
                    className="rounded-xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white disabled:opacity-60"
                    disabled={isCheckingOut}
                    onClick={startCheckout}
                    type="button"
                  >
                    {isCheckingOut ? "Opening checkout..." : "Upgrade capacity"}
                  </button>
                </div>
              </section>
            ) : null}

            <section className="rounded-3xl border border-slate-200 bg-white p-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold text-slate-950">Payment history</h2>
                  <p className="mt-1 text-sm text-slate-500">Capacity purchases for this organization.</p>
                </div>
                <span className="text-sm text-slate-500">{payments.length} payment{payments.length === 1 ? "" : "s"}</span>
              </div>
              {payments.length ? (
                <div className="mt-5 overflow-x-auto">
                  <table className="w-full min-w-[620px] text-left text-sm">
                    <thead className="border-b border-slate-100 text-xs uppercase tracking-wide text-slate-500">
                      <tr>
                        <th className="pb-3 pr-4 font-semibold">Date</th>
                        <th className="pb-3 pr-4 font-semibold">Capacity</th>
                        <th className="pb-3 pr-4 font-semibold">Amount</th>
                        <th className="pb-3 font-semibold">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {payments.map((payment) => (
                        <tr key={payment.id}>
                          <td className="py-4 pr-4 text-slate-700">{new Date(payment.createdAt).toLocaleDateString()}</td>
                          <td className="py-4 pr-4 text-slate-700">{payment.purchasedTeamCapacity} teams</td>
                          <td className="py-4 pr-4 font-medium text-slate-900">{formatAmount(payment.amount, payment.currency)}</td>
                          <td className="py-4"><span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusClasses(payment.status)}`}>{payment.status}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="mt-6 rounded-2xl bg-slate-50 p-5 text-sm text-slate-500">
                  No payments have been recorded yet. Your free capacity is available above.
                </p>
              )}
            </section>
          </div>
        )}
      </OrganizationShell>
    </OrganizationOwnerGuard>
  );
}
