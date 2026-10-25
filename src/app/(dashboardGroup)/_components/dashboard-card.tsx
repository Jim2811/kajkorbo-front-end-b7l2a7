import Link from "next/link";

export type DashboardCardData = {
  title: string;
  description: string;
  href: string;
  action: string;
  tone?: "dark" | "light" | "lime";
};

export function DashboardCard({ card }: Readonly<{ card: DashboardCardData }>) {
  const toneClasses =
    card.tone === "dark"
      ? "border-slate-950 bg-slate-950 text-white"
      : card.tone === "lime"
        ? "border-lime-200 bg-lime-50 text-lime-950"
        : "border-slate-200 bg-white text-slate-950";
  const descriptionClasses =
    card.tone === "dark"
      ? "text-slate-300"
      : card.tone === "lime"
        ? "text-lime-900"
        : "text-slate-600";

  return (
    <Link
      className={`rounded-3xl border p-6 transition hover:-translate-y-0.5 hover:shadow-lg ${toneClasses}`}
      href={card.href}
    >
      <h2 className="text-xl font-semibold">{card.title}</h2>
      <p className={`mt-3 text-sm leading-6 ${descriptionClasses}`}>{card.description}</p>
      <span className="mt-8 inline-flex text-sm font-semibold underline underline-offset-4">
        {card.action} →
      </span>
    </Link>
  );
}
