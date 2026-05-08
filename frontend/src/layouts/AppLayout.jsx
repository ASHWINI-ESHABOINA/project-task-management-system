import { Outlet } from "react-router-dom";
import { Sidebar } from "../components/Sidebar";
import { Topbar } from "../components/Topbar";
import { UIProvider } from "../context/UIContext";
import { useAuth } from "../context/AuthContext";

export function AppLayout() {
  const { logout } = useAuth();

  return (
    <UIProvider>
      <div className="min-h-screen bg-slate-950 text-slate-100">
        <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(800px_circle_at_20%_10%,rgba(99,102,241,0.16),transparent_55%),radial-gradient(700px_circle_at_80%_30%,rgba(16,185,129,0.10),transparent_55%)]" />

        <div className="relative mx-auto flex min-h-screen max-w-7xl">
          <div className="hidden sm:block">
            <Sidebar variant="desktop" />
          </div>
          <Sidebar variant="mobile" />

          <div className="flex min-w-0 flex-1 flex-col">
            <Topbar />
            <main className="mx-auto w-full max-w-6xl px-6 py-10">
              <Outlet />
              <div className="mt-14 flex items-center justify-between border-t border-white/10 pt-8 text-xs text-zinc-500">
                <div>© {new Date().getFullYear()} Team Task Manager</div>
                <button
                  type="button"
                  onClick={logout}
                  className="rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-zinc-200 transition hover:bg-white/[0.08] hover:text-white"
                >
                  Logout
                </button>
              </div>
            </main>
          </div>
        </div>
      </div>
    </UIProvider>
  );
}

