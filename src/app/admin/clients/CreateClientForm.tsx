'use client';

import { useState } from 'react';
import { createClient } from '@/lib/actions/clients';
import { LogoUpload } from '@/components/admin/LogoUpload';

export function CreateClientForm() {
  const [open, setOpen] = useState(false);

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="w-full rounded-xl border border-dashed border-[var(--border-accent)] p-4 text-sm text-[var(--foreground-muted)] hover:text-[var(--accent-primary)] hover:border-[var(--accent-primary)] transition-colors"
      >
        + Add Client
      </button>
    );
  }

  return (
    <form
      action={async (formData) => {
        await createClient(formData);
        setOpen(false);
      }}
      className="rounded-xl border border-[var(--border-secondary)] bg-[var(--background-card)] p-4 space-y-4"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-[var(--foreground-secondary)] mb-1.5">
            Client Name *
          </label>
          <input
            name="name"
            required
            className="w-full rounded-lg border border-[var(--border-primary)] bg-[var(--background-secondary)] px-3 py-2 text-sm text-[var(--foreground)] outline-none focus:border-[var(--accent-primary)] transition-colors"
            placeholder="Acme Corp"
          />
        </div>
        <LogoUpload name="logoUrl" />
      </div>
      <div className="flex gap-2 justify-end">
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="px-3 py-1.5 rounded-lg text-sm text-[var(--foreground-muted)] hover:text-[var(--foreground)] transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-1.5 rounded-lg bg-[var(--accent-primary)] text-white text-sm font-medium hover:bg-[var(--accent-primary-hover)] transition-colors"
        >
          Create Client
        </button>
      </div>
    </form>
  );
}
