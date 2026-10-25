import { RoleDashboardView } from "../_components/role-dashboard-view";

export function DashboardView({ firstName }: Readonly<{ firstName: string }>) {
  return (
    <RoleDashboardView
      cards={[
        {
          title: "Tasks",
          description: "Create and track work across your organization.",
          href: "/dashboard/tasks",
          action: "View tasks",
          tone: "dark",
        },
        {
          title: "Organization",
          description: "Manage members, teams, settings, and workspace details.",
          href: "/dashboard/organization",
          action: "Manage organization",
        },
        {
          title: "Billing and capacity",
          description: "Review plan usage, payments, and upgrade capacity.",
          href: "/dashboard/billing",
          action: "Open billing",
          tone: "lime",
        },
      ]}
      description="Manage delivery, people, capacity, and billing from your workspace."
      eyebrow="Organization workspace"
      title={`Run your organization, ${firstName}`}
    />
  );
}
