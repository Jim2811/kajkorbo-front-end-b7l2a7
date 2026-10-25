import Link from "next/link";

export function AuthShell({
  title,
  description,
  children,
  footer,
}: Readonly<{
  title: string;
  description: string;
  children: React.ReactNode;
  footer: React.ReactNode;
}>) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-5 py-12 sm:px-8">
      <div className="w-full max-w-md">
        <Link
          className="mx-auto flex w-fit items-center gap-2.5 text-xl font-bold tracking-[-0.04em] text-slate-950"
          href="/"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-950 text-sm font-black text-lime-300">
            K
          </span>
          kajkorbo<span className="text-lime-600">.</span>
        </Link>
        <section className="mt-8 rounded-3xl border border-slate-200 bg-white p-7 shadow-sm sm:p-8">
          <h1 className="text-2xl font-semibold tracking-tight text-slate-950">{title}</h1>
          <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
          <div className="mt-7">{children}</div>
        </section>
        <div className="mt-5 text-center text-sm text-slate-600">{footer}</div>
      </div>
    </main>
  );
}
