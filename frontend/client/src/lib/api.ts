const API_BASE_URL = 'http://localhost:4000/api';

export interface ApiResponse<T> {
  data?: T;
  message?: string;
  error?: string;
}

export const apiCall = async <T,>(
  endpoint: string,
  options: RequestInit & { token?: string } = {}
): Promise<T> => {
  const { token, ...fetchOptions } = options;
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(fetchOptions.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...fetchOptions,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || `Erro na requisição: ${response.status}`);
  }

  return response.json();
};

// Clients API
export const clientsApi = {
  list: (token: string) =>
    apiCall('/clients', { token, method: 'GET' }),
  getById: (id: string, token: string) =>
    apiCall(`/clients/${id}`, { token, method: 'GET' }),
  create: (data: any, token: string) =>
    apiCall('/clients', { token, method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: any, token: string) =>
    apiCall(`/clients/${id}`, { token, method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: string, token: string) =>
    apiCall(`/clients/${id}`, { token, method: 'DELETE' }),
};

// Bookings API
export const bookingsApi = {
  list: (token: string) =>
    apiCall('/bookings', { token, method: 'GET' }),
  getById: (id: string, token: string) =>
    apiCall(`/bookings/${id}`, { token, method: 'GET' }),
  create: (data: any, token: string) =>
    apiCall('/bookings', { token, method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: any, token: string) =>
    apiCall(`/bookings/${id}`, { token, method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: string, token: string) =>
    apiCall(`/bookings/${id}`, { token, method: 'DELETE' }),
};

// Services API
export const servicesApi = {
  list: (token: string) =>
    apiCall('/services', { token, method: 'GET' }),
  getById: (id: string, token: string) =>
    apiCall(`/services/${id}`, { token, method: 'GET' }),
  create: (data: any, token: string) =>
    apiCall('/services', { token, method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: any, token: string) =>
    apiCall(`/services/${id}`, { token, method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: string, token: string) =>
    apiCall(`/services/${id}`, { token, method: 'DELETE' }),
};
