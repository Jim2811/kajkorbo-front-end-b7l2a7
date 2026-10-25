import { redirect } from "next/navigation";

export default function BillingCancelPage() {
  redirect("/dashboard/billing?checkout=cancelled");
}
