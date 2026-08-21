import { cookies } from 'next/headers';
import { api } from './api';
import { User } from '@/types/user';
import { Note } from '@/types/note';
import { AxiosResponse } from 'axios';

const getAuthHeaders = async () => {
  const cookieStore = await cookies();
  return {
    Header: {
      Cookie: cookieStore.toString(),
    },
  };
};

export const fetchNotes = async (params?: { search?: string; page?: number; tag?: string }) => {
  const headers = await getAuthHeaders();
  const response = await api.get<Note[]>('/notes', {
    headers: headers.Header,
    params: { ...params, perPage: 12 },
  });
  return response.data;
};

export const fetchNoteById = async (id: string): Promise<Note> => {
  const headers = await getAuthHeaders();
  const response = await api.get<Note>(`/notes/${id}`, { headers: headers.Header });
  return response.data;
};

export const getMe = async (): Promise<User> => {
  const headers = await getAuthHeaders();
  const response = await api.get<User>('/users/me', { headers: headers.Header });
  return response.data;
};

export const checkSession = async (): Promise<AxiosResponse> => {
  const cookieStore = await cookies();
  const response = await api.get('/auth/session', {
    headers: {
      Cookie: cookieStore.toString(),
    },
  });
  return response;
};