'use client';

import { useState } from 'react';

const faqs = [
  {
    question: 'What is the INVNT Event Intelligence Engine?',
    answer:
      'The INVNT Event Intelligence Engine is a managed service providing custom data, integration, and analysis services. We provide one-time and continuous improvement intelligence through our dedicated team. We use our patent-pending AI, machine learning, and data science models to predict and understand true event performance.',
  },
  {
    question: 'Integrations & Pricing',
    answer:
      'We integrate with all major event registration platforms and apps and are agnostic. Pricing is based on data use, data storage, and deliverables. Custom features are available.',
  },
  {
    question: 'What data sources do you use?',
    answer:
      'We combine INVNT proprietary data, empirical data, client & attendee data, onsite behavioral data, and optional mobile AI / computer vision inputs — depending on your service tier (Enhanced, Premium, or Ultra).',
  },
  {
    question: 'How is my data protected?',
    answer:
      'All data is processed through our Data Secure Infrastructure, which is fully GDPR compliant. We employ end-to-end encryption, role-based access controls, and regular security audits to ensure your data remains safe.',
  },
  {
    question: 'What are the three dashboard types?',
    answer:
      'Predictive Analytics provides pre-event forecasting and risk assessment. Live Features delivers real-time event monitoring during your event. Post Insights offers comprehensive post-event analysis including sentiment, survey, attendance, and budget breakdowns.',
  },
  {
    question: 'Can I customize which dashboards my team sees?',
    answer:
      'Yes. Through the super-admin panel, you can configure exactly which dashboards and individual graphs each client has access to, including custom ordering and branding with your logo.',
  },
];

function AccordionItem({
  question,
  answer,
  isOpen,
  onToggle,
}: {
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="border border-[var(--border-secondary)] rounded-xl overflow-hidden transition-colors hover:border-[var(--border-accent)]">
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left"
      >
        <span className="text-sm font-medium text-[var(--foreground)]">{question}</span>
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="var(--foreground-muted)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="flex-shrink-0 transition-transform duration-300"
          style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
      <div
        className="grid transition-all duration-300 ease-in-out"
        style={{
          gridTemplateRows: isOpen ? '1fr' : '0fr',
        }}
      >
        <div className="overflow-hidden">
          <div className="px-5 pb-4 text-sm text-[var(--foreground-secondary)] leading-relaxed">
            {answer}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function FaqPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="relative mx-auto w-full max-w-3xl">
      <div className="text-center mb-12 animate-fade-in">
        <p className="text-xs font-medium tracking-widest uppercase text-[var(--accent-primary)] mb-3">
          Support
        </p>
        <h1 className="text-3xl sm:text-4xl font-bold text-[var(--foreground)] mb-3">
          Frequently Asked Questions
        </h1>
        <p className="text-sm text-[var(--foreground-muted)] max-w-md mx-auto">
          Everything you need to know about the INVNT Event Intelligence Engine.
        </p>
      </div>

      <div
        className="space-y-3 animate-fade-in"
        style={{ animationDelay: '0.1s' } as React.CSSProperties}
      >
        {faqs.map((faq, i) => (
          <AccordionItem
            key={i}
            question={faq.question}
            answer={faq.answer}
            isOpen={openIndex === i}
            onToggle={() => setOpenIndex(openIndex === i ? null : i)}
          />
        ))}
      </div>

      <div
        className="mt-12 rounded-2xl border border-[var(--border-secondary)] bg-[var(--background-card)] p-8 text-center animate-fade-in"
        style={{ animationDelay: '0.2s' } as React.CSSProperties}
      >
        <h2 className="text-lg font-semibold text-[var(--foreground)] mb-2">Still have questions?</h2>
        <p className="text-sm text-[var(--foreground-muted)] mb-5">
          Our team is happy to help you understand how the Event Intelligence Engine can work for your events.
        </p>
        <a
          href="mailto:support@invnt.com"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[var(--accent-primary)] text-white text-sm font-medium hover:bg-[var(--accent-primary-hover)] transition-colors"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="4" width="20" height="16" rx="2" />
            <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
          </svg>
          Contact Us
        </a>
      </div>

      <footer className="mt-16 pt-8 border-t border-[var(--border-secondary)] text-center">
        <p className="text-xs text-[var(--foreground-muted)]">Powered by INVNT Event Intelligence Engine</p>
      </footer>
    </div>
  );
}
