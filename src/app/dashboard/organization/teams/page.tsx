"use client";

import { AuthField } from "@/components/auth/auth-field";
import { OrganizationShell } from "@/components/organization/organization-shell";
import { addTeamMember, assignTeamLeader, createTeam, deleteTeam, removeTeamMember } from "@/lib/organization";
import { useOrganizationStore } from "@/stores/organization-store";
import { zodResolver } from "@hookform/resolvers/zod";
import { Trash2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const teamSchema = z.object({
  name: z.string().trim().min(1, "Team name is required"),
  description: z.string().trim().optional(),
});

type TeamForm = z.infer<typeof teamSchema>;

export default function OrganizationTeamsPage() {
  const organization = useOrganizationStore((state) => state.organization);
  const teams = useOrganizationStore((state) => state.teams);
  const addTeam = useOrganizationStore((state) => state.addTeam);
  const removeTeam = useOrganizationStore((state) => state.removeTeam);
  const updateTeam = useOrganizationStore((state) => state.updateTeam);
  const [serverError, setServerError] = useState("");
  const [memberInputs, setMemberInputs] = useState<Record<string, string>>({});
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } =
    useForm<TeamForm>({ resolver: zodResolver(teamSchema) });

  if (!organization) {
    return (
      <OrganizationShell description="Connect an organization first." title="Teams">
        <p className="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-900">
          Organization context is unavailable in this browser session.
        </p>
      </OrganizationShell>
    );
  }

  const onCreate = async (values: TeamForm) => {
    setServerError("");
    try {
      const response = await createTeam(organization.id, {
        name: values.name,
        description: values.description || undefined,
      });
      addTeam(response.data.team);
      reset();
    } catch (error) {
      setServerError(error instanceof Error ? error.message : "Unable to create team.");
    }
  };

  const onDelete = async (teamId: string) => {
    setServerError("");
    try {
      await deleteTeam(teamId);
      removeTeam(teamId);
    } catch (error) {
      setServerError(error instanceof Error ? error.message : "Unable to delete team.");
    }
  };

  const onAddMember = async (teamId: string) => {
    const userId = memberInputs[teamId]?.trim();
    if (!userId) return;
    try {
      await addTeamMember(teamId, userId);
      setMemberInputs((current) => ({ ...current, [teamId]: "" }));
    } catch (error) {
      setServerError(error instanceof Error ? error.message : "Unable to add team member.");
    }
  };

  const onRemoveMember = async (teamId: string) => {
    const userId = memberInputs[teamId]?.trim();
    if (!userId) return;
    try {
      await removeTeamMember(teamId, userId);
      setMemberInputs((current) => ({ ...current, [teamId]: "" }));
    } catch (error) {
      setServerError(error instanceof Error ? error.message : "Unable to remove team member.");
    }
  };

  const onAssignLeader = async (teamId: string) => {
    const userId = memberInputs[teamId]?.trim();
    if (!userId) return;
    try {
      const response = await assignTeamLeader(teamId, userId);
      updateTeam(response.data.team);
      setMemberInputs((current) => ({ ...current, [teamId]: "" }));
    } catch (error) {
      setServerError(error instanceof Error ? error.message : "Unable to assign team leader.");
    }
  };

  return (
    <OrganizationShell description="Create teams and manage their membership." title="Teams">
      <div className="grid gap-8 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
        <form className="h-fit space-y-5 rounded-3xl border border-slate-200 bg-white p-6 sm:p-8" onSubmit={handleSubmit(onCreate)}>
          <div>
            <h2 className="text-lg font-semibold text-slate-950">Create a team</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">Start with a clear name and purpose.</p>
          </div>
          {serverError ? <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">{serverError}</p> : null}
          <AuthField error={errors.name?.message} label="Team name" placeholder="Product design" {...register("name")} />
          <label className="block text-sm font-medium text-slate-800">
            Description
            <textarea className="mt-2 block min-h-24 w-full rounded-xl border border-slate-200 px-3.5 py-3 text-sm outline-none focus:border-lime-500 focus:ring-4 focus:ring-lime-100" placeholder="What does this team own?" {...register("description")} />
          </label>
          <button className="w-full rounded-xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white disabled:opacity-60" disabled={isSubmitting} type="submit">
            {isSubmitting ? "Creating..." : "Create team"}
          </button>
        </form>
        <div className="space-y-4">
          {teams.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500">
              No teams created yet.
            </div>
          ) : teams.map((team) => (
            <article className="rounded-3xl border border-slate-200 bg-white p-6" key={team.id}>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-lg font-semibold text-slate-950">{team.name}</h2>
                  <p className="mt-1 text-sm text-slate-600">{team.description || "No description provided."}</p>
                </div>
                <button aria-label={`Delete ${team.name}`} className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-600" onClick={() => onDelete(team.id)} type="button">
                  <Trash2 size={17} />
                </button>
              </div>
              <div className="mt-5 border-t border-slate-100 pt-5">
                <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Team member user ID
                  <input className="mt-2 block w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-lime-500 focus:ring-4 focus:ring-lime-100" placeholder="Paste a user ID" value={memberInputs[team.id] ?? ""} onChange={(event) => setMemberInputs((current) => ({ ...current, [team.id]: event.target.value }))} />
                </label>
                <div className="mt-3 flex flex-wrap gap-2">
                  <button className="rounded-lg bg-slate-950 px-3 py-2 text-xs font-semibold text-white" onClick={() => onAddMember(team.id)} type="button">Add member</button>
                  <button className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700" onClick={() => onAssignLeader(team.id)} type="button">Assign leader</button>
                  <button className="rounded-lg border border-red-200 px-3 py-2 text-xs font-semibold text-red-700" onClick={() => onRemoveMember(team.id)} type="button">Remove member</button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </OrganizationShell>
  );
}
