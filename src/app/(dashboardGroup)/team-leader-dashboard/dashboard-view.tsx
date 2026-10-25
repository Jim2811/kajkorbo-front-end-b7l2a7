import { RoleDashboardView } from "../_components/role-dashboard-view";

export function TeamLeaderDashboardView({ firstName }: Readonly<{ firstName: string }>) {
  return (
    <RoleDashboardView
      cards={[
        {
          title: "Team tasks",
          description: "Review task status and coordinate subtask delivery.",
          href: "/dashboard/tasks",
          action: "Open team tasks",
          tone: "dark",
        },
        {
          title: "Complaints",
          description: "Review or file complaints related to team work.",
          href: "/dashboard/complaints",
          action: "View complaints",
        },
      ]}
      description="Prioritize team work, coordinate subtasks, and keep progress visible."
      eyebrow="Team leadership"
      title={`Lead your team's delivery, ${firstName}`}
    />
  );
}
