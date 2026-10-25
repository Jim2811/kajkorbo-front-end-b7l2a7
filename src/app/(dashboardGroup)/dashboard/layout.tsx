import Link from "next/link";

export default function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
          <Link className="text-xl font-bold tracking-[-0.04em] text-slate-950" href="/">
            kajkorbo<span className="text-lime-600">.</span>
          </Link>
          <Link className="text-sm font-medium text-slate-600 hover:text-slate-950" href="/dashboard">
            Dashboard
          </Link>
        </div>
      </header>
      {children}
    </div>
  );
}
