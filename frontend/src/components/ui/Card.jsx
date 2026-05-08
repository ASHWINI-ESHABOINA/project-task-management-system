export function Card({ className = "", children }) {
  return (
    <div
      className={[
        "rounded-2xl border border-white/10 bg-white/[0.04] shadow-[0_1px_0_0_rgba(255,255,255,0.06)_inset,0_20px_60px_-40px_rgba(0,0,0,0.8)]",
        className,
      ].join(" ")}
    >
      {children}
    </div>
  );
}

export function CardHeader({ className = "", children }) {
  return <div className={["px-5 pt-5", className].join(" ")}>{children}</div>;
}

export function CardTitle({ className = "", children }) {
  return (
    <div className={["text-sm font-medium tracking-tight text-white", className].join(" ")}>
      {children}
    </div>
  );
}

export function CardDescription({ className = "", children }) {
  return (
    <div className={["mt-1 text-sm text-zinc-400", className].join(" ")}>{children}</div>
  );
}

export function CardContent({ className = "", children }) {
  return <div className={["px-5 pb-5", className].join(" ")}>{children}</div>;
}

