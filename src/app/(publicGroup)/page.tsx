import { SiteFooter } from "@/components/shared/site-footer";
import { SiteNavbar } from "@/components/shared/site-navbar";
import {
  ArrowRight,
  BarChart3,
  Check,
  CheckCircle2,
  CircleDashed,
  Clock3,
  Flag,
  Layers3,
  MessageSquareWarning,
  Plus,
  ShieldCheck,
  Sparkles,
  Users,
  Zap,
} from "lucide-react";
import Link from "next/link";

const workflowSteps = [
  {
    number: "01",
    title: "Set up your organization",
    description: "Create a workspace with clear ownership, shared context, and the right team structure.",
    icon: Layers3,
  },
  {
    number: "02",
    title: "Turn plans into tasks",
    description: "Assign focused work, set priorities and due dates, then keep every handoff visible.",
    icon: Flag,
  },
  {
    number: "03",
    title: "Deliver with confidence",
    description: "Track progress, manage subtasks, resolve blockers, and close the loop with your team.",
    icon: Zap,
  },
];

const capabilities = [
  {
    eyebrow: "One clear workspace",
    title: "Give every team a shared direction.",
    description: "Keep organization context, teams, tasks, and accountability connected instead of scattered across disconnected tools.",
    icon: Layers3,
    points: ["Organization and team structure", "Role-aware workspace access", "A single source of truth"],
  },
  {
    eyebrow: "Work that moves",
    title: "Make ownership impossible to miss.",
    description: "From the first assignment to final approval, Kajkorbo makes the next action and responsible person clear.",
    icon: CheckCircle2,
    points: ["Priority and status tracking", "Subtask assignment and review", "Status timelines and due dates"],
  },
  {
    eyebrow: "Built for responsible teams",
    title: "Handle issues before they become friction.",
    description: "Give people a clear way to raise complaints, record decisions, and keep moderation history audit-friendly.",
    icon: ShieldCheck,
    points: ["Complaint filing and resolution", "Owner and admin safeguards", "Explicit error and access states"],
  },
];

const roleCards = [
  {
    role: "Organization owners",
    title: "Run the whole operation.",
    description: "Manage members, teams, tasks, capacity, payments, and workspace settings from one control point.",
    href: "/register",
    tone: "dark",
  },
  {
    role: "Team leaders",
    title: "Keep delivery moving.",
    description: "Coordinate assignments, subtasks, approvals, revisions, and the work your team owns.",
    href: "/register",
    tone: "lime",
  },
  {
    role: "Team members",
    title: "Know what matters next.",
    description: "Focus on assigned work, submit progress, and raise concerns without losing context.",
    href: "/register",
    tone: "light",
  },
];

function ProductPreview() {
  return (
    <div className="relative mx-auto w-full max-w-2xl">
      <div className="absolute -right-8 -top-10 h-36 w-36 rounded-full bg-lime-300/70 blur-3xl" />
      <div className="absolute -bottom-10 -left-8 h-40 w-40 rounded-full bg-sky-200/70 blur-3xl" />
      <div className="relative rounded-[2rem] border border-slate-200 bg-white p-3 shadow-2xl shadow-slate-300/50">
        <div className="overflow-hidden rounded-[1.35rem] border border-slate-200 bg-slate-50">
          <div className="flex items-center justify-between border-b border-slate-200 bg-white px-5 py-4">
            <div>
              <p className="text-xs font-medium text-slate-500">Monday, October 26</p>
              <p className="mt-1 text-lg font-semibold text-slate-950">Team workspace</p>
            </div>
            <div className="flex -space-x-2">
              {["AM", "RK", "NS"].map((initials, index) => (
                <span className={`flex h-8 w-8 items-center justify-center rounded-full border-2 border-white text-[10px] font-bold ${index === 0 ? "bg-sky-200 text-sky-900" : index === 1 ? "bg-lime-200 text-lime-900" : "bg-amber-200 text-amber-900"}`} key={initials}>
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
                <span className="rounded-full bg-lime-300 px-2 py-1 text-[10px] font-bold text-lime-950">ON TRACK</span>
              </div>
              <div className="mt-7 flex items-end justify-between">
                <div className="h-2 w-2/3 rounded-full bg-slate-700"><div className="h-2 w-3/4 rounded-full bg-lime-300" /></div>
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
                <button aria-label="Add priority" className="rounded-lg bg-slate-100 p-1.5 text-slate-600" type="button"><Plus size={15} /></button>
              </div>
              <div className="mt-4 space-y-3">
                <div className="flex items-center gap-3"><CheckCircle2 className="text-lime-600" size={18} /><span className="text-sm text-slate-700">Finalize onboarding flow</span><span className="ml-auto text-xs text-slate-400">Done</span></div>
                <div className="flex items-center gap-3"><Clock3 className="text-amber-500" size={18} /><span className="text-sm text-slate-700">Review mobile experience</span><span className="ml-auto text-xs text-slate-400">Today</span></div>
                <div className="flex items-center gap-3"><CircleDashed className="text-sky-500" size={18} /><span className="text-sm text-slate-700">Share release notes</span><span className="ml-auto text-xs text-slate-400">Tomorrow</span></div>
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
  );
}

export default function HomePage() {
  return (
    <>
      <SiteNavbar />
      <main className="overflow-hidden bg-slate-50">
        <section className="relative isolate" id="platform">
          <div className="absolute inset-x-0 top-0 -z-10 h-[720px] bg-[radial-gradient(circle_at_80%_10%,#d9f99d,transparent_32%),radial-gradient(circle_at_15%_0%,#e0f2fe,transparent_35%)]" />
          <div className="mx-auto grid max-w-7xl items-center gap-16 px-5 pb-28 pt-20 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:px-10 lg:pb-36 lg:pt-28">
            <div>
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-lime-200 bg-lime-100/80 px-3.5 py-2 text-xs font-bold uppercase tracking-[0.14em] text-lime-900"><Sparkles className="text-lime-700" size={14} /> Work in sync</div>
              <h1 className="max-w-2xl text-5xl font-semibold leading-[1.02] tracking-[-0.055em] text-slate-950 sm:text-7xl">Turn team effort into <span className="text-lime-600">forward motion.</span></h1>
              <p className="mt-7 max-w-xl text-lg leading-8 text-slate-600">Kajkorbo brings your organization, teams, tasks, and accountability into one clear workspace, so everyone knows what matters and what comes next.</p>
              <div className="mt-9 flex flex-wrap items-center gap-4">
                <Link className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-slate-800" href="/register">Start your workspace <ArrowRight size={17} /></Link>
                <Link className="inline-flex items-center gap-2 rounded-full px-4 py-3.5 text-sm font-semibold text-slate-700 transition hover:bg-white hover:text-slate-950" href="#workflows">See how it works <ArrowRight size={16} /></Link>
              </div>
              <div className="mt-9 flex flex-wrap gap-x-6 gap-y-3 text-sm text-slate-500"><span className="inline-flex items-center gap-2"><CheckCircle2 className="text-lime-600" size={16} /> Built for real teams</span><span className="inline-flex items-center gap-2"><CheckCircle2 className="text-lime-600" size={16} /> Clear ownership</span><span className="inline-flex items-center gap-2"><CheckCircle2 className="text-lime-600" size={16} /> Secure by design</span></div>
            </div>
            <ProductPreview />
          </div>
        </section>

        <section className="border-y border-slate-200 bg-white" id="workflows">
          <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:px-10">
            <div className="max-w-2xl"><p className="text-sm font-semibold uppercase tracking-[0.14em] text-lime-700">A calmer way to work</p><h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 sm:text-5xl">From scattered updates to a shared operating rhythm.</h2><p className="mt-5 text-base leading-7 text-slate-600">The best workspaces make progress visible without adding more process. Kajkorbo keeps the path from intention to completion simple.</p></div>
            <div className="mt-14 grid gap-8 md:grid-cols-3">
              {workflowSteps.map((step) => <article className="relative border-t-2 border-slate-200 pt-6" key={step.number}><div className="flex items-center justify-between"><span className="text-sm font-bold text-lime-600">{step.number}</span><step.icon className="text-slate-400" size={22} /></div><h3 className="mt-8 text-xl font-semibold text-slate-950">{step.title}</h3><p className="mt-3 text-sm leading-6 text-slate-600">{step.description}</p></article>)}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-5 py-24 sm:px-8 lg:px-10" id="teams">
          <div className="grid gap-14 lg:grid-cols-[0.75fr_1.25fr] lg:items-end"><div><p className="text-sm font-semibold uppercase tracking-[0.14em] text-lime-700">Everything connected</p><h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 sm:text-5xl">The structure your work has been missing.</h2><p className="mt-5 text-base leading-7 text-slate-600">Kajkorbo gives every layer of your organization a useful place to work, without losing the context between them.</p><Link className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-slate-950 underline underline-offset-4" href="/register">Build your workspace <ArrowRight size={16} /></Link></div><div className="grid gap-4 sm:grid-cols-3">{capabilities.map((item) => <article className="rounded-3xl border border-slate-200 bg-white p-6" key={item.title}><item.icon className="text-lime-600" size={24} /><p className="mt-8 text-xs font-bold uppercase tracking-[0.12em] text-slate-500">{item.eyebrow}</p><h3 className="mt-3 text-xl font-semibold tracking-tight text-slate-950">{item.title}</h3><p className="mt-3 text-sm leading-6 text-slate-600">{item.description}</p><ul className="mt-6 space-y-3 border-t border-slate-100 pt-5">{item.points.map((point) => <li className="flex gap-2 text-xs font-medium text-slate-600" key={point}><Check className="shrink-0 text-lime-600" size={15} />{point}</li>)}</ul></article>)}</div></div>
        </section>

        <section className="bg-slate-950 text-white" id="about">
          <div className="mx-auto max-w-7xl px-5 py-24 sm:px-8 lg:px-10">
            <div className="flex flex-col justify-between gap-8 border-b border-white/10 pb-12 lg:flex-row lg:items-end"><div className="max-w-2xl"><p className="text-sm font-semibold uppercase tracking-[0.14em] text-lime-300">Made for every role</p><h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-5xl">One workspace. Different ways to make progress.</h2></div><p className="max-w-sm text-sm leading-6 text-slate-400">The right view for each person, with the shared context your organization needs to move together.</p></div>
            <div className="mt-12 grid gap-4 lg:grid-cols-3">{roleCards.map((card) => <Link className={`group rounded-3xl border p-7 transition hover:-translate-y-1 ${card.tone === "dark" ? "border-white/10 bg-white/5" : card.tone === "lime" ? "border-lime-300 bg-lime-300 text-slate-950" : "border-white/10 bg-slate-900"}`} href={card.href} key={card.role}><div className="flex items-center justify-between"><Users size={22} /><ArrowRight className="transition-transform group-hover:translate-x-1" size={18} /></div><p className={`mt-14 text-xs font-bold uppercase tracking-[0.12em] ${card.tone === "lime" ? "text-lime-950/70" : "text-slate-400"}`}>{card.role}</p><h3 className="mt-3 text-2xl font-semibold">{card.title}</h3><p className={`mt-3 text-sm leading-6 ${card.tone === "lime" ? "text-lime-950/75" : "text-slate-400"}`}>{card.description}</p></Link>)}</div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-5 py-24 sm:px-8 lg:px-10" id="pricing">
          <div className="grid gap-8 lg:grid-cols-[1fr_0.8fr] lg:items-center"><div><p className="text-sm font-semibold uppercase tracking-[0.14em] text-lime-700">Capacity that grows with you</p><h2 className="mt-3 max-w-2xl text-3xl font-semibold tracking-tight text-slate-950 sm:text-5xl">Start focused. Scale when the work demands it.</h2><p className="mt-5 max-w-xl text-base leading-7 text-slate-600">Begin with a clear workspace and free team capacity. When your organization grows, add capacity through secure Stripe checkout and keep delivery moving.</p><div className="mt-8 grid gap-3 sm:grid-cols-2"><div className="rounded-2xl border border-slate-200 bg-white p-5"><BarChart3 className="text-lime-600" size={22} /><p className="mt-5 font-semibold text-slate-950">See your usage</p><p className="mt-2 text-sm leading-6 text-slate-600">Know how much team capacity remains before you need to expand.</p></div><div className="rounded-2xl border border-slate-200 bg-white p-5"><ShieldCheck className="text-lime-600" size={22} /><p className="mt-5 font-semibold text-slate-950">Stay in control</p><p className="mt-2 text-sm leading-6 text-slate-600">Owners manage purchases and payment history from one place.</p></div></div></div><div className="rounded-[2rem] border border-lime-200 bg-lime-50 p-8"><p className="text-sm font-bold uppercase tracking-[0.14em] text-lime-800">Your workspace</p><p className="mt-4 text-4xl font-semibold tracking-tight text-lime-950">Ready when you are.</p><ul className="mt-8 space-y-4">{["Create your organization", "Invite the right people", "Turn work into clear tasks", "Grow at your own pace"].map((item) => <li className="flex items-center gap-3 text-sm font-medium text-lime-950" key={item}><CheckCircle2 className="text-lime-700" size={18} />{item}</li>)}</ul><Link className="mt-9 inline-flex items-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800" href="/register">Create workspace <ArrowRight size={16} /></Link></div></div>
        </section>

        <section className="border-t border-slate-200 bg-white" id="contact">
          <div className="mx-auto max-w-5xl px-5 py-24 text-center sm:px-8"><MessageSquareWarning className="mx-auto text-lime-600" size={28} /><h2 className="mt-5 text-3xl font-semibold tracking-tight text-slate-950 sm:text-5xl">Less chasing. More meaningful work.</h2><p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-600">Give your organization a shared place to plan, deliver, and improve. Kajkorbo helps the whole team see what is happening and what comes next.</p><div className="mt-8 flex flex-wrap justify-center gap-4"><Link className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-6 py-3.5 text-sm font-semibold text-white hover:bg-slate-800" href="/register">Start your workspace <ArrowRight size={17} /></Link><Link className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-6 py-3.5 text-sm font-semibold text-slate-700 hover:border-slate-400" href="/login">Sign in <ArrowRight size={17} /></Link></div></div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
