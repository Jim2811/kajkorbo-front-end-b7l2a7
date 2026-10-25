import { RoleDashboardView } from "../_components/role-dashboard-view";

export function TeamMemberDashboardView({ firstName }: Readonly<{ firstName: string }>) {
  return (
    <RoleDashboardView
      cards={[
        {
          title: "My tasks",
          description: "Review assigned tasks and update their progress.",
          href: "/dashboard/tasks",
          action: "View my tasks",
          tone: "dark",
        },
        {
          title: "Complaints",
          description: "File and follow a complaint when something needs attention.",
          href: "/dashboard/complaints",
          action: "View complaints",
        },
      ]}
      description="Review tasks, submit subtasks, and keep your team informed."
      eyebrow="Team workspace"
      title={`Focus on your assigned work, ${firstName}`}
    />
  );
}
