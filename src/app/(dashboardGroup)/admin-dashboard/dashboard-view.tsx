import { RoleDashboardView } from "../_components/role-dashboard-view";

export function AdminDashboardView({ firstName }: Readonly<{ firstName: string }>) {
  return (
    <RoleDashboardView
      cards={[
        {
          title: "Admin dashboard",
          description: "Review platform metrics and moderation queues.",
          href: "/admin",
          action: "Open administration",
          tone: "dark",
        },
        {
          title: "Complaint moderation",
          description: "Review reports and record documented outcomes.",
          href: "/admin/complaints",
          action: "Review complaints",
        },
      ]}
      description="Review platform activity and handle moderation work from one place."
      eyebrow="Platform control"
      title={`Keep Kajkorbo healthy, ${firstName}`}
    />
  );
}
