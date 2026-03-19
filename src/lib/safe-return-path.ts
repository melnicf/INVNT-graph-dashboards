/**
 * Validates `return` query values for post-FAQ/Process navigation (open-redirect safe).
 * Allows `/` or `/view-client/<id>` only.
 */
export function safeDashboardReturnPath(raw: string | null): string | null {
  if (raw == null) return null;
  let path: string;
  try {
    path = decodeURIComponent(raw.trim());
  } catch {
    return null;
  }
  if (!path.startsWith('/') || path.startsWith('//')) return null;
  if (path.includes('://')) return null;
  if (path === '/') return '/';
  if (/^\/view-client\/[^/?#]+$/u.test(path)) return path;
  return null;
}
