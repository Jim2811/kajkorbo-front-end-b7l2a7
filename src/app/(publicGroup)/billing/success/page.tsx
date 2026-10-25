import { redirect } from "next/navigation";

export default function BillingSuccessPage() {
  redirect("/dashboard/billing?checkout=success");
}
