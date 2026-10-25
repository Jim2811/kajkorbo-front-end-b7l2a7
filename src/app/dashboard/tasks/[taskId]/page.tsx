"use client";

import { AuthField } from "@/components/auth/auth-field";
import { OrganizationShell } from "@/components/organization/organization-shell";
import { acceptTask, completeTask, rejectTask, type TaskListItem } from "@/lib/tasks";
import { useAuthStore } from "@/stores/auth-store";
import { useTaskStore } from "@/stores/task-store";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const rejectionSchema = z.object({
  reason: z.string().trim().min(1, "A rejection reason is required"),
});

type RejectionForm = z.infer<typeof rejectionSchema>;

const timelineLabels: Record<string, string> = {
  DRAFT: "Task drafted",
  ASSIGNED: "Task assigned to a team",
  ACCEPTED: "Task accepted",
  IN_PROGRESS: "Work started",
  UNDER_REVIEW: "Submitted for review",
  COMPLETED: "Task completed",
  REJECTED: "Task rejected",
  CANCELLED: "Task cancelled",
};

function statusTimeline(task: TaskListItem) {
  const statusOrder = ["DRAFT", "ASSIGNED", "ACCEPTED", "IN_PROGRESS", "UNDER_REVIEW", "COMPLETED"];
  const currentIndex = statusOrder.indexOf(task.status);
  const visibleStatuses = currentIndex >= 0 ? statusOrder.slice(0, currentIndex + 1) : [task.status];
  return visibleStatuses.map((status) => ({
    status,
    label: timelineLabels[status] ?? status.replaceAll("_", " "),
    active: status === task.status,
  }));
}

export default function TaskDetailsPage() {
  const params = useParams<{ taskId: string }>();
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const task = useTaskStore((state) => state.tasks.find((item) => item.id === params.taskId));
  const updateTask = useTaskStore((state) => state.updateTask);
  const [actionError, setActionError] = useState("");
  const [actionLoading, setActionLoading] = useState("");
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } =
    useForm<RejectionForm>({ resolver: zodResolver(rejectionSchema) });

  if (!task) {
    return (
      <OrganizationShell description="Task details cannot be loaded from the current backend contract." title="Task unavailable">
        <div className="rounded-3xl border border-amber-200 bg-amber-50 p-6">
          <h2 className="font-semibold text-amber-950">Task details are unavailable</h2>
          <p className="mt-2 text-sm leading-6 text-amber-900">
            The backend exposes task actions but not a GET /tasks/:taskId endpoint. Open this page
            after creating a task in this browser, or add a task read endpoint to load existing tasks.
          </p>
          <Link className="mt-5 inline-flex rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white" href="/dashboard/tasks">
            Return to tasks
          </Link>
        </div>
      </OrganizationShell>
    );
  }

  const runAction = async (name: string, action: () => Promise<{ data: { task: TaskListItem } }>) => {
    setActionError("");
    setActionLoading(name);
    try {
      const response = await action();
      updateTask(response.data.task);
      reset();
    } catch (error) {
      setActionError(error instanceof Error ? error.message : "Unable to update task.");
    } finally {
      setActionLoading("");
    }
  };

  const canAcceptOrReject =
    user?.role === "SUPER_ADMIN" ||
    user?.role === "ORG_OWNER" ||
    user?.role === "ORG_MEMBER" ||
    user?.role === "TEAM_LEADER" ||
    user?.role === "TEAM_MEMBER";
  const canComplete = user?.role === "ORG_MEMBER" || user?.role === "TEAM_LEADER";

  return (
    <OrganizationShell description="Review the task, take the next action, and follow its delivery history." title={task.title}>
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1.35fr)_minmax(280px,0.65fr)]">
        <div className="space-y-5">
          {actionError ? <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">{actionError}</p> : null}
          <section className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Task details</p>
                <h2 className="mt-2 text-xl font-semibold text-slate-950">{task.title}</h2>
              </div>
              <span className="rounded-full bg-lime-100 px-3 py-1.5 text-xs font-bold text-lime-800">{task.status.replaceAll("_", " ")}</span>
            </div>
            <p className="mt-6 whitespace-pre-wrap text-sm leading-7 text-slate-700">{task.description}</p>
            <dl className="mt-7 grid gap-4 border-t border-slate-100 pt-5 sm:grid-cols-3">
              <div><dt className="text-xs text-slate-500">Priority</dt><dd className="mt-1 font-semibold text-slate-950">{task.priority}</dd></div>
              <div><dt className="text-xs text-slate-500">Team</dt><dd className="mt-1 font-semibold text-slate-950">{task.teamId}</dd></div>
              <div><dt className="text-xs text-slate-500">Due date</dt><dd className="mt-1 font-semibold text-slate-950">{new Date(task.dueAt).toLocaleString()}</dd></div>
            </dl>
            {task.rejectionReason ? <p className="mt-5 rounded-xl bg-red-50 p-3 text-sm text-red-800">Rejection reason: {task.rejectionReason}</p> : null}
          </section>

          {canAcceptOrReject && task.status === "ASSIGNED" ? (
            <section className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8">
              <h2 className="text-lg font-semibold text-slate-950">Review assignment</h2>
              <div className="mt-5 flex flex-wrap gap-3">
                <button className="rounded-xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white disabled:opacity-60" disabled={Boolean(actionLoading)} onClick={() => runAction("accept", () => acceptTask(task.id))} type="button">
                  {actionLoading === "accept" ? "Accepting..." : "Accept task"}
                </button>
              </div>
              <form className="mt-5 space-y-3" onSubmit={handleSubmit((values) => runAction("reject", () => rejectTask(task.id, values.reason)))}>
                <AuthField error={errors.reason?.message} label="Rejection reason" placeholder="Explain what needs to change" {...register("reason")} />
                <button className="rounded-xl border border-red-200 px-4 py-3 text-sm font-semibold text-red-700 disabled:opacity-60" disabled={isSubmitting || Boolean(actionLoading)} type="submit">
                  {actionLoading === "reject" ? "Rejecting..." : "Reject task"}
                </button>
              </form>
            </section>
          ) : null}

          {canComplete && ["ACCEPTED", "IN_PROGRESS"].includes(task.status) ? (
            <section className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8">
              <h2 className="text-lg font-semibold text-slate-950">Complete task</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">Completion is allowed after required subtasks are approved by the backend.</p>
              <button className="mt-5 rounded-xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white disabled:opacity-60" disabled={Boolean(actionLoading)} onClick={() => runAction("complete", () => completeTask(task.id))} type="button">
                {actionLoading === "complete" ? "Completing..." : "Mark as completed"}
              </button>
            </section>
          ) : null}
        </div>

        <aside className="rounded-3xl border border-slate-200 bg-white p-6">
          <h2 className="text-lg font-semibold text-slate-950">Status timeline</h2>
          <div className="mt-6 space-y-5">
            {statusTimeline(task).map((item) => (
              <div className="flex gap-3" key={item.status}>
                <span className={`mt-1 h-3 w-3 shrink-0 rounded-full ${item.active ? "bg-lime-500 ring-4 ring-lime-100" : "bg-slate-300"}`} />
                <div>
                  <p className={`text-sm font-semibold ${item.active ? "text-slate-950" : "text-slate-500"}`}>{item.label}</p>
                  <p className="mt-1 text-xs text-slate-400">{item.status.replaceAll("_", " ")}</p>
                </div>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </OrganizationShell>
  );
}
