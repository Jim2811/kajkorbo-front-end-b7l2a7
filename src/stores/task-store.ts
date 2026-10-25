"use client";

import type { TaskListItem } from "@/lib/tasks";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type TaskState = {
  tasks: TaskListItem[];
  addTask: (task: TaskListItem) => void;
  updateTask: (task: TaskListItem) => void;
};

export const useTaskStore = create<TaskState>()(
  persist(
    (set) => ({
      tasks: [],
      addTask: (task) => set((state) => ({ tasks: [task, ...state.tasks.filter((item) => item.id !== task.id)] })),
      updateTask: (task) =>
        set((state) => ({
          tasks: state.tasks.map((item) => (item.id === task.id ? task : item)),
        })),
    }),
    {
      name: "kajkorbo-tasks",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
