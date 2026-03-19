'use client';

import { useFormStatus } from 'react-dom';
import { useState, useEffect } from 'react';
import { updateClient } from '@/lib/actions/clients';
import { LogoUpload } from '@/components/admin/LogoUpload';

interface EditClientFormProps {
  client: { id: string; name: string; slug: string; logoUrl: string | null };
}

function SaveSubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="px-4 py-1.5 rounded-lg bg-[var(--accent-primary)] text-white text-sm font-medium hover:bg-[var(--accent-primary-hover)] transition-colors disabled:opacity-60 disabled:pointer-events-none"
    >
      {pending ? 'Saving…' : 'Save Changes'}
    </button>
  );
}

export function EditClientForm({ client }: EditClientFormProps) {
  const [notice, setNotice] = useState<{ type: 'success' | 'error'; message: string } | null>(
    null,
  );

  useEffect(() => {
    if (notice?.type !== 'success') return;
    const t = window.setTimeout(() => setNotice(null), 4000);
    return () => window.clearTimeout(t);
  }, [notice]);

  return (
    <form
      action={async (formData) => {
        try {
          await updateClient(client.id, formData);
          setNotice({ type: 'success', message: 'Changes saved.' });
        } catch {
          setNotice({ type: 'error', message: 'Could not save changes. Try again.' });
        }
      }}
      className="rounded-xl border border-[var(--border-secondary)] bg-[var(--background-card)] p-5"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-xs font-medium text-[var(--foreground-secondary)] mb-1.5">
            Client Name
          </label>
          <input
            name="name"
            defaultValue={client.name}
            required
            className="w-full rounded-lg border border-[var(--border-primary)] bg-[var(--background-secondary)] px-3 py-2 text-sm text-[var(--foreground)] outline-none focus:border-[var(--accent-primary)] transition-colors"
          />
        </div>
        <LogoUpload name="logoUrl" defaultValue={client.logoUrl} />
      </div>
      {notice && (
        <p
          role="status"
          aria-live="polite"
          className={`mb-3 text-sm ${
            notice.type === 'success'
              ? 'text-[var(--chart-emerald)]'
              : 'text-[var(--chart-rose)]'
          }`}
        >
          {notice.message}
        </p>
      )}
      <div className="flex items-center justify-between gap-4">
        <p className="text-xs text-[var(--foreground-muted)]">Slug: /{client.slug}</p>
        <SaveSubmitButton />
      </div>
    </form>
  );
}
