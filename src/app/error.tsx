"use client";

export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-6 text-center">
      <h1 className="text-3xl font-semibold text-slate-950">Something went wrong</h1>
      <p className="mt-3 max-w-md text-slate-600">
        We could not load this page. Please try again or return to the workspace.
      </p>
      <button
        className="mt-6 rounded-full bg-slate-950 px-5 py-2.5 text-sm font-medium text-white"
        onClick={reset}
        type="button"
      >
        Try again
      </button>
    </main>
  );
}
