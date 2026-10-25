"use client";

import { AuthField } from "@/components/auth/auth-field";
import { OrganizationOwnerGuard } from "@/components/organization/organization-owner-guard";
import { OrganizationShell } from "@/components/organization/organization-shell";
import { createTask, taskPriorities, type TaskPriority } from "@/app/(dashboardGroup)/_actions/task-actions";
import { useOrganizationStore } from "@/stores/organization-store";
import { useTaskStore } from "@/stores/task-store";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const taskSchema = z
  .object({
    teamId: z.string().trim().min(1, "Select a team"),
    title: z.string().trim().min(1, "Task title is required"),
    description: z.string().trim().min(1, "Task description is required"),
    priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]).optional(),
    startAt: z.string().optional(),
    dueAt: z.string().min(1, "Due date is required"),
  })
  .superRefine((values, context) => {
    const dueAt = new Date(values.dueAt);
    if (Number.isNaN(dueAt.getTime())) {
      context.addIssue({ code: "custom", message: "Enter a valid due date", path: ["dueAt"] });
      return;
    }
    if (values.startAt) {
      const startAt = new Date(values.startAt);
      if (Number.isNaN(startAt.getTime())) {
        context.addIssue({ code: "custom", message: "Enter a valid start date", path: ["startAt"] });
      } else if (startAt >= dueAt) {
        context.addIssue({ code: "custom", message: "Start date must be before the due date", path: ["startAt"] });
      }
    }
  });

type TaskForm = z.infer<typeof taskSchema>;

function toIso(value: string) {
  return new Date(value).toISOString();
}

export default function NewTaskPage() {
  const router = useRouter();
  const teams = useOrganizationStore((state) => state.teams);
  const addTask = useTaskStore((state) => state.addTask);
  const [serverError, setServerError] = useState("");
  const [created, setCreated] = useState("");
  const { register, handleSubmit, formState: { errors, isSubmitting } } =
    useForm<TaskForm>({
      resolver: zodResolver(taskSchema),
      defaultValues: { priority: "MEDIUM" },
    });

  const onSubmit = async (values: TaskForm) => {
    setServerError("");
    setCreated("");
    try {
      const response = await createTask({
        teamId: values.teamId,
        title: values.title,
        description: values.description,
        priority: values.priority as TaskPriority | undefined,
        startAt: values.startAt ? toIso(values.startAt) : undefined,
        dueAt: toIso(values.dueAt),
      });
      addTask(response.data.task);
      setCreated(response.data.task.title);
    } catch (error) {
      setServerError(error instanceof Error ? error.message : "Unable to create task.");
    }
  };

  return (
    <OrganizationOwnerGuard>
      <OrganizationShell
        description="Assign work to an active team with a clear priority and due date."
        title="Create task"
      >
        <form
          className="max-w-2xl space-y-5 rounded-3xl border border-slate-200 bg-white p-6 sm:p-8"
          onSubmit={handleSubmit(onSubmit)}
        >
          {serverError ? (
            <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
              {serverError}
            </p>
          ) : null}
          {created ? (
            <div className="rounded-xl border border-lime-200 bg-lime-50 px-4 py-3 text-sm text-lime-900" role="status">
              <p>Task “{created}” was created successfully.</p>
              <Link className="mt-2 inline-block font-semibold underline" href="/dashboard/tasks">
                Return to task list
              </Link>
            </div>
          ) : null}
          {teams.length === 0 ? (
            <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-900">
              Create a team before creating a task.{" "}
              <Link className="font-semibold underline" href="/dashboard/organization/teams">
                Manage teams
              </Link>
            </div>
          ) : null}
          <label className="block">
            <span className="text-sm font-medium text-slate-800">Team</span>
            <select
              className={`mt-2 block w-full rounded-xl border bg-white px-3.5 py-3 text-sm text-slate-950 outline-none focus:border-lime-500 focus:ring-4 focus:ring-lime-100 ${errors.teamId ? "border-red-400" : "border-slate-200"}`}
              {...register("teamId")}
            >
              <option value="">Select a team</option>
              {teams.map((team) => <option key={team.id} value={team.id}>{team.name}</option>)}
            </select>
            {errors.teamId ? <span className="mt-1.5 block text-xs text-red-600">{errors.teamId.message}</span> : null}
          </label>
          <AuthField error={errors.title?.message} label="Task title" placeholder="Prepare client launch plan" {...register("title")} />
          <label className="block">
            <span className="text-sm font-medium text-slate-800">Description</span>
            <textarea
              className={`mt-2 block min-h-28 w-full rounded-xl border px-3.5 py-3 text-sm text-slate-950 outline-none placeholder:text-slate-400 focus:border-lime-500 focus:ring-4 focus:ring-lime-100 ${errors.description ? "border-red-400" : "border-slate-200"}`}
              placeholder="Describe the expected outcome and context."
              {...register("description")}
            />
            {errors.description ? <span className="mt-1.5 block text-xs text-red-600">{errors.description.message}</span> : null}
          </label>
          <label className="block">
            <span className="text-sm font-medium text-slate-800">Priority</span>
            <select className="mt-2 block w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm outline-none focus:border-lime-500 focus:ring-4 focus:ring-lime-100" {...register("priority")}>
              {taskPriorities.map((priority) => <option key={priority} value={priority}>{priority}</option>)}
            </select>
          </label>
          <div className="grid gap-5 sm:grid-cols-2">
            <AuthField error={errors.startAt?.message} label="Start date (optional)" type="datetime-local" {...register("startAt")} />
            <AuthField error={errors.dueAt?.message} label="Due date" type="datetime-local" {...register("dueAt")} />
          </div>
          <button
            className="w-full rounded-xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
            disabled={isSubmitting || teams.length === 0}
            type="submit"
          >
            {isSubmitting ? "Creating task..." : "Create task"}
          </button>
          <button
            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 hover:border-slate-400"
            onClick={() => router.push("/dashboard/tasks")}
            type="button"
          >
            Cancel
          </button>
        </form>
      </OrganizationShell>
    </OrganizationOwnerGuard>
  );
}
