import { SiteNavbar } from "@/components/site-navbar";
import { SiteFooter } from "@/components/site-footer";
import { ArrowRight, CheckCircle2, CircleDashed, Clock3, Plus } from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  return (
    <>
      <SiteNavbar />
      <main className="overflow-hidden bg-slate-50">
        <section className="relative isolate" id="platform">
          <div className="absolute inset-x-0 top-0 -z-10 h-[620px] bg-[radial-gradient(circle_at_80%_10%,#d9f99d,transparent_32%),radial-gradient(circle_at_15%_0%,#e0f2fe,transparent_35%)]" />
          <div className="mx-auto grid max-w-7xl items-center gap-16 px-5 pb-24 pt-20 sm:px-8 lg:grid-cols-[0.95fr_1.05fr] lg:px-10 lg:pb-32 lg:pt-28">
            <div>
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-lime-200 bg-lime-100/80 px-3.5 py-2 text-xs font-bold uppercase tracking-[0.14em] text-lime-900">
                <span className="h-2 w-2 rounded-full bg-lime-600" />
                Work in sync
              </div>
              <h1 className="max-w-2xl text-5xl font-semibold leading-[1.02] tracking-[-0.055em] text-slate-950 sm:text-7xl">
                Turn team effort into{" "}
                <span className="text-lime-600">forward motion.</span>
              </h1>
              <p className="mt-7 max-w-xl text-lg leading-8 text-slate-600">
                Kajkorbo brings your organization, teams, and tasks into one clear
                workspace, so everyone knows what matters and what comes next.
              </p>
              <div className="mt-9 flex flex-wrap items-center gap-4">
                <Link
                  className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-slate-800"
                  href="#get-started"
                >
                  Start your workspace
                  <ArrowRight aria-hidden="true" size={17} />
                </Link>
                <Link
                  className="inline-flex items-center gap-2 rounded-full px-4 py-3.5 text-sm font-semibold text-slate-700 transition hover:bg-white hover:text-slate-950"
                  href="#workflows"
                >
                  See how it works
                  <ArrowRight aria-hidden="true" size={16} />
                </Link>
              </div>
              <div className="mt-9 flex flex-wrap gap-x-6 gap-y-3 text-sm text-slate-500">
                <span className="inline-flex items-center gap-2">
                  <CheckCircle2 className="text-lime-600" size={16} />
                  Built for real teams
                </span>
                <span className="inline-flex items-center gap-2">
                  <CheckCircle2 className="text-lime-600" size={16} />
                  Clear ownership
                </span>
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-2xl lg:ml-auto">
              <div className="absolute -right-5 -top-8 h-28 w-28 rounded-full bg-lime-300/70 blur-2xl" />
              <div className="absolute -bottom-8 -left-8 h-32 w-32 rounded-full bg-sky-200/70 blur-2xl" />
              <div className="relative rounded-[2rem] border border-slate-200 bg-white p-3 shadow-2xl shadow-slate-300/50">
                <div className="overflow-hidden rounded-[1.35rem] border border-slate-200 bg-slate-50">
                  <div className="flex items-center justify-between border-b border-slate-200 bg-white px-5 py-4">
                    <div>
                      <p className="text-xs font-medium text-slate-500">Monday, October 26</p>
                      <p className="mt-1 text-lg font-semibold text-slate-950">Team workspace</p>
                    </div>
                    <div className="flex -space-x-2">
                      {["AM", "RK", "NS"].map((initials, index) => (
                        <span
                          className={`flex h-8 w-8 items-center justify-center rounded-full border-2 border-white text-[10px] font-bold ${
                            index === 0
                              ? "bg-sky-200 text-sky-900"
                              : index === 1
                                ? "bg-lime-200 text-lime-900"
                                : "bg-amber-200 text-amber-900"
                          }`}
                          key={initials}
                        >
                          {initials}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="grid gap-3 p-4 sm:grid-cols-3">
                    <div className="rounded-xl bg-slate-950 p-4 text-white sm:col-span-2">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-xs text-slate-400">Current focus</p>
                          <p className="mt-2 text-base font-semibold">Client portal launch</p>
                        </div>
                        <span className="rounded-full bg-lime-300 px-2 py-1 text-[10px] font-bold text-lime-950">
                          ON TRACK
                        </span>
                      </div>
                      <div className="mt-7 flex items-end justify-between">
                        <div className="h-2 w-2/3 rounded-full bg-slate-700">
                          <div className="h-2 w-3/4 rounded-full bg-lime-300" />
                        </div>
                        <span className="text-xs font-medium text-slate-300">75%</span>
                      </div>
                    </div>
                    <div className="rounded-xl border border-slate-200 bg-white p-4">
                      <CircleDashed className="text-sky-600" size={20} />
                      <p className="mt-5 text-2xl font-semibold text-slate-950">18</p>
                      <p className="mt-1 text-xs text-slate-500">Active tasks</p>
                    </div>
                    <div className="rounded-xl border border-slate-200 bg-white p-4 sm:col-span-3">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-semibold text-slate-950">Today&apos;s priorities</p>
                        <button
                          aria-label="Add priority"
                          className="rounded-lg bg-slate-100 p-1.5 text-slate-600"
                          type="button"
                        >
                          <Plus size={15} />
                        </button>
                      </div>
                      <div className="mt-4 space-y-3">
                        <div className="flex items-center gap-3">
                          <CheckCircle2 className="text-lime-600" size={18} />
                          <span className="text-sm text-slate-700">Finalize onboarding flow</span>
                          <span className="ml-auto text-xs text-slate-400">Done</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <Clock3 className="text-amber-500" size={18} />
                          <span className="text-sm text-slate-700">Review mobile experience</span>
                          <span className="ml-auto text-xs text-slate-400">Today</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <CircleDashed className="text-sky-500" size={18} />
                          <span className="text-sm text-slate-700">Share release notes</span>
                          <span className="ml-auto text-xs text-slate-400">Tomorrow</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-6 -right-4 hidden rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-xl sm:block">
                <p className="text-xs text-slate-500">Team momentum</p>
                <p className="mt-1 text-lg font-semibold text-slate-950">+24% this week</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
