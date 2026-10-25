import { RoleDashboardView } from "../_components/role-dashboard-view";

export function OrganizationDashboardView({ firstName }: Readonly<{ firstName: string }>) {
  return (
    <RoleDashboardView
      cards={[
        {
          title: "Tasks",
          description: "Review assigned work and update delivery progress.",
          href: "/dashboard/tasks",
          action: "View tasks",
          tone: "dark",
        },
        {
          title: "Complaints",
          description: "File and follow organization-related complaints.",
          href: "/dashboard/complaints",
          action: "View complaints",
        },
      ]}
      description="Follow tasks, contribute to delivery, and raise concerns when needed."
      eyebrow="Organization workspace"
      title={`Coordinate organization work, ${firstName}`}
    />
  );
}
