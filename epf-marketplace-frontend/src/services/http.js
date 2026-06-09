const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000').replace(/\/$/, '');

export function getAuthToken() {
  return localStorage.getItem('token') || localStorage.getItem('authToken') || '';
}

function buildHeaders(customHeaders = {}, hasBody = false) {
  const headers = { Accept: 'application/json', ...customHeaders };
  const token = getAuthToken();

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  if (hasBody && !(headers['Content-Type'] || headers['content-type'])) {
    headers['Content-Type'] = 'application/json';
  }

  return headers;
}

async function parseResponse(response) {
  const contentType = response.headers.get('content-type') || '';

  if (contentType.includes('application/json')) {
    return response.json();
  }

  const text = await response.text();
  return text ? { message: text } : null;
}

function extractErrorMessage(payload, fallback) {
  if (!payload) return fallback;
  if (typeof payload === 'string') return payload;
  if (payload.message) return payload.message;
  if (payload.error) return payload.error;
  if (payload.errors && typeof payload.errors === 'object') {
    const first = Object.values(payload.errors).flat()[0];
    if (first) return first;
  }
  return fallback;
}

export async function apiRequest(endpoint, { method = 'GET', body, headers = {} } = {}) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method,
    headers: buildHeaders(headers, body !== undefined),
    body: body === undefined ? undefined : JSON.stringify(body),
  });

  const payload = await parseResponse(response);

  if (!response.ok) {
    if (response.status === 401 && typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      window.dispatchEvent(new CustomEvent('auth:unauthorized'));
    }

    const message = extractErrorMessage(payload, `Erreur HTTP ${response.status}`);
    const error = new Error(message);
    error.status = response.status;
    error.payload = payload;
    throw error;
  }

  return payload;
}

export { API_BASE_URL };
