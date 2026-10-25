"use client";

import type { Organization, Team } from "@/app/(dashboardGroup)/_actions/organization-actions";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type OrganizationState = {
  organization: Organization | null;
  teams: Team[];
  setOrganization: (organization: Organization | null) => void;
  addTeam: (team: Team) => void;
  removeTeam: (teamId: string) => void;
  updateTeam: (team: Team) => void;
};

export const useOrganizationStore = create<OrganizationState>()(
  persist(
    (set) => ({
      organization: null,
      teams: [],
      setOrganization: (organization) => set({ organization }),
      addTeam: (team) => set((state) => ({ teams: [...state.teams, team] })),
      removeTeam: (teamId) => set((state) => ({ teams: state.teams.filter((team) => team.id !== teamId) })),
      updateTeam: (team) =>
        set((state) => ({ teams: state.teams.map((item) => (item.id === team.id ? team : item)) })),
    }),
    {
      name: "kajkorbo-organization",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
