"use client";

import { ArrowUpRight, Menu, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const navigation = [
  { label: "Platform", href: "#platform" },
  { label: "Workflows", href: "#workflows" },
  { label: "For teams", href: "#teams" },
];

export function SiteNavbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl">
      <nav
        aria-label="Main navigation"
        className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-10"
      >
        <Link
          aria-label="Kajkorbo home"
          className="flex items-center gap-2.5 text-xl font-bold tracking-[-0.04em] text-slate-950"
          href="/"
          onClick={() => setIsOpen(false)}
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-950 text-sm font-black text-lime-300">
            K
          </span>
          kajkorbo<span className="text-lime-600">.</span>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {navigation.map((item) => (
            <Link
              className="text-sm font-medium text-slate-600 transition-colors hover:text-slate-950"
              href={item.href}
              key={item.href}
            >
              {item.label}
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <Link
            className="rounded-full px-4 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-100 hover:text-slate-950"
            href="#sign-in"
          >
            Sign in
          </Link>
          <Link
            className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-slate-800"
            href="#get-started"
          >
            Get started
            <ArrowUpRight aria-hidden="true" size={15} strokeWidth={2.5} />
          </Link>
        </div>

        <button
          aria-expanded={isOpen}
          aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
          className="rounded-xl p-2 text-slate-700 transition-colors hover:bg-slate-100 md:hidden"
          onClick={() => setIsOpen((open) => !open)}
          type="button"
        >
          {isOpen ? <X aria-hidden="true" size={22} /> : <Menu aria-hidden="true" size={22} />}
        </button>
      </nav>

      {isOpen ? (
        <div className="border-t border-slate-200 bg-white px-5 pb-5 md:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-1 pt-3">
            {navigation.map((item) => (
              <Link
                className="rounded-xl px-3 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-950"
                href={item.href}
                key={item.href}
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <div className="mt-3 grid grid-cols-2 gap-3 border-t border-slate-100 pt-4">
              <Link
                className="rounded-full border border-slate-200 px-4 py-2.5 text-center text-sm font-semibold text-slate-700"
                href="#sign-in"
                onClick={() => setIsOpen(false)}
              >
                Sign in
              </Link>
              <Link
                className="rounded-full bg-slate-950 px-4 py-2.5 text-center text-sm font-semibold text-white"
                href="#get-started"
                onClick={() => setIsOpen(false)}
              >
                Get started
              </Link>
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}
