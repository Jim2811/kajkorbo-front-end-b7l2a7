import { ArrowUpRight, Github, Linkedin, Twitter } from "lucide-react";
import Link from "next/link";

const footerGroups = [
  {
    title: "Product",
    links: [
      ["Platform", "#platform"],
      ["Workflows", "#workflows"],
      ["For teams", "#teams"],
      ["Pricing", "#pricing"],
    ],
  },
  {
    title: "Company",
    links: [
      ["About", "#about"],
      ["Contact", "#contact"],
      ["Careers", "#careers"],
      ["Changelog", "#changelog"],
    ],
  },
  {
    title: "Resources",
    links: [
      ["Help center", "#help"],
      ["Documentation", "#documentation"],
      ["Community", "#community"],
      ["Status", "#status"],
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="bg-slate-950 text-white">
      <div className="mx-auto max-w-7xl px-5 pb-8 pt-16 sm:px-8 lg:px-10">
        <div className="grid gap-12 border-b border-white/10 pb-14 lg:grid-cols-[1.4fr_2fr]">
          <div>
            <Link
              aria-label="Kajkorbo home"
              className="flex w-fit items-center gap-2.5 text-xl font-bold tracking-[-0.04em]"
              href="/"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-lime-300 text-sm font-black text-slate-950">
                K
              </span>
              kajkorbo<span className="text-lime-300">.</span>
            </Link>
            <p className="mt-5 max-w-sm text-sm leading-6 text-slate-400">
              A focused workspace for organizations, teams, and meaningful work.
            </p>
            <Link
              className="mt-7 inline-flex items-center gap-2 rounded-full bg-lime-300 px-5 py-2.5 text-sm font-semibold text-slate-950 transition-colors hover:bg-lime-200"
              href="#get-started"
            >
              Start building
              <ArrowUpRight aria-hidden="true" size={15} strokeWidth={2.5} />
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3">
            {footerGroups.map((group) => (
              <div key={group.title}>
                <h2 className="text-sm font-semibold text-white">{group.title}</h2>
                <ul className="mt-5 space-y-3.5">
                  {group.links.map(([label, href]) => (
                    <li key={label}>
                      <Link
                        className="text-sm text-slate-400 transition-colors hover:text-lime-300"
                        href={href}
                      >
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-5 pt-7 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 Kajkorbo. Built for better work.</p>
          <div className="flex items-center gap-5">
            <Link className="transition-colors hover:text-white" href="#privacy">
              Privacy
            </Link>
            <Link className="transition-colors hover:text-white" href="#terms">
              Terms
            </Link>
            <div className="flex items-center gap-3 border-l border-white/10 pl-5">
              <Link aria-label="Kajkorbo on GitHub" className="transition-colors hover:text-lime-300" href="#github">
                <Github aria-hidden="true" size={17} />
              </Link>
              <Link aria-label="Kajkorbo on LinkedIn" className="transition-colors hover:text-lime-300" href="#linkedin">
                <Linkedin aria-hidden="true" size={17} />
              </Link>
              <Link aria-label="Kajkorbo on Twitter" className="transition-colors hover:text-lime-300" href="#twitter">
                <Twitter aria-hidden="true" size={17} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
