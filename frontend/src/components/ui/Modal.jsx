import { motion } from "framer-motion";
import { X } from "lucide-react";

export function Modal({ open, title, description, onClose, children, footer }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/70"
        onClick={onClose}
      />

      <div className="absolute inset-0 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center px-4 py-10">
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.18 }}
            className="w-full max-w-xl rounded-2xl border border-white/10 bg-slate-950 shadow-[0_30px_120px_-60px_rgba(0,0,0,0.9)]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-6 border-b border-white/10 px-6 py-5">
              <div className="min-w-0">
                <div className="truncate text-sm font-semibold tracking-tight text-white">
                  {title}
                </div>
                {description ? (
                  <div className="mt-1 text-sm text-zinc-400">{description}</div>
                ) : null}
              </div>
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl border border-white/10 bg-white/[0.04] p-2 text-zinc-200 transition hover:bg-white/[0.08] hover:text-white"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="px-6 py-5">{children}</div>

            {footer ? (
              <div className="flex items-center justify-end gap-3 border-t border-white/10 px-6 py-4">
                {footer}
              </div>
            ) : null}
          </motion.div>
        </div>
      </div>
    </div>
  );
}

