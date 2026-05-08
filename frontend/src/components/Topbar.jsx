import { motion } from "framer-motion";
import { Menu, Search, Sparkles } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useUI } from "../context/UIContext";

export function Topbar() {
  const { user } = useAuth();
  const { openMobileSidebar } = useUI();

  return (
    <div className="sticky top-0 z-40 border-b border-white/10 bg-slate-950/55 backdrop-blur supports-[backdrop-filter]:bg-slate-950/30">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-3 px-6">
        <button
          type="button"
          onClick={openMobileSidebar}
          className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] p-2 text-zinc-200 transition hover:bg-white/[0.08] hover:text-white sm:hidden"
          aria-label="Open sidebar"
        >
          <Menu className="h-4 w-4" />
        </button>

        <div className="hidden items-center gap-2 text-xs text-zinc-400 sm:flex">
          <Sparkles className="h-4 w-4" />
          Premium workspace
        </div>

        <div className="relative ml-auto w-full max-w-md">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
          <input
            placeholder="Search (coming soon)"
            disabled
            className="ui-input py-2 pl-9 pr-3"
          />
        </div>

        <motion.div
          initial={false}
          whileHover={{ y: -1 }}
          className="hidden items-center gap-3 sm:flex"
        >
          <div className="text-right">
            <div className="text-sm font-medium text-white">{user?.name}</div>
            <div className="text-xs text-zinc-400">{user?.role}</div>
          </div>
          <div className="h-9 w-9 rounded-2xl border border-white/10 bg-gradient-to-br from-white/10 to-white/[0.02]" />
        </motion.div>
      </div>
    </div>
  );
}

