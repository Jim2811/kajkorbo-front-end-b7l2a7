"use client";

import type { Organization } from "@/lib/organization";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type OrganizationState = {
  organization: Organization | null;
  setOrganization: (organization: Organization | null) => void;
};

export const useOrganizationStore = create<OrganizationState>()(
  persist(
    (set) => ({
      organization: null,
      setOrganization: (organization) => set({ organization }),
    }),
    {
      name: "kajkorbo-organization",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
