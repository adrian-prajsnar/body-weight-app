export function withBase(path: string): string {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  if (/^https?:\/\//.test(path)) {
    return path;
  }
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return `${base}${normalized}`;
}

export function absoluteUrl(path: string): string {
  const site = (import.meta.env.SITE ?? '').replace(/\/$/, '');
  return `${site}${withBase(path)}`;
}
