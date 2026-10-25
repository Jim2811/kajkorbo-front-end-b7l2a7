"use client";

import type { Subtask, TaskListItem } from "@/lib/tasks";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type TaskState = {
  tasks: TaskListItem[];
  subtasks: Subtask[];
  addTask: (task: TaskListItem) => void;
  updateTask: (task: TaskListItem) => void;
  setTask: (task: TaskListItem) => void;
  addSubtask: (subtask: Subtask) => void;
  updateSubtask: (subtask: Subtask) => void;
  setSubtask: (subtask: Subtask) => void;
};

export const useTaskStore = create<TaskState>()(
  persist(
    (set) => ({
      tasks: [],
      subtasks: [],
      addTask: (task) => set((state) => ({ tasks: [task, ...state.tasks.filter((item) => item.id !== task.id)] })),
      updateTask: (task) =>
        set((state) => ({
          tasks: state.tasks.map((item) => (item.id === task.id ? task : item)),
        })),
      setTask: (task) =>
        set((state) => ({
          tasks: state.tasks.map((item) => (item.id === task.id ? task : item)),
        })),
      addSubtask: (subtask) =>
        set((state) => ({
          subtasks: [subtask, ...state.subtasks.filter((item) => item.id !== subtask.id)],
        })),
      updateSubtask: (subtask) =>
        set((state) => ({
          subtasks: state.subtasks.map((item) => (item.id === subtask.id ? subtask : item)),
        })),
      setSubtask: (subtask) =>
        set((state) => ({
          subtasks: state.subtasks.map((item) => (item.id === subtask.id ? subtask : item)),
        })),
    }),
    {
      name: "kajkorbo-tasks",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
