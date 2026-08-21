import { cookies } from 'next/headers';
import { api } from './api';
import { User } from '@/types/user';
import { Note } from '@/types/note';
import { AxiosResponse } from 'axios';


export const getAuthHeaders = async () => {
  const cookieStore = await cookies();
  return {
    Cookie: cookieStore.toString(),
  };
};

export const fetchNotes = async (params?: { search?: string; page?: number; tag?: string }) => {
  const headers = await getAuthHeaders();
  const response = await api.get<Note[]>('/notes', {
    headers,
    params: { ...params, perPage: 12 },
  });
  return response.data;
};

export const fetchNoteById = async (id: string): Promise<Note> => {
  const headers = await getAuthHeaders();
  const response = await api.get(`/notes/${id}`, { headers});
  return response.data;
};

export const getMe = async (): Promise<User> => {
  const headers = await getAuthHeaders();
  const response = await api.get('/users/me', { headers });
  return response.data;
};

export const checkSession = async () => {
  const headers = await getAuthHeaders();
  const response = await api.get('/auth/session', { headers });
  return response;
};