import Link from "next/link";

export function AdminShell({ title, description, children }: Readonly<{ title: string; description: string; children: React.ReactNode }>) {
  return (
    <main className="min-h-screen bg-slate-50 px-5 py-10 sm:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex items-center justify-between"><Link className="text-xl font-bold tracking-[-0.04em] text-slate-950" href="/">kajkorbo<span className="text-lime-600">.</span></Link><Link className="text-sm text-slate-600 hover:text-slate-950" href="/admin">Admin home</Link></div>
        <header className="mt-12"><p className="text-sm font-semibold uppercase tracking-[0.14em] text-red-600">Platform administration</p><h1 className="mt-3 text-4xl font-semibold tracking-tight text-slate-950">{title}</h1><p className="mt-3 max-w-2xl text-slate-600">{description}</p></header>
        <div className="mt-9">{children}</div>
      </div>
    </main>
  );
}
