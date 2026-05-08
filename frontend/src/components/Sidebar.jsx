import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import { LayoutGrid, ListChecks, FolderKanban, ChevronLeft, ChevronRight } from "lucide-react";
import { useUI } from "../context/UIContext";

const nav = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutGrid },
  { to: "/projects", label: "Projects", icon: FolderKanban },
  { to: "/tasks", label: "Tasks", icon: ListChecks },
];

function NavItem({ to, label, icon: Icon, collapsed, onNavigate }) {
  return (
    <NavLink
      to={to}
      onClick={onNavigate}
      className={({ isActive }) =>
        [
          "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition",
          "hover:bg-white/[0.06] hover:text-white",
          isActive ? "bg-white/[0.08] text-white" : "text-zinc-300",
        ].join(" ")
      }
    >
      <Icon className="h-4 w-4 shrink-0 text-zinc-300 group-hover:text-white" />
      {!collapsed ? <span className="truncate">{label}</span> : null}
    </NavLink>
  );
}

export function Sidebar({ variant = "desktop" }) {
  const {
    sidebarCollapsed,
    toggleSidebar,
    mobileSidebarOpen,
    closeMobileSidebar,
  } = useUI();

  const collapsed = sidebarCollapsed && variant === "desktop";

  const shell = (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 76 : 264 }}
      transition={{ type: "spring", stiffness: 260, damping: 30 }}
      className={[
        "h-full border-r border-white/10 bg-slate-950/50",
        "backdrop-blur supports-[backdrop-filter]:bg-slate-950/30",
      ].join(" ")}
    >
      <div className="flex h-16 items-center justify-between px-4">
        <div className="min-w-0">
          <div className="truncate text-sm font-semibold tracking-tight text-white">
            {collapsed ? "TTM" : "Team Task Manager"}
          </div>
          {!collapsed ? (
            <div className="mt-0.5 text-xs text-zinc-400">Workspace</div>
          ) : null}
        </div>

        {variant === "desktop" ? (
          <button
            type="button"
            onClick={toggleSidebar}
            className="rounded-lg border border-white/10 bg-white/[0.04] p-1.5 text-zinc-300 transition hover:bg-white/[0.08] hover:text-white"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </button>
        ) : null}
      </div>

      <div className="px-3">
        <div className="space-y-1">
          {nav.map((n) => (
            <NavItem
              key={n.to}
              to={n.to}
              label={n.label}
              icon={n.icon}
              collapsed={collapsed}
              onNavigate={variant === "mobile" ? closeMobileSidebar : undefined}
            />
          ))}
        </div>
      </div>

      <div className="mt-6 px-3">
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-3">
          {!collapsed ? (
            <>
              <div className="text-xs font-medium text-white">Tip</div>
              <div className="mt-1 text-xs leading-relaxed text-zinc-400">
                Admins can create projects & tasks. Members can update their task status.
              </div>
            </>
          ) : (
            <div className="h-3 w-full rounded bg-white/[0.06]" />
          )}
        </div>
      </div>
    </motion.aside>
  );

  if (variant === "mobile") {
    return (
      <motion.div
        initial={false}
        animate={{ opacity: mobileSidebarOpen ? 1 : 0, pointerEvents: mobileSidebarOpen ? "auto" : "none" }}
        className="fixed inset-0 z-50 bg-black/60"
        onClick={closeMobileSidebar}
      >
        <motion.div
          initial={false}
          animate={{ x: mobileSidebarOpen ? 0 : -320 }}
          transition={{ type: "spring", stiffness: 260, damping: 30 }}
          className="absolute left-0 top-0 h-full"
          onClick={(e) => e.stopPropagation()}
        >
          {shell}
        </motion.div>
      </motion.div>
    );
  }

  return shell;
}

