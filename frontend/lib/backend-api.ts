const DEFAULT_BACKEND_URL = 'http://127.0.0.1:5000';

export function getBackendApiUrl() {
  return process.env.BACKEND_API_URL || DEFAULT_BACKEND_URL;
}

export async function fetchBackend<T>(path: string, init?: RequestInit) {
  const response = await fetch(`${getBackendApiUrl()}${path}`, {
    cache: 'no-store',
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers || {}),
    },
  });

  if (!response.ok) {
    let message = `Backend request failed with status ${response.status}`;

    try {
      const data = await response.json();
      if (data?.error) {
        message = data.error;
      }
    } catch {
      // Ignore non-JSON error bodies and keep the default message.
    }

    throw new Error(message);
  }

  return response.json() as Promise<T>;
}
