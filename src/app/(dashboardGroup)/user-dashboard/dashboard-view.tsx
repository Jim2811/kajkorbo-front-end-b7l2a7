import { RoleDashboardView } from "../_components/role-dashboard-view";

export function UserDashboardView({ firstName }: Readonly<{ firstName: string }>) {
  return (
    <RoleDashboardView
      cards={[
        {
          title: "Organization onboarding",
          description: "Create your organization and become its owner.",
          href: "/onboarding/organization",
          action: "Start onboarding",
          tone: "lime",
        },
      ]}
      description="Set up a workspace before you start managing teams and tasks."
      eyebrow="Getting started"
      title={`Create your organization, ${firstName}`}
    />
  );
}
