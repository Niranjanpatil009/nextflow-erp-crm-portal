import { Customer, Product, StockMovementLog, SalesChallan, SystemStats, User } from '../types';

const TOKEN_KEY = 'nexflow_auth_token';
const USER_KEY = 'nexflow_auth_user';

export const getAuthToken = (): string | null => localStorage.getItem(TOKEN_KEY);
export const getStoredUser = (): User | null => {
  const str = localStorage.getItem(USER_KEY);
  if (!str) return null;
  try {
    return JSON.parse(str);
  } catch {
    return null;
  }
};

export const setAuthSession = (token: string, user: User) => {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

export const clearAuthSession = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};

const API_BASE_URL = (((import.meta as any).env?.VITE_API_BASE_URL as string) || '').replace(/\/$/, '');

const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
  const token = getAuthToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const targetUrl = url.startsWith('/') ? `${API_BASE_URL}${url}` : url;
  
  let response: Response;
  try {
    response = await fetch(targetUrl, { ...options, headers });
  } catch (err: any) {
    throw new Error(`Network Error: Cannot connect to API endpoint (${targetUrl}). Please verify backend server is running and CORS is enabled.`);
  }

  const responseText = await response.text();
  let data: any = {};
  if (responseText && responseText.trim().length > 0) {
    try {
      data = JSON.parse(responseText);
    } catch (e) {
      data = { error: responseText };
    }
  }

  if (!response.ok) {
    if (response.status === 401) {
      clearAuthSession();
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('auth:unauthorized'));
      }
    }
    const errMsg = data.error || data.message || `HTTP ${response.status}: ${response.statusText || 'Request failed'}`;
    throw new Error(errMsg);
  }

  return data;
};

export const api = {
  // Auth
  login: async (email: string, password: string) => {
    const data = await fetchWithAuth('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    if (data.token && data.user) {
      setAuthSession(data.token, data.user);
    }
    return data;
  },

  getMe: async () => {
    return fetchWithAuth('/api/auth/me');
  },

  // Stats
  getStats: async (): Promise<SystemStats> => {
    return fetchWithAuth('/api/stats');
  },

  // Customer CRM
  getCustomers: async (search?: string, status?: string, type?: string): Promise<Customer[]> => {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (status) params.append('status', status);
    if (type) params.append('type', type);
    return fetchWithAuth(`/api/customers?${params.toString()}`);
  },

  getCustomerById: async (id: string): Promise<Customer> => {
    return fetchWithAuth(`/api/customers/${id}`);
  },

  createCustomer: async (data: Omit<Customer, 'id' | 'createdAt' | 'updatedAt' | 'followUps'>): Promise<Customer> => {
    return fetchWithAuth('/api/customers', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  updateCustomer: async (id: string, data: Partial<Customer>): Promise<Customer> => {
    return fetchWithAuth(`/api/customers/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  addFollowUp: async (id: string, note: string, nextFollowUpDate?: string) => {
    return fetchWithAuth(`/api/customers/${id}/follow-ups`, {
      method: 'POST',
      body: JSON.stringify({ note, nextFollowUpDate }),
    });
  },

  // Inventory & Products
  getProducts: async (search?: string, category?: string, lowStock?: boolean): Promise<Product[]> => {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (category) params.append('category', category);
    if (lowStock) params.append('lowStock', 'true');
    return fetchWithAuth(`/api/products?${params.toString()}`);
  },

  createProduct: async (data: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<Product> => {
    return fetchWithAuth('/api/products', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  updateProduct: async (id: string, data: Partial<Product>, reason?: string): Promise<Product> => {
    return fetchWithAuth(`/api/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ ...data, reason }),
    });
  },

  // Stock Logs
  getStockLogs: async (productId?: string): Promise<StockMovementLog[]> => {
    const params = new URLSearchParams();
    if (productId) params.append('productId', productId);
    return fetchWithAuth(`/api/stock-logs?${params.toString()}`);
  },

  // Sales Challans
  getChallans: async (search?: string, status?: string, customerId?: string): Promise<SalesChallan[]> => {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (status) params.append('status', status);
    if (customerId) params.append('customerId', customerId);
    return fetchWithAuth(`/api/challans?${params.toString()}`);
  },

  getChallanById: async (id: string): Promise<SalesChallan> => {
    return fetchWithAuth(`/api/challans/${id}`);
  },

  createChallan: async (data: {
    customerId: string;
    items: { productId: string; quantity: number }[];
    status: 'Draft' | 'Confirmed';
    notes?: string;
  }): Promise<SalesChallan> => {
    return fetchWithAuth('/api/challans', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  confirmChallan: async (id: string): Promise<SalesChallan> => {
    return fetchWithAuth(`/api/challans/${id}/confirm`, {
      method: 'POST',
    });
  },

  cancelChallan: async (id: string): Promise<SalesChallan> => {
    return fetchWithAuth(`/api/challans/${id}/cancel`, {
      method: 'POST',
    });
  },

  getPostmanCollection: async () => {
    return fetchWithAuth('/api/docs/postman');
  },
};
