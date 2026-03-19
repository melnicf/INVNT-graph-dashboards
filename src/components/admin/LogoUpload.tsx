'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';

interface LogoUploadProps {
  name: string;
  defaultValue?: string | null;
}

export function LogoUpload({ name, defaultValue }: LogoUploadProps) {
  const [url, setUrl] = useState(defaultValue ?? '');
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    if (!file.type.startsWith('image/')) return;
    setUploading(true);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      const data = await res.json();
      if (data.url) setUrl(data.url);
    } finally {
      setUploading(false);
    }
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  }

  return (
    <div>
      <label className="block text-xs font-medium text-[var(--foreground-secondary)] mb-1.5">
        Logo
      </label>
      <input type="hidden" name={name} value={url} />
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        className={`flex items-center gap-3 rounded-lg border border-dashed px-3 py-3 cursor-pointer transition-colors ${
          dragOver
            ? 'border-[var(--accent-primary)] bg-[var(--accent-primary)]/5'
            : 'border-[var(--border-primary)] hover:border-[var(--border-accent)]'
        }`}
      >
        {url ? (
          <Image
            src={url}
            alt="Logo preview"
            width={32}
            height={32}
            className="rounded object-contain flex-shrink-0"
          />
        ) : (
          <div className="w-8 h-8 rounded bg-[var(--background-tertiary)] flex items-center justify-center flex-shrink-0">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--foreground-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
          </div>
        )}
        <div className="min-w-0 flex-1">
          <p className="text-xs text-[var(--foreground-secondary)]">
            {uploading ? 'Uploading…' : url ? 'Click or drop to replace' : 'Click or drop an image'}
          </p>
          {url && (
            <p className="text-[10px] text-[var(--foreground-muted)] truncate">{url}</p>
          )}
        </div>
        {url && (
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); setUrl(''); }}
            className="text-[var(--foreground-muted)] hover:text-[var(--chart-rose)] transition-colors flex-shrink-0"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleChange}
      />
    </div>
  );
}
