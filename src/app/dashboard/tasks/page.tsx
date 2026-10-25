"use client";

import { OrganizationShell } from "@/components/organization/organization-shell";
import { listTasks, taskPriorities, taskStatuses, type TaskPriority, type TaskStatus } from "@/lib/tasks";
import { useOrganizationStore } from "@/stores/organization-store";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight, ListFilter } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Suspense, useMemo } from "react";

const pageSize = 10;

function TasksContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const teams = useOrganizationStore((state) => state.teams);
  const status = searchParams.get("status") as TaskStatus | null;
  const priority = searchParams.get("priority") as TaskPriority | null;
  const teamId = searchParams.get("team") || undefined;
  const pageValue = Number(searchParams.get("page") || "1");
  const page = Number.isInteger(pageValue) && pageValue > 0 ? pageValue : 1;

  const filters = useMemo(
    () => ({
      status: taskStatuses.includes(status as TaskStatus) ? (status as TaskStatus) : undefined,
      priority: taskPriorities.includes(priority as TaskPriority)
        ? (priority as TaskPriority)
        : undefined,
      teamId,
      page,
      limit: pageSize,
    }),
    [page, priority, status, teamId],
  );
  const tasksQuery = useQuery({
    queryKey: ["tasks", filters],
    queryFn: () => listTasks(filters),
    retry: false,
  });
  const total = tasksQuery.data?.meta?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  const updateParams = (updates: Record<string, string | undefined>) => {
    const nextParams = new URLSearchParams(searchParams.toString());
    for (const [key, value] of Object.entries(updates)) {
      if (value) nextParams.set(key, value);
      else nextParams.delete(key);
    }
    if ("status" in updates || "priority" in updates || "team" in updates) {
      nextParams.delete("page");
    }
    router.push(`${pathname}?${nextParams.toString()}`);
  };

  return (
    <OrganizationShell
      description="Track work by status, priority, team, and page."
      title="Tasks"
    >
      <div className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-7">
        <div className="flex flex-wrap items-center gap-3">
          <div className="mr-auto flex items-center gap-2">
            <ListFilter className="text-slate-500" size={18} />
            <p className="text-sm font-semibold text-slate-950">Filter tasks</p>
          </div>
          <select
            aria-label="Filter by status"
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-lime-500"
            onChange={(event) => updateParams({ status: event.target.value || undefined })}
            value={status ?? ""}
          >
            <option value="">All statuses</option>
            {taskStatuses.map((item) => <option key={item} value={item}>{item.replaceAll("_", " ")}</option>)}
          </select>
          <select
            aria-label="Filter by priority"
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-lime-500"
            onChange={(event) => updateParams({ priority: event.target.value || undefined })}
            value={priority ?? ""}
          >
            <option value="">All priorities</option>
            {taskPriorities.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
          <select
            aria-label="Filter by team"
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-lime-500"
            onChange={(event) => updateParams({ team: event.target.value || undefined })}
            value={teamId ?? ""}
          >
            <option value="">All teams</option>
            {teams.map((team) => <option key={team.id} value={team.id}>{team.name}</option>)}
          </select>
          <Link
            className="rounded-xl bg-slate-950 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
            href="/dashboard/tasks/new"
          >
            Create task
          </Link>
        </div>

        {tasksQuery.isPending ? (
          <div className="mt-8 space-y-3" aria-label="Loading tasks" role="status">
            {[1, 2, 3].map((item) => <div className="h-16 animate-pulse rounded-xl bg-slate-100" key={item} />)}
          </div>
        ) : tasksQuery.isError ? (
          <div className="mt-8 rounded-2xl border border-amber-200 bg-amber-50 p-5">
            <h2 className="font-semibold text-amber-950">Task list is not available yet</h2>
            <p className="mt-2 text-sm leading-6 text-amber-900">
              The backend currently exposes task actions but does not expose a GET /tasks list
              endpoint. The filters and pagination are ready and will connect when that endpoint is added.
            </p>
          </div>
        ) : tasksQuery.data?.data.tasks.length ? (
          <div className="mt-6 divide-y divide-slate-100">
            {tasksQuery.data.data.tasks.map((task) => (
              <article className="flex flex-wrap items-center gap-4 py-4" key={task.id}>
                <div className="mr-auto min-w-48">
                  <h2 className="font-semibold text-slate-950">{task.title}</h2>
                  <p className="mt-1 line-clamp-1 text-sm text-slate-500">{task.description}</p>
                </div>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">{task.status.replaceAll("_", " ")}</span>
                <span className="rounded-full bg-lime-100 px-3 py-1 text-xs font-semibold text-lime-800">{task.priority}</span>
                <time className="text-xs text-slate-500" dateTime={task.dueAt}>{new Date(task.dueAt).toLocaleDateString()}</time>
              </article>
            ))}
          </div>
        ) : (
          <div className="mt-8 rounded-2xl border border-dashed border-slate-300 p-8 text-center text-sm text-slate-500">
            No tasks match the selected filters.
          </div>
        )}

        <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-5">
          <p className="text-sm text-slate-500">
            {total ? `Page ${page} of ${totalPages}` : "Pagination will appear when tasks are available"}
          </p>
          <div className="flex gap-2">
            <button
              aria-label="Previous page"
              className="rounded-lg border border-slate-200 p-2 text-slate-600 disabled:cursor-not-allowed disabled:opacity-40"
              disabled={page <= 1}
              onClick={() => updateParams({ page: String(page - 1) })}
              type="button"
            >
              <ChevronLeft size={17} />
            </button>
            <button
              aria-label="Next page"
              className="rounded-lg border border-slate-200 p-2 text-slate-600 disabled:cursor-not-allowed disabled:opacity-40"
              disabled={page >= totalPages || !total}
              onClick={() => updateParams({ page: String(page + 1) })}
              type="button"
            >
              <ChevronRight size={17} />
            </button>
          </div>
        </div>
      </div>
    </OrganizationShell>
  );
}

export default function TasksPage() {
  return (
    <Suspense fallback={<main className="min-h-screen bg-slate-50" />}>
      <TasksContent />
    </Suspense>
  );
}
