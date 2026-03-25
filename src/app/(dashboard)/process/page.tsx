'use client';

const tiers = [
  {
    name: 'Enhanced',
    color: 'var(--chart-violet)',
    features: ['INVNT Data', 'Empirical Data'],
  },
  {
    name: 'Premium',
    color: 'var(--chart-purple)',
    features: [
      'INVNT Data',
      'Empirical Data',
      'Limited Client & Attendee Data',
      'Limited Onsite Data',
    ],
  },
  {
    name: 'Ultra',
    color: 'var(--chart-indigo)',
    features: [
      'INVNT Data',
      'Empirical Data',
      'Full Client & Attendee Data',
      'Full Onsite Data',
      'Full Onsite Mobile AI & Computer Vision',
    ],
  },
];

const outputs = [
  {
    name: 'Predictive Analytics',
    description: 'Pre-event forecasting',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
      </svg>
    ),
  },
  {
    name: 'Live Features',
    description: 'Real-time monitoring',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
  },
  {
    name: 'Post Insights',
    description: 'Post-event analysis',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 3v18h18" />
        <path d="m19 9-5 5-4-4-3 3" />
      </svg>
    ),
  },
];

function ConnectorLine({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className="w-px h-10 bg-gradient-to-b from-[var(--accent-primary)]/60 to-[var(--accent-primary)]/20" />
    </div>
  );
}

function ArrowDown() {
  return (
    <div className="flex items-center justify-center">
      <svg width="20" height="32" viewBox="0 0 20 32" fill="none" className="text-[var(--accent-primary)]">
        <line x1="10" y1="0" x2="10" y2="26" stroke="currentColor" strokeWidth="2" strokeDasharray="4 3" opacity="0.5" />
        <polygon points="4,24 10,32 16,24" fill="currentColor" opacity="0.6" />
      </svg>
    </div>
  );
}

export default function ProcessPage() {
  return (
    <div className="relative mx-auto w-full max-w-5xl overflow-x-hidden">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in">
          <p className="text-xs font-medium tracking-widest uppercase text-[var(--accent-primary)] mb-3">
            INVNT Event Intelligence Engine
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold text-[var(--foreground)] mb-4">
            Platform architecture
          </h1>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[var(--border-accent)] bg-[var(--background-card)]">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--chart-emerald)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            <span className="text-xs font-medium text-[var(--foreground-secondary)]">
              Data Secure Infrastructure &middot; GDPR Compliant
            </span>
          </div>
        </div>

        {/* ── Tiers ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-4 animate-fade-in" style={{ animationDelay: '0.1s' } as React.CSSProperties}>
          {tiers.map((tier, idx) => (
            <div
              key={tier.name}
              className="relative rounded-2xl border bg-[var(--background-card)] overflow-hidden group"
              style={{ borderColor: `color-mix(in srgb, ${tier.color} 30%, transparent)` }}
            >
              {/* Glow top edge */}
              <div
                className="absolute top-0 left-0 right-0 h-px"
                style={{ background: `linear-gradient(90deg, transparent, ${tier.color}, transparent)` }}
              />

              {/* Header */}
              <div className="px-5 pt-5 pb-3">
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className="text-xs font-bold tracking-wider uppercase"
                    style={{ color: tier.color }}
                  >
                    {tier.name}
                  </span>
                  {idx === 2 && (
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-medium bg-[var(--accent-primary)]/10 text-[var(--accent-primary)]">
                      Most Complete
                    </span>
                  )}
                </div>
              </div>

              {/* Features */}
              <div className="px-5 pb-5 space-y-2">
                {tier.features.map((feature) => (
                  <div
                    key={feature}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-lg bg-[var(--background-tertiary)]"
                  >
                    <div
                      className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                      style={{ backgroundColor: tier.color }}
                    />
                    <span className="text-xs text-[var(--foreground-secondary)]">
                      {feature}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* ── Connector: tiers → AI ── */}
        <div className="flex justify-center gap-[calc(33.33%-2rem)] animate-fade-in" style={{ animationDelay: '0.2s' } as React.CSSProperties}>
          <ArrowDown />
          <ArrowDown />
          <ArrowDown />
        </div>

        {/* ── AI & ML Section ── */}
        <div
          className="relative rounded-2xl border border-[var(--accent-primary)]/30 bg-[var(--background-card)] p-6 sm:p-8 text-center my-4 animate-fade-in"
          style={{ animationDelay: '0.25s' } as React.CSSProperties}
        >
          {/* Glow effect */}
          <div className="absolute inset-0 rounded-2xl" style={{
            background: 'radial-gradient(ellipse at center, rgba(139, 92, 246, 0.08), transparent 70%)',
          }} />

          <div className="relative">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[var(--accent-primary)]/10 mb-4">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--accent-primary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2a4 4 0 0 1 4 4c0 1.95-1.4 3.58-3.25 3.93" />
                <path d="M8.24 9.93A4 4 0 0 1 12 2" />
                <path d="M12 12v4" />
                <path d="M8 22h8" />
                <path d="M10 22v-4" />
                <path d="M14 22v-4" />
                <circle cx="12" cy="8" r="1" fill="var(--accent-primary)" />
                <path d="M5 12h14" />
                <path d="M3 16l3-4" />
                <path d="M21 16l-3-4" />
              </svg>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-[var(--foreground)] mb-2">
              AI, Machine Learning &amp; Algorithms
            </h2>
            <p className="text-sm text-[var(--foreground-muted)] max-w-md mx-auto">
              Patent-pending models that predict and understand true event performance
              through continuous data processing and analysis.
            </p>
          </div>
        </div>

        {/* ── Connector: AI → Real Time ── */}
        <ConnectorLine />

        {/* ── Real Time Badge ── */}
        <div className="flex justify-center my-4 animate-fade-in" style={{ animationDelay: '0.35s' } as React.CSSProperties}>
          <div className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full border border-[var(--chart-emerald)]/30 bg-[var(--chart-emerald)]/5">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--chart-emerald)] opacity-50" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[var(--chart-emerald)]" />
            </span>
            <span className="text-sm font-semibold text-[var(--chart-emerald)]">Real Time</span>
          </div>
        </div>

        {/* ── Connector: Real Time → Outputs ── */}
        <div className="flex justify-center gap-[calc(33.33%-2rem)]">
          <ArrowDown />
          <ArrowDown />
          <ArrowDown />
        </div>

        {/* ── Output Dashboards ── */}
        <div
          className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-4 animate-fade-in"
          style={{ animationDelay: '0.4s' } as React.CSSProperties}
        >
          {outputs.map((output) => (
            <div
              key={output.name}
              className="rounded-2xl border border-[var(--border-secondary)] bg-[var(--background-card)] p-6 text-center hover:border-[var(--accent-primary)]/40 transition-colors group"
            >
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] mb-4 group-hover:scale-110 transition-transform">
                {output.icon}
              </div>
              <h3 className="text-sm font-semibold text-[var(--foreground)] mb-1">
                {output.name}
              </h3>
              <p className="text-xs text-[var(--foreground-muted)]">
                {output.description}
              </p>
            </div>
          ))}
        </div>

        {/* Footer */}
      <footer className="mt-16 pt-8 border-t border-[var(--border-secondary)] text-center">
        <p className="text-xs text-[var(--foreground-muted)]">
          Powered by INVNT Event Intelligence Engine
        </p>
      </footer>
    </div>
  );
}
