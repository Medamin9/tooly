import { getAuthToken } from './auth';
import {
  ContactStatus,
  CreateContactMessageInput,
  ContactMessageItem,
  ContactMessagesListResponse,
} from '@tooly/contracts';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

function authHeaders() {
  const token = getAuthToken();
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export async function submitContactMessageApi(
  data: CreateContactMessageInput,
): Promise<{ success: boolean; message: string; id: string }> {
  const res = await fetch(`${API_BASE}/contacts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    const message = Array.isArray(err.message) ? err.message.join(', ') : err.message;
    throw new Error(message || 'Failed to send message. Please try again later.');
  }

  return res.json();
}

export async function getAdminContactsApi(query?: {
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
}): Promise<ContactMessagesListResponse> {
  const params = new URLSearchParams();
  if (query?.page) params.set('page', String(query.page));
  if (query?.limit) params.set('limit', String(query.limit));
  if (query?.status && query.status !== 'ALL') params.set('status', query.status);
  if (query?.search && query.search.trim()) params.set('search', query.search.trim());

  const res = await fetch(`${API_BASE}/admin/contacts?${params.toString()}`, {
    headers: authHeaders(),
    cache: 'no-store',
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'Failed to fetch contact messages');
  }

  return res.json();
}

export async function getAdminContactByIdApi(id: string): Promise<ContactMessageItem> {
  const res = await fetch(`${API_BASE}/admin/contacts/${id}`, {
    headers: authHeaders(),
    cache: 'no-store',
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'Failed to load contact message');
  }

  return res.json();
}

export async function updateAdminContactStatusApi(
  id: string,
  status: ContactStatus,
): Promise<ContactMessageItem> {
  const res = await fetch(`${API_BASE}/admin/contacts/${id}/status`, {
    method: 'PATCH',
    headers: authHeaders(),
    body: JSON.stringify({ status }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'Failed to update contact status');
  }

  return res.json();
}

export async function deleteAdminContactApi(
  id: string,
): Promise<{ success: boolean; id: string }> {
  const res = await fetch(`${API_BASE}/admin/contacts/${id}`, {
    method: 'DELETE',
    headers: authHeaders(),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'Failed to delete contact message');
  }

  return res.json();
}
