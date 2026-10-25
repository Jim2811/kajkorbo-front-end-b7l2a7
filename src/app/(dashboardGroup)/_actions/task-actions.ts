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
  startAt?: string | null;
  createdAt?: string;
  rejectionReason?: string | null;
};

export type SubtaskStatus =
  | "ASSIGNED"
  | "IN_PROGRESS"
  | "SUBMITTED"
  | "REVISION_REQUIRED"
  | "APPROVED"
  | "CANCELLED";
export type Subtask = {
  id: string;
  taskId: string;
  assignedUserId: string;
  title: string;
  description: string;
  dueAt: string;
  status: SubtaskStatus;
};
export type TaskListFilters = {
  status?: TaskStatus;
  priority?: TaskPriority;
  teamId?: string;
  page: number;
  limit: number;
};
export type TaskListResponse = ApiResponse<{ tasks: TaskListItem[] }> & {
  meta?: { page: number; limit: number; total: number };
};

export async function listTasks(filters: TaskListFilters) {
  const params = new URLSearchParams({ page: String(filters.page), limit: String(filters.limit) });
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
export async function acceptTask(taskId: string) {
  return apiClient<ApiResponse<{ task: TaskListItem }>>(`/tasks/${taskId}/accept`, { method: "POST" });
}
export async function rejectTask(taskId: string, reason: string) {
  return apiClient<ApiResponse<{ task: TaskListItem }>>(`/tasks/${taskId}/reject`, {
    method: "POST",
    body: JSON.stringify({ reason }),
  });
}
export async function completeTask(taskId: string) {
  return apiClient<ApiResponse<{ task: TaskListItem }>>(`/tasks/${taskId}/complete`, { method: "POST" });
}
export async function createSubtask(
  taskId: string,
  input: { assignedUserId: string; title: string; description: string; dueAt: string },
) {
  return apiClient<ApiResponse<{ subtask: Subtask }>>(`/tasks/${taskId}/subtasks`, {
    method: "POST",
    body: JSON.stringify(input),
  });
}
export async function submitSubtask(subtaskId: string, description: string) {
  return apiClient<ApiResponse<{ submission: { id: string; description: string } }>>(
    `/tasks/subtasks/${subtaskId}/submit`,
    { method: "POST", body: JSON.stringify({ description }) },
  );
}
export async function approveSubtask(subtaskId: string, feedback?: string) {
  return apiClient<ApiResponse<{ subtask: Subtask }>>(`/tasks/subtasks/${subtaskId}/approve`, {
    method: "POST",
    body: JSON.stringify({ feedback: feedback || undefined }),
  });
}
export async function requestSubtaskRevision(subtaskId: string, feedback: string) {
  return apiClient<ApiResponse<{ subtask: Subtask }>>(`/tasks/subtasks/${subtaskId}/request-revision`, {
    method: "POST",
    body: JSON.stringify({ feedback }),
  });
}
export async function reassignSubtask(subtaskId: string, assignedUserId: string) {
  return apiClient<ApiResponse<{ subtask: Subtask }>>(`/tasks/subtasks/${subtaskId}/reassign`, {
    method: "POST",
    body: JSON.stringify({ assignedUserId }),
  });
}
