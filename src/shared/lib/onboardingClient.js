import i18next from 'i18next';

// In dev we proxy `/api` via Vite, so default to same-origin.
// For production/remote API set `VITE_API_URL` (e.g. https://api.example.com).
const API_URL = (import.meta.env.VITE_API_URL ?? '').replace(/\/+$/, '');

export async function analyzeKaspi(payload) {
  const response = await fetch(`${API_URL}/api/analyze`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const data = await response.json().catch(() => null);
    const message = data?.message || i18next.t('errors.analyzeFailed');
    throw new Error(message);
  }

  return response.json();
}
