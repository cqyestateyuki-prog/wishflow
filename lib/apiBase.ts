/**
 * API base resolver / API 基地址
 * On the web the API lives on the same origin (''). Inside the Capacitor
 * shell pages are served from capacitor://localhost, so API calls must go
 * to the production server — set NEXT_PUBLIC_API_BASE in the shell build.
 */
export function apiUrl(path: string): string {
  const base = process.env.NEXT_PUBLIC_API_BASE || '';
  return `${base}${path}`;
}
