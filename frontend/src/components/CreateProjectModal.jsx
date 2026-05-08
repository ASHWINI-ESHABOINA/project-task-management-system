import { useState } from "react";
import { Modal } from "./ui/Modal";
import { createProject } from "../services/projects";

export function CreateProjectModal({ open, onClose, onCreated }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const reset = () => {
    setTitle("");
    setDescription("");
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
      const project = await createProject({ title, description });
      onCreated?.(project);
      close();
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to create project");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={close}
      title="Create project"
      description="Create a new project and start organizing work."
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
            form="create-project-form"
            disabled={submitting}
            className="rounded-xl bg-indigo-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-400 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? "Creating..." : "Create"}
          </button>
        </>
      }
    >
      <form id="create-project-form" onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="text-sm text-zinc-200">Title</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            minLength={2}
            className="ui-input"
            placeholder="e.g. Website redesign"
          />
        </div>
        <div>
          <label className="text-sm text-zinc-200">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="ui-input resize-none"
            placeholder="Optional"
          />
        </div>

        {error ? (
          <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm text-red-200">
            {error}
          </div>
        ) : null}
      </form>
    </Modal>
  );
}

