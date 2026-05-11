const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000';

function getAccessToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('fundspree_access_token');
}

async function refreshAccessToken(): Promise<string | null> {
  const refresh = localStorage.getItem('fundspree_refresh_token');
  if (!refresh) return null;

  const res = await fetch(`${API_BASE}/api/auth/token/refresh/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refresh }),
  });

  if (!res.ok) {
    localStorage.removeItem('fundspree_access_token');
    localStorage.removeItem('fundspree_refresh_token');
    return null;
  }

  const data = await res.json();
  localStorage.setItem('fundspree_access_token', data.access);
  if (data.refresh) {
    localStorage.setItem('fundspree_refresh_token', data.refresh);
  }
  return data.access;
}

/**
 * Authenticated fetch wrapper. Attaches the Bearer token and retries once
 * with a refreshed token if the server returns 401.
 */
export async function authFetch(path: string, options: RequestInit = {}): Promise<Response> {
  const access = getAccessToken();

  const makeRequest = (token: string | null) =>
    fetch(`${API_BASE}${path}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers ?? {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });

  const res = await makeRequest(access);

  if (res.status === 401) {
    const newToken = await refreshAccessToken();
    if (newToken) {
      return makeRequest(newToken);
    }
  }

  return res;
}

/**
 * Authenticated fetch for multipart/FormData uploads.
 * Does NOT set Content-Type so the browser can set the correct
 * multipart boundary automatically.
 */
export async function authFetchMultipart(path: string, options: RequestInit = {}): Promise<Response> {
  const access = getAccessToken();

  const makeRequest = (token: string | null) =>
    fetch(`${API_BASE}${path}`, {
      ...options,
      headers: {
        ...(options.headers ?? {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });

  const res = await makeRequest(access);

  if (res.status === 401) {
    const newToken = await refreshAccessToken();
    if (newToken) {
      return makeRequest(newToken);
    }
  }

  return res;
}

export { API_BASE };
