'use client';

export function NavLivePill() {
  return (
    <div
      className="flex items-center gap-2 rounded-full border border-emerald-500/25 bg-emerald-500/[0.07] px-3 py-2 shadow-[0_0_20px_-8px_rgba(16,185,129,0.45)] sm:px-3.5"
      title="Live data connection"
    >
      <span className="relative flex h-2 w-2 shrink-0">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400/50 opacity-75" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
      </span>
      <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-emerald-300/95 sm:text-xs">
        Live
      </span>
    </div>
  );
}
