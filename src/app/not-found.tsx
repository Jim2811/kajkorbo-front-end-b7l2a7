export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-6 text-center">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">404</p>
      <h1 className="mt-3 text-3xl font-semibold text-slate-950">Page not found</h1>
      <p className="mt-3 max-w-md text-slate-600">
        The page you requested does not exist or may have moved.
      </p>
    </main>
  );
}
