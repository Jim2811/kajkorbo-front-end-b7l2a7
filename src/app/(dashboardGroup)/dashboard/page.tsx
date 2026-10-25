"use client";

import { useAuthStore } from "@/stores/auth-store";
import Link from "next/link";

type DashboardCard = {
  title: string;
  description: string;
  href: string;
  action: string;
  tone?: "dark" | "light" | "lime";
};

const roleContent = {
  USER: {
    eyebrow: "Getting started",
    title: "Create your organization",
    description: "Set up a workspace before you start managing teams and tasks.",
    cards: [
      {
        title: "Organization onboarding",
        description: "Create your organization and become its owner.",
        href: "/onboarding/organization",
        action: "Start onboarding",
        tone: "lime",
      },
    ],
  },
  SUPER_ADMIN: {
    eyebrow: "Platform control",
    title: "Keep Kajkorbo healthy",
    description: "Review platform activity and handle moderation work from one place.",
    cards: [
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
        tone: "light",
      },
    ],
  },
  ORG_OWNER: {
    eyebrow: "Organization workspace",
    title: "Run your organization",
    description: "Manage delivery, people, capacity, and billing from your workspace.",
    cards: [
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
        tone: "light",
      },
      {
        title: "Billing and capacity",
        description: "Review plan usage, payments, and upgrade capacity.",
        href: "/dashboard/billing",
        action: "Open billing",
        tone: "lime",
      },
    ],
  },
  ORG_MEMBER: {
    eyebrow: "Organization workspace",
    title: "Coordinate organization work",
    description: "Follow tasks, contribute to delivery, and raise concerns when needed.",
    cards: [
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
        tone: "light",
      },
    ],
  },
  TEAM_LEADER: {
    eyebrow: "Team leadership",
    title: "Lead your team’s delivery",
    description: "Prioritize team work, coordinate subtasks, and keep progress visible.",
    cards: [
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
        tone: "light",
      },
    ],
  },
  TEAM_MEMBER: {
    eyebrow: "Team workspace",
    title: "Focus on your assigned work",
    description: "Review tasks, submit subtasks, and keep your team informed.",
    cards: [
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
        tone: "light",
      },
    ],
  },
} satisfies Record<string, {
  eyebrow: string;
  title: string;
  description: string;
  cards: DashboardCard[];
}>;

export default function DashboardPage() {
  const user = useAuthStore((state) => state.user);
  const isLoading = useAuthStore((state) => state.isLoading);

  if (isLoading) {
    return (
      <main className="flex min-h-[calc(100vh-73px)] items-center justify-center px-5">
        <div aria-label="Loading dashboard" className="h-9 w-9 animate-spin rounded-full border-4 border-slate-200 border-t-lime-600" role="status" />
      </main>
    );
  }

  if (!user) {
    return (
      <main className="mx-auto max-w-3xl px-5 py-16 sm:px-8">
        <section className="rounded-3xl border border-red-200 bg-white p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-red-600">Session unavailable</p>
          <h1 className="mt-3 text-3xl font-semibold text-slate-950">Sign in to open your dashboard</h1>
          <Link className="mt-6 inline-flex rounded-xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white" href="/login?next=%2Fdashboard">
            Sign in
          </Link>
        </section>
      </main>
    );
  }

  const content = roleContent[user.role];

  return (
    <main className="mx-auto max-w-7xl px-5 py-12 sm:px-8">
      <header>
        <p className="text-sm font-semibold uppercase tracking-[0.14em] text-lime-700">{content.eyebrow}</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-slate-950">
          {content.title}, {user.name.split(" ")[0]}
        </h1>
        <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">{content.description}</p>
      </header>
      <section className="mt-10 grid gap-5 lg:grid-cols-3">
        {content.cards.map((card) => (
          <Link className={`rounded-3xl border p-6 transition hover:-translate-y-0.5 hover:shadow-lg ${card.tone === "dark" ? "border-slate-950 bg-slate-950 text-white" : card.tone === "lime" ? "border-lime-200 bg-lime-50 text-lime-950" : "border-slate-200 bg-white text-slate-950"}`} href={card.href} key={card.href}>
            <h2 className="text-xl font-semibold">{card.title}</h2>
            <p className={`mt-3 text-sm leading-6 ${card.tone === "dark" ? "text-slate-300" : card.tone === "lime" ? "text-lime-900" : "text-slate-600"}`}>{card.description}</p>
            <span className="mt-8 inline-flex text-sm font-semibold underline underline-offset-4">{card.action} →</span>
          </Link>
        ))}
      </section>
    </main>
  );
}
