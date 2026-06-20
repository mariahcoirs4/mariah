// ─── API Configuration ────────────────────────────────────────────
export const API_BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:5000';

// ─── Helper to get stored JWT token ──────────────────────────────
export function getAdminToken(): string | null {
  return localStorage.getItem('admin_token');
}

export function setAdminToken(token: string) {
  localStorage.setItem('admin_token', token);
}

export function clearAdminToken() {
  localStorage.removeItem('admin_token');
}

// ─── Generic fetch wrapper ────────────────────────────────────────
async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${path}`;
  const res = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message ?? `Request failed with status ${res.status}`);
  }
  return data;
}

// Authenticated request (auto-attaches JWT)
async function authRequest<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getAdminToken();
  return request<T>(path, {
    ...options,
    headers: {
      Authorization: token ? `Bearer ${token}` : '',
      ...(options.headers ?? {}),
    },
  });
}

// ─── Blog Types ───────────────────────────────────────────────────
export interface Blog {
  id: number;
  title: string;
  slug: string;
  metaTitle: string | null;
  metaDescription: string | null;
  shortDescription: string;
  content: string;
  featuredImage: string | null;
  isPublished: boolean;
  canonicalUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

// ─── Enquiry Types ─────────────────────────────────────────────────
export interface Enquiry {
  id: number;
  name: string;
  companyName: string | null;
  email: string;
  phone: string | null;
  country: string | null;
  productInterested: string | null;
  quantity: string | null;
  message: string;
  sourcePage: string | null;
  createdAt: string;
}

// ─── Dashboard Type ───────────────────────────────────────────────
export interface DashboardSummary {
  totalBlogs: number;
  totalPublishedBlogs: number;
  totalEnquiries: number;
  recentEnquiries: Enquiry[];
  recentBlogs: Blog[];
}

// ─── Blog API ─────────────────────────────────────────────────────
export const blogApi = {
  getAll: (publishedOnly = true): Promise<{ success: boolean; data: Blog[] }> => {
    const q = publishedOnly ? '?published=true' : '';
    return authRequest<{ success: boolean; data: Blog[] }>(`/api/blogs${q}`);
  },

  getBySlug: (slug: string): Promise<{ success: boolean; data: Blog }> =>
    request<{ success: boolean; data: Blog }>(`/api/blogs/${slug}`),

  create: (formData: FormData): Promise<{ success: boolean; data: Blog; message: string }> => {
    const token = getAdminToken();
    return fetch(`${API_BASE_URL}/api/blogs`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token ?? ''}` },
      body: formData,
    }).then(async (res) => {
      const data = await res.json();
      if (!res.ok) throw new Error(data.message ?? 'Create blog failed');
      return data;
    });
  },

  update: (id: number, formData: FormData): Promise<{ success: boolean; data: Blog; message: string }> => {
    const token = getAdminToken();
    return fetch(`${API_BASE_URL}/api/blogs/${id}`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token ?? ''}` },
      body: formData,
    }).then(async (res) => {
      const data = await res.json();
      if (!res.ok) throw new Error(data.message ?? 'Update blog failed');
      return data;
    });
  },

  delete: (id: number): Promise<{ success: boolean; message: string }> =>
    authRequest<{ success: boolean; message: string }>(`/api/blogs/${id}`, { method: 'DELETE' }),
};

// ─── Enquiry API ──────────────────────────────────────────────────
export interface EnquiryPayload {
  name: string;
  email: string;
  companyName?: string;
  phone?: string;
  country?: string;
  productInterested?: string;
  quantity?: string;
  message: string;
  sourcePage?: string;
}

export const enquiryApi = {
  submit: (payload: EnquiryPayload): Promise<{ success: boolean; message: string }> =>
    request<{ success: boolean; message: string }>('/api/enquiries', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  getAll: (params?: { search?: string; startDate?: string; endDate?: string }): Promise<{ success: boolean; data: Enquiry[] }> => {
    const qs = new URLSearchParams(
      Object.entries(params ?? {}).filter(([, v]) => !!v) as [string, string][]
    ).toString();
    return authRequest<{ success: boolean; data: Enquiry[] }>(`/api/enquiries${qs ? `?${qs}` : ''}`);
  },

  delete: (id: number): Promise<{ success: boolean; message: string }> =>
    authRequest<{ success: boolean; message: string }>(`/api/enquiries/${id}`, { method: 'DELETE' }),
};

// ─── Auth API ─────────────────────────────────────────────────────
export const authApi = {
  login: (email: string, password: string): Promise<{ success: boolean; token: string }> =>
    request<{ success: boolean; token: string }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  verify: (): Promise<{ success: boolean; admin: { id: number; email: string } }> =>
    authRequest<{ success: boolean; admin: { id: number; email: string } }>('/api/auth/verify'),
};

// ─── Dashboard API ────────────────────────────────────────────────
export const dashboardApi = {
  getSummary: (): Promise<{ success: boolean; data: DashboardSummary }> =>
    authRequest<{ success: boolean; data: DashboardSummary }>('/api/dashboard/summary'),
};
