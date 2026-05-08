import { useEffect, useMemo, useState } from "react";
import { Modal } from "./ui/Modal";
import { fetchProjects } from "../services/projects";
import { fetchUsers } from "../services/users";
import { createTask } from "../services/tasks";

const STATUS_VALUES = ["Todo", "In Progress", "Done"];

export function CreateTaskModal({ open, onClose, onCreated }) {
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [projectId, setProjectId] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [status, setStatus] = useState("Todo");
  const [dueDate, setDueDate] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    async function load() {
      if (!open) return;
      setError("");
      setLoading(true);
      try {
        const [p, u] = await Promise.all([fetchProjects(), fetchUsers()]);
        if (!cancelled) {
          setProjects(p);
          setUsers(u);
          setProjectId(p?.[0]?._id || "");
          const firstMember = (u || []).find((x) => x.role === "member") || u?.[0];
          setAssignedTo(firstMember?._id || "");
        }
      } catch (err) {
        if (!cancelled) setError(err?.response?.data?.message || "Failed to load form data");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [open]);

  const memberOptions = useMemo(() => {
    return users.filter((u) => u.role === "member");
  }, [users]);

  const reset = () => {
    setTitle("");
    setDescription("");
    setStatus("Todo");
    setDueDate("");
    setError("");
    setSubmitting(false);
  };

  const close = () => {
    reset();
    onClose?.();
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const payload = {
        title,
        description,
        projectId,
        assignedTo,
        status,
        dueDate: dueDate ? new Date(dueDate).toISOString() : undefined,
      };
      const task = await createTask(payload);
      onCreated?.(task);
      close();
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to create task");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={close}
      title="Create task"
      description="Create a new task and assign it to a member."
      footer={
        <>
          <button
            type="button"
            onClick={close}
            className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-medium text-zinc-200 transition hover:bg-white/[0.08] hover:text-white"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="create-task-form"
            disabled={submitting || loading}
            className="rounded-xl bg-indigo-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-400 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? "Creating..." : "Create"}
          </button>
        </>
      }
    >
      {error ? (
        <div className="mb-4 rounded-2xl border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm text-red-200">
          {error}
        </div>
      ) : null}

      <form id="create-task-form" onSubmit={onSubmit} className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className="text-sm text-zinc-200">Title</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            minLength={2}
            disabled={loading}
            className="ui-input"
            placeholder="e.g. Implement auth middleware"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="text-sm text-zinc-200">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            disabled={loading}
            className="ui-input resize-none"
            placeholder="Optional"
          />
        </div>

        <div>
          <label className="text-sm text-zinc-200">Project</label>
          <select
            value={projectId}
            onChange={(e) => setProjectId(e.target.value)}
            disabled={loading || projects.length === 0}
            className="ui-select"
          >
            {projects.map((p) => (
              <option key={p._id} value={p._id}>
                {p.title}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-sm text-zinc-200">Assign to</label>
          <select
            value={assignedTo}
            onChange={(e) => setAssignedTo(e.target.value)}
            disabled={loading || memberOptions.length === 0}
            className="ui-select"
          >
            {memberOptions.map((u) => (
              <option key={u._id} value={u._id}>
                {u.name} ({u.email})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-sm text-zinc-200">Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            disabled={loading}
            className="ui-select"
          >
            {STATUS_VALUES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-sm text-zinc-200">Due date</label>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            disabled={loading}
            className="ui-input"
          />
        </div>
      </form>
    </Modal>
  );
}

