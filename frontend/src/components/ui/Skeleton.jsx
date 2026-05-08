export function Skeleton({ className = "" }) {
  return (
    <div
      className={[
        "relative overflow-hidden rounded-xl bg-white/[0.06]",
        "before:absolute before:inset-0 before:-translate-x-full before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent before:animate-[shimmer_1.2s_infinite]",
        className,
      ].join(" ")}
    />
  );
}

