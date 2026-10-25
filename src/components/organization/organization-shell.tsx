import Link from "next/link";

export function OrganizationShell({
  title,
  description,
  children,
}: Readonly<{
  title: string;
  description: string;
  children: React.ReactNode;
}>) {
  return (
    <main className="min-h-screen bg-slate-50 px-5 py-10 sm:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Link className="text-xl font-bold tracking-[-0.04em] text-slate-950" href="/">
            kajkorbo<span className="text-lime-600">.</span>
          </Link>
          <Link className="text-sm font-medium text-slate-600 hover:text-slate-950" href="/dashboard">
            Back to dashboard
          </Link>
        </div>
        <header className="mt-14">
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-lime-700">
            Organization
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-slate-950">{title}</h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">{description}</p>
        </header>
        <div className="mt-10">{children}</div>
      </div>
    </main>
  );
}
