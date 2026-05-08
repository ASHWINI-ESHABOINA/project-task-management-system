import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  CheckCircle2,
  Clock3,
  FolderKanban,
  ListChecks,
  Plus,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { fetchProjects } from "../services/projects";
import { fetchTasks } from "../services/tasks";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/Card";
import { Skeleton } from "../components/ui/Skeleton";
import { CreateProjectModal } from "../components/CreateProjectModal";
import { CreateTaskModal } from "../components/CreateTaskModal";
import { updateTaskStatus } from "../services/tasks";

const STATUS_VALUES = ["Todo", "In Progress", "Done"];

export function DashboardPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState("");
  const [createProjectOpen, setCreateProjectOpen] = useState(false);
  const [createTaskOpen, setCreateTaskOpen] = useState(false);
  const [updatingTaskId, setUpdatingTaskId] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setError("");
      setLoading(true);
      try {
        const [p, t] = await Promise.all([fetchProjects(), fetchTasks()]);
        if (!cancelled) {
          setProjects(p);
          setTasks(t);
        }
      } catch (err) {
        if (!cancelled) setError(err?.response?.data?.message || "Failed to load dashboard");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const stats = useMemo(() => {
    const totalTasks = tasks.length;
    const done = tasks.filter((t) => t.status === "Done").length;
    const inProgress = tasks.filter((t) => t.status === "In Progress").length;
    const todo = tasks.filter((t) => t.status === "Todo").length;

    return [
      { label: "Projects", value: projects.length, icon: FolderKanban },
      { label: "Tasks", value: totalTasks, icon: ListChecks },
      { label: "In Progress", value: inProgress, icon: Clock3 },
      { label: "Done", value: done, icon: CheckCircle2 },
      { label: "Todo", value: todo, icon: ArrowUpRight },
    ];
  }, [projects, tasks]);

  const recentTasks = useMemo(() => {
    return [...tasks]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 6);
  }, [tasks]);

  const isAdmin = user?.role === "admin";

  const onCreatedProject = (project) => {
    setProjects((prev) => [project, ...prev]);
  };

  const onCreatedTask = (task) => {
    setTasks((prev) => [task, ...prev]);
  };

  const canUpdateStatus = (task) => {
    if (isAdmin) return true;
    return String(task?.assignedTo?._id || task?.assignedTo) === String(user?._id);
  };

  const onChangeStatus = async (task, nextStatus) => {
    if (!task?._id) return;
    setError("");
    setUpdatingTaskId(task._id);
    try {
      const updated = await updateTaskStatus(task._id, nextStatus);
      setTasks((prev) => prev.map((t) => (t._id === updated._id ? updated : t)));
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to update task status");
    } finally {
      setUpdatingTaskId("");
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-zinc-300">
            Workspace
            <span className="h-1 w-1 rounded-full bg-zinc-500" />
            <span className="text-white/90">{user?.role}</span>
          </div>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Dashboard
          </h1>
          <p className="mt-2 text-sm text-zinc-400">
            Welcome back, <span className="font-medium text-white">{user?.name}</span>.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-xs text-zinc-300">
            Signed in as <span className="font-medium text-white">{user?.email}</span>
          </div>

          {isAdmin ? (
            <div className="hidden items-center gap-2 sm:flex">
              <button
                type="button"
                onClick={() => setCreateProjectOpen(true)}
                className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-xs font-medium text-zinc-200 transition hover:bg-white/[0.08] hover:text-white"
              >
                <Plus className="h-4 w-4" />
                Create project
              </button>
              <button
                type="button"
                onClick={() => setCreateTaskOpen(true)}
                className="inline-flex items-center gap-2 rounded-2xl bg-indigo-500 px-4 py-3 text-xs font-semibold text-white transition hover:bg-indigo-400"
              >
                <Plus className="h-4 w-4" />
                Create task
              </button>
            </div>
          ) : null}
        </div>
      </div>

      {error ? (
        <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {error}
        </div>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {loading
          ? Array.from({ length: 5 }).map((_, i) => (
              <Card key={i}>
                <CardContent className="p-5">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="mt-4 h-8 w-14" />
                </CardContent>
              </Card>
            ))
          : stats.map((s) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
              >
                <Card className="transition hover:border-white/15 hover:bg-white/[0.06]">
                  <CardContent className="p-5">
                    <div className="flex items-center justify-between">
                      <div className="text-xs font-medium uppercase tracking-wide text-zinc-400">
                        {s.label}
                      </div>
                      <div className="rounded-xl border border-white/10 bg-white/[0.04] p-2">
                        <s.icon className="h-4 w-4 text-zinc-200" />
                      </div>
                    </div>
                    <div className="mt-3 text-2xl font-semibold tracking-tight text-white">
                      {s.value}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
      </div>

      <div className="grid items-start gap-6 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle>Recent tasks</CardTitle>
              <CardDescription>
                {isAdmin
                  ? "Latest work across the workspace."
                  : "Tasks assigned to you. Update status as you progress."}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-2">
              <div className="divide-y divide-white/10">
                {loading ? (
                  <div className="space-y-3 py-2">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <div key={i} className="flex items-center justify-between py-2">
                        <div className="w-full">
                          <Skeleton className="h-4 w-2/3" />
                          <Skeleton className="mt-2 h-3 w-1/3" />
                        </div>
                        <Skeleton className="ml-6 h-6 w-20" />
                      </div>
                    ))}
                  </div>
                ) : recentTasks.length === 0 ? (
                  <div className="py-8 text-sm text-zinc-400">No tasks yet.</div>
                ) : (
                  recentTasks.map((t) => (
                    <motion.div
                      key={t._id}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2 }}
                      className="flex flex-col gap-3 py-3 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div className="min-w-0">
                        <div className="truncate text-sm font-medium text-white">{t.title}</div>
                        <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-zinc-400">
                          <span className="truncate">
                            {t.projectId?.title ? t.projectId.title : "Project"}
                          </span>
                          <span className="text-zinc-600">•</span>
                          <span className="truncate">
                            Assigned to {t.assignedTo?.name || "—"}
                          </span>
                          {t.dueDate ? (
                            <>
                              <span className="text-zinc-600">•</span>
                              <span>Due {new Date(t.dueDate).toLocaleDateString()}</span>
                            </>
                          ) : null}
                        </div>
                      </div>

                      <div className="flex shrink-0 items-center gap-2 sm:ml-6">
                        {canUpdateStatus(t) ? (
                          <select
                            value={t.status}
                            onChange={(e) => onChangeStatus(t, e.target.value)}
                            disabled={updatingTaskId === t._id}
                            className="ui-select min-w-36 py-1.5 text-xs"
                          >
                            {STATUS_VALUES.map((status) => (
                              <option key={status} value={status}>
                                {status}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <span
                            className={[
                              "inline-flex items-center rounded-full border px-2.5 py-1 text-xs",
                              t.status === "Done"
                                ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-200"
                                : t.status === "In Progress"
                                  ? "border-indigo-500/20 bg-indigo-500/10 text-indigo-200"
                                  : "border-white/10 bg-white/[0.04] text-zinc-200",
                            ].join(" ")}
                          >
                            {t.status}
                          </span>
                        )}
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Projects</CardTitle>
              <CardDescription>Quick overview of your active projects.</CardDescription>
            </CardHeader>
            <CardContent className="pt-2">
              <div className="grid gap-3">
                {loading ? (
                  Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                      <Skeleton className="h-4 w-2/3" />
                      <Skeleton className="mt-2 h-3 w-1/2" />
                    </div>
                  ))
                ) : projects.length === 0 ? (
                  <div className="py-8 text-sm text-zinc-400">No projects yet.</div>
                ) : (
                  projects.slice(0, 4).map((p) => (
                    <motion.div
                      key={p._id}
                      whileHover={{ y: -2 }}
                      transition={{ duration: 0.15 }}
                      className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 transition hover:border-white/15 hover:bg-white/[0.05]"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="truncate text-sm font-medium text-white">{p.title}</div>
                          <div className="mt-1 line-clamp-2 text-xs text-zinc-400">
                            {p.description || "No description"}
                          </div>
                        </div>
                        <div className="rounded-xl border border-white/10 bg-white/[0.04] px-2 py-1 text-xs text-zinc-300">
                          {Array.isArray(p.members) ? p.members.length : 0} members
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <CreateProjectModal
        open={createProjectOpen}
        onClose={() => setCreateProjectOpen(false)}
        onCreated={onCreatedProject}
      />
      <CreateTaskModal
        open={createTaskOpen}
        onClose={() => setCreateTaskOpen(false)}
        onCreated={onCreatedTask}
      />
    </div>
  );
}

