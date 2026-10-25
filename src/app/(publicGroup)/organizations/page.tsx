"use client";

import { listPublicOrganizations, type PublicOrganization } from "../_actions/organization-actions";
import { Search, Building2, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function PublicOrganizationsPage() {
  const [organizations, setOrganizations] = useState<PublicOrganization[]>([]);
  const [search, setSearch] = useState("");
  const [submittedSearch, setSubmittedSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setIsLoading(true);
    setError("");
    listPublicOrganizations(submittedSearch)
      .then((response) => setOrganizations(response.data.organizations))
      .catch((reason) => {
        setError(reason instanceof Error ? reason.message : "Unable to load organizations.");
      })
      .finally(() => setIsLoading(false));
  }, [submittedSearch]);

  return (
    <main className="min-h-screen bg-slate-50 px-5 py-12 sm:px-8 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Link className="text-xl font-bold tracking-[-0.04em] text-slate-950" href="/">
            kajkorbo<span className="text-lime-600">.</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link className="rounded-full px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-white" href="/login">
              Sign in
            </Link>
            <Link className="rounded-full bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-800" href="/register">
              Get started
            </Link>
          </div>
        </div>

        <header className="mt-16 max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-lime-700">
            Public directory
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
            Explore organizations on Kajkorbo.
          </h1>
          <p className="mt-5 text-base leading-7 text-slate-600">
            Discover active organizations using Kajkorbo to coordinate teams and meaningful work.
          </p>
        </header>

        <form
          className="mt-8 flex max-w-2xl gap-3"
          onSubmit={(event) => {
            event.preventDefault();
            setSubmittedSearch(search);
          }}
        >
          <label className="relative flex-1">
            <span className="sr-only">Search organizations</span>
            <Search aria-hidden="true" className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              className="w-full rounded-2xl border border-slate-200 bg-white py-3.5 pl-11 pr-4 text-sm outline-none focus:border-lime-500 focus:ring-4 focus:ring-lime-100"
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by organization name"
              value={search}
            />
          </label>
          <button className="rounded-2xl bg-slate-950 px-5 py-3.5 text-sm font-semibold text-white hover:bg-slate-800" type="submit">
            Search
          </button>
        </form>

        <section className="mt-12" aria-live="polite">
          {error ? (
            <div className="rounded-3xl border border-red-200 bg-red-50 p-6 text-sm text-red-700" role="alert">
              {error}
            </div>
          ) : isLoading ? (
            <div className="rounded-3xl border border-slate-200 bg-white p-8 text-sm text-slate-500">
              Loading organizations...
            </div>
          ) : organizations.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center">
              <Building2 className="mx-auto text-slate-400" size={28} />
              <h2 className="mt-4 text-lg font-semibold text-slate-950">No organizations found</h2>
              <p className="mt-2 text-sm text-slate-500">
                Try a different search or create the first organization.
              </p>
              <Link className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-slate-950 underline" href="/register">
                Create an organization <ArrowRight size={15} />
              </Link>
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {organizations.map((organization) => (
                <article className="rounded-3xl border border-slate-200 bg-white p-6" key={organization.id}>
                  <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-2xl bg-lime-100 text-lg font-bold text-lime-800">
                    {organization.logo ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img alt="" className="h-full w-full object-cover" src={organization.logo} />
                    ) : (
                      organization.name.slice(0, 1).toUpperCase()
                    )}
                  </div>
                  <h2 className="mt-6 text-xl font-semibold text-slate-950">{organization.name}</h2>
                  <p className="mt-3 min-h-12 text-sm leading-6 text-slate-600">
                    {organization.description || "An active organization on Kajkorbo."}
                  </p>
                  <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4 text-xs text-slate-500">
                    <span>{organization.plan} plan</span>
                    <span>Since {new Date(organization.createdAt).getFullYear()}</span>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
