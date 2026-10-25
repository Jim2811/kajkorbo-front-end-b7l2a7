import type { UserRole } from "@/lib/auth";

export type NavigationItem = {
  label: string;
  href: string;
  roles?: UserRole[];
};

export const roleAwareNavigation: NavigationItem[] = [
  { label: "Overview", href: "/dashboard" },
  {
    label: "Tasks",
    href: "/dashboard/tasks",
    roles: ["ORG_OWNER", "ORG_MEMBER", "TEAM_LEADER", "TEAM_MEMBER"],
  },
  {
    label: "Organization",
    href: "/dashboard/organization",
    roles: ["ORG_OWNER"],
  },
  {
    label: "Members",
    href: "/dashboard/organization/members",
    roles: ["ORG_OWNER"],
  },
  {
    label: "Teams",
    href: "/dashboard/organization/teams",
    roles: ["ORG_OWNER"],
  },
  {
    label: "Billing",
    href: "/dashboard/billing",
    roles: ["ORG_OWNER"],
  },
  {
    label: "Admin",
    href: "/admin",
    roles: ["SUPER_ADMIN"],
  },
];

export function getNavigationForRole(role: UserRole | undefined) {
  return roleAwareNavigation.filter(
    (item) => !item.roles || (role && item.roles.includes(role)),
  );
}
