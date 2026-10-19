export interface AuthUser {
  id: string;
  email: string;
  name?: string;
  role: 'CUSTOMER' | 'ADMIN' | 'SUPPORT';
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';

export function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('tooly_admin_token');
}

export function setAuthToken(token: string | null) {
  if (typeof window === 'undefined') return;
  if (token) {
    localStorage.setItem('tooly_admin_token', token);
    document.cookie = `tooly_access_token=${token}; path=/; max-age=604800; SameSite=Strict`;
  } else {
    localStorage.removeItem('tooly_admin_token');
    document.cookie = 'tooly_access_token=; path=/; max-age=0; SameSite=Strict';
  }
}

export async function loginApi(email: string, pass: string): Promise<{ user: AuthUser; accessToken: string }> {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password: pass }),
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || 'فشل تسجيل الدخول. يرجى التحقق من البريد الإلكتروني وكلمة المرور.');
  }

  const data = await res.json();
  setAuthToken(data.accessToken);
  return data;
}

export async function getProfileApi(): Promise<AuthUser | null> {
  const token = getAuthToken();
  if (!token) return null;

  try {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      setAuthToken(null);
      return null;
    }

    return await res.json();
  } catch {
    return null;
  }
}

export function logoutApi() {
  setAuthToken(null);
}
