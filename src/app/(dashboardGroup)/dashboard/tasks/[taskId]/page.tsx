"use client";

import { AuthField } from "@/components/auth/auth-field";
import { OrganizationShell } from "@/components/organization/organization-shell";
import {
  acceptTask,
  approveSubtask,
  completeTask,
  createSubtask,
  rejectTask,
  reassignSubtask,
  requestSubtaskRevision,
  submitSubtask,
  type Subtask,
  type TaskListItem,
} from "@/app/(dashboardGroup)/_actions/task-actions";
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
const subtaskSchema = z.object({
  assignedUserId: z.string().trim().min(1, "Assigned user ID is required"),
  title: z.string().trim().min(1, "Subtask title is required"),
  description: z.string().trim().min(1, "Subtask description is required"),
  dueAt: z.string().min(1, "Due date is required"),
});
const textSchema = z.object({ text: z.string().trim().min(1, "This field is required") });
const reassignSchema = z.object({ assignedUserId: z.string().trim().min(1, "User ID is required") });

type RejectionForm = z.infer<typeof rejectionSchema>;
type SubtaskForm = z.infer<typeof subtaskSchema>;
type TextForm = z.infer<typeof textSchema>;
type ReassignForm = z.infer<typeof reassignSchema>;

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

type SubtaskActionResponse = {
  data: {
    subtask?: Subtask;
    submission?: { id: string; description: string };
  };
};

function SubtaskCard({
  subtask,
  canReview,
  currentUserId,
  onAction,
  submissionForm,
  reviewForm,
  reassignForm,
  actionLoading,
}: {
  subtask: Subtask;
  canReview: boolean;
  currentUserId?: string;
  onAction: (
    name: string,
    action: () => Promise<SubtaskActionResponse>,
    optimisticSubtask?: Subtask,
  ) => Promise<void>;
  submissionForm: ReturnType<typeof useForm<TextForm>>;
  reviewForm: ReturnType<typeof useForm<TextForm>>;
  reassignForm: ReturnType<typeof useForm<ReassignForm>>;
  actionLoading: string;
}) {
  const isAssignee = currentUserId === subtask.assignedUserId;
  const canSubmit = isAssignee && ["ASSIGNED", "IN_PROGRESS", "REVISION_REQUIRED"].includes(subtask.status);
  const canReassign = canReview && !["APPROVED", "CANCELLED"].includes(subtask.status);
  const canReviewSubmission = canReview && subtask.status === "SUBMITTED";

  return (
    <article className="rounded-2xl border border-slate-200 p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="font-semibold text-slate-950">{subtask.title}</h3>
          <p className="mt-1 text-sm leading-6 text-slate-600">{subtask.description}</p>
          <p className="mt-2 text-xs text-slate-500">
            Assigned user: {subtask.assignedUserId} · Due {new Date(subtask.dueAt).toLocaleString()}
          </p>
        </div>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
          {subtask.status.replaceAll("_", " ")}
        </span>
      </div>

      {canSubmit ? (
        <form
          className="mt-4 space-y-3 border-t border-slate-100 pt-4"
          onSubmit={submissionForm.handleSubmit((values) =>
            onAction(`submit-${subtask.id}`, async () => {
              const response = await submitSubtask(subtask.id, values.text);
              return {
                data: {
                  submission: response.data.submission,
                  subtask: { ...subtask, status: "SUBMITTED" },
                },
              };
            }, { ...subtask, status: "SUBMITTED" }),
          )}
        >
          <label className="block text-sm font-medium text-slate-800">
            Submission description
            <textarea
              className="mt-2 block min-h-20 w-full rounded-xl border border-slate-200 px-3 py-3 text-sm outline-none focus:border-lime-500 focus:ring-4 focus:ring-lime-100"
              placeholder="Describe what was delivered."
              {...submissionForm.register("text")}
            />
          </label>
          {submissionForm.formState.errors.text ? (
            <p className="text-xs text-red-600">{submissionForm.formState.errors.text.message}</p>
          ) : null}
          <button
            className="rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
            disabled={Boolean(actionLoading)}
            type="submit"
          >
            {actionLoading === `submit-${subtask.id}` ? "Submitting..." : "Submit subtask"}
          </button>
        </form>
      ) : null}

      {canReviewSubmission ? (
        <div className="mt-4 space-y-3 border-t border-slate-100 pt-4">
          <p className="text-sm font-semibold text-slate-950">Review submission</p>
          <form
            className="space-y-3"
            onSubmit={reviewForm.handleSubmit((values) =>
              onAction(`approve-${subtask.id}`, () => approveSubtask(subtask.id, values.text), { ...subtask, status: "APPROVED" }),
            )}
          >
            <input
              className="block w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-lime-500"
              placeholder="Approval feedback (optional)"
              {...reviewForm.register("text")}
            />
            <button
              className="rounded-xl bg-lime-600 px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
              disabled={Boolean(actionLoading)}
              type="submit"
            >
              {actionLoading === `approve-${subtask.id}` ? "Approving..." : "Approve"}
            </button>
          </form>
          <form
            className="space-y-3"
            onSubmit={reviewForm.handleSubmit((values) =>
              onAction(`revision-${subtask.id}`, () => requestSubtaskRevision(subtask.id, values.text), { ...subtask, status: "REVISION_REQUIRED" }),
            )}
          >
            <input
              className="block w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-lime-500"
              placeholder="Required revision feedback"
              {...reviewForm.register("text")}
            />
            <button
              className="rounded-xl border border-amber-300 px-4 py-2.5 text-sm font-semibold text-amber-800 disabled:opacity-60"
              disabled={Boolean(actionLoading)}
              type="submit"
            >
              {actionLoading === `revision-${subtask.id}` ? "Requesting..." : "Request revision"}
            </button>
          </form>
        </div>
      ) : null}

      {canReassign ? (
        <form
          className="mt-4 flex flex-wrap gap-2 border-t border-slate-100 pt-4"
          onSubmit={reassignForm.handleSubmit((values) =>
            onAction(`reassign-${subtask.id}`, () => reassignSubtask(subtask.id, values.assignedUserId), { ...subtask, assignedUserId: values.assignedUserId }),
          )}
        >
          <input
            className="min-w-0 flex-1 rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-lime-500"
            placeholder="New assignee user ID"
            {...reassignForm.register("assignedUserId")}
          />
          <button
            className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 disabled:opacity-60"
            disabled={Boolean(actionLoading)}
            type="submit"
          >
            {actionLoading === `reassign-${subtask.id}` ? "Reassigning..." : "Reassign"}
          </button>
          {reassignForm.formState.errors.assignedUserId ? (
            <p className="w-full text-xs text-red-600">{reassignForm.formState.errors.assignedUserId.message}</p>
          ) : null}
        </form>
      ) : null}
    </article>
  );
}

export default function TaskDetailsPage() {
  const params = useParams<{ taskId: string }>();
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const task = useTaskStore((state) => state.tasks.find((item) => item.id === params.taskId));
  const subtasks = useTaskStore((state) => state.subtasks.filter((item) => item.taskId === params.taskId));
  const updateTask = useTaskStore((state) => state.updateTask);
  const setTask = useTaskStore((state) => state.setTask);
  const addSubtask = useTaskStore((state) => state.addSubtask);
  const updateSubtask = useTaskStore((state) => state.updateSubtask);
  const setSubtask = useTaskStore((state) => state.setSubtask);
  const [actionError, setActionError] = useState("");
  const [actionLoading, setActionLoading] = useState("");
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } =
    useForm<RejectionForm>({ resolver: zodResolver(rejectionSchema) });
  const subtaskForm = useForm<SubtaskForm>({ resolver: zodResolver(subtaskSchema) });
  const submissionForm = useForm<TextForm>({ resolver: zodResolver(textSchema) });
  const reviewForm = useForm<TextForm>({ resolver: zodResolver(textSchema) });
  const reassignForm = useForm<ReassignForm>({ resolver: zodResolver(reassignSchema) });

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

  const runAction = async (
    name: string,
    action: () => Promise<{ data: { task: TaskListItem } }>,
    optimisticTask?: TaskListItem,
  ) => {
    setActionError("");
    setActionLoading(name);
    const previousTask = task;
    if (optimisticTask) setTask(optimisticTask);
    try {
      const response = await action();
      updateTask(response.data.task);
      reset();
    } catch (error) {
      if (optimisticTask) setTask(previousTask);
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
  const canAssign = user?.role === "TEAM_LEADER";
  const canReview = user?.role === "ORG_MEMBER" || user?.role === "TEAM_LEADER";

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
                <button className="rounded-xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white disabled:opacity-60" disabled={Boolean(actionLoading)} onClick={() => runAction("accept", () => acceptTask(task.id), { ...task, status: "ACCEPTED", rejectionReason: null })} type="button">
                  {actionLoading === "accept" ? "Accepting..." : "Accept task"}
                </button>
              </div>
              <form className="mt-5 space-y-3" onSubmit={handleSubmit((values) => runAction("reject", () => rejectTask(task.id, values.reason), { ...task, status: "REJECTED", rejectionReason: values.reason }))}>
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
              <button className="mt-5 rounded-xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white disabled:opacity-60" disabled={Boolean(actionLoading)} onClick={() => runAction("complete", () => completeTask(task.id), { ...task, status: "COMPLETED" })} type="button">
                {actionLoading === "complete" ? "Completing..." : "Mark as completed"}
              </button>
            </section>
          ) : null}

          {canAssign && ["ACCEPTED", "IN_PROGRESS"].includes(task.status) ? (
            <section className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8">
              <h2 className="text-lg font-semibold text-slate-950">Assign a subtask</h2>
              <form className="mt-5 space-y-4" onSubmit={subtaskForm.handleSubmit(async (values) => {
                await runAction("assign-subtask", async () => {
                  const response = await createSubtask(task.id, {
                    ...values,
                    dueAt: new Date(values.dueAt).toISOString(),
                  });
                  addSubtask(response.data.subtask);
                  return { data: { task } };
                });
                subtaskForm.reset();
              })}>
                <AuthField error={subtaskForm.formState.errors.assignedUserId?.message} label="Assigned user ID" placeholder="User ID" {...subtaskForm.register("assignedUserId")} />
                <AuthField error={subtaskForm.formState.errors.title?.message} label="Subtask title" placeholder="Prepare the first draft" {...subtaskForm.register("title")} />
                <label className="block text-sm font-medium text-slate-800">Description<textarea className="mt-2 block min-h-20 w-full rounded-xl border border-slate-200 px-3 py-3 text-sm" {...subtaskForm.register("description")} /></label>
                <AuthField error={subtaskForm.formState.errors.dueAt?.message} label="Due date" type="datetime-local" {...subtaskForm.register("dueAt")} />
                <button className="rounded-xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white disabled:opacity-60" disabled={Boolean(actionLoading)} type="submit">{actionLoading === "assign-subtask" ? "Assigning..." : "Assign subtask"}</button>
              </form>
            </section>
          ) : null}

          <section className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8">
            <h2 className="text-lg font-semibold text-slate-950">Subtasks</h2>
            {subtasks.length === 0 ? <p className="mt-3 text-sm text-slate-500">No subtasks are available in this browser session.</p> : null}
            <div className="mt-5 space-y-4">
              {subtasks.map((subtask) => (
                <SubtaskCard
                  key={subtask.id}
                  subtask={subtask}
                  canReview={canReview}
                  currentUserId={user?.id}
                  onAction={async (name, action, optimisticSubtask) => {
                    setActionLoading(name);
                    setActionError("");
                    const previousSubtask = subtask;
                    if (optimisticSubtask) setSubtask(optimisticSubtask);
                    try {
                      const response = await action();
                      if (response.data.subtask) updateSubtask(response.data.subtask);
                    } catch (error) {
                      if (optimisticSubtask) setSubtask(previousSubtask);
                      setActionError(error instanceof Error ? error.message : "Unable to update subtask.");
                    } finally {
                      setActionLoading("");
                    }
                  }}
                  submissionForm={submissionForm}
                  reviewForm={reviewForm}
                  reassignForm={reassignForm}
                  actionLoading={actionLoading}
                />
              ))}
            </div>
          </section>
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
