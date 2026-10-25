import { apiClient, type ApiResponse } from "@/lib/api-client";

export const taskStatuses = [
  "DRAFT",
  "ASSIGNED",
  "ACCEPTED",
  "IN_PROGRESS",
  "UNDER_REVIEW",
  "COMPLETED",
  "REJECTED",
  "CANCELLED",
] as const;

export const taskPriorities = ["LOW", "MEDIUM", "HIGH", "URGENT"] as const;

export type TaskStatus = (typeof taskStatuses)[number];
export type TaskPriority = (typeof taskPriorities)[number];

export type TaskListItem = {
  id: string;
  title: string;
  description: string;
  priority: TaskPriority;
  status: TaskStatus;
  dueAt: string;
  teamId: string;
};

export type TaskListFilters = {
  status?: TaskStatus;
  priority?: TaskPriority;
  teamId?: string;
  page: number;
  limit: number;
};

export type TaskListResponse = ApiResponse<{ tasks: TaskListItem[] }> & {
  meta?: {
    page: number;
    limit: number;
    total: number;
  };
};

export async function listTasks(filters: TaskListFilters) {
  const params = new URLSearchParams({
    page: String(filters.page),
    limit: String(filters.limit),
  });

  if (filters.status) params.set("status", filters.status);
  if (filters.priority) params.set("priority", filters.priority);
  if (filters.teamId) params.set("teamId", filters.teamId);

  return apiClient<TaskListResponse>(`/tasks?${params.toString()}`);
}

export type CreateTaskInput = {
  teamId: string;
  title: string;
  description: string;
  priority?: TaskPriority;
  startAt?: string;
  dueAt: string;
};

export async function createTask(input: CreateTaskInput) {
  return apiClient<ApiResponse<{ task: TaskListItem }>>("/tasks", {
    method: "POST",
    body: JSON.stringify(input),
  });
}
