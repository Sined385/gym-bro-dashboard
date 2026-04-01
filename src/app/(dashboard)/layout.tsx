import { RefreshButton } from "./_components/refresh-button";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-10 border-b border-gray-800 bg-gray-950/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
          <h1 className="text-lg font-bold">
            <span className="text-primary">GymJam</span>{" "}
            <span className="text-gray-400 font-normal">Analytics</span>
          </h1>
          <div className="flex items-center gap-3">
            <RefreshButton />
            <a
              href="/api/logout"
              className="rounded-lg border border-gray-700 px-3 py-1.5 text-sm text-gray-400 transition-colors hover:border-gray-500 hover:text-gray-200"
            >
              Logout
            </a>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6">{children}</main>
    </div>
  );
}
