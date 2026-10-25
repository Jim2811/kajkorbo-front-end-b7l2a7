import { DashboardCard, type DashboardCardData } from "./dashboard-card";

export function RoleDashboardView({
  eyebrow,
  title,
  description,
  cards,
}: Readonly<{
  eyebrow: string;
  title: string;
  description: string;
  cards: DashboardCardData[];
}>) {
  return (
    <main className="mx-auto max-w-7xl px-5 py-12 sm:px-8">
      <header>
        <p className="text-sm font-semibold uppercase tracking-[0.14em] text-lime-700">{eyebrow}</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-slate-950">{title}</h1>
        <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">{description}</p>
      </header>
      <section className="mt-10 grid gap-5 lg:grid-cols-3">
        {cards.map((card) => <DashboardCard card={card} key={card.href} />)}
      </section>
    </main>
  );
}
