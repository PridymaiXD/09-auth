import { api } from './api';
import { User } from '@/types/user';
import { Note } from '@/types/note';

export interface RegisterRequest {
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface CreateNotePayload {
  title: string;
  content: string;
  tag: string;
}

// Auth API
export const register = async (data: RegisterRequest): Promise<User> => {
  const response = await api.post<User>('/auth/register', data);
  return response.data;
};

export const login = async (data: LoginRequest): Promise<User> => {
  const response = await api.post<User>('/auth/login', data);
  return response.data;
};

export const logout = async (): Promise<void> => {
  await api.post('/auth/logout');
};

export const checkSession = async (): Promise<User | null> => {
  const response = await api.get<User | null>('/auth/session');
  return response.data;
};

// Users API
export const getMe = async (): Promise<User> => {
  const response = await api.get<User>('/users/me');
  return response.data;
};

export const updateMe = async (data: Partial<User>): Promise<User> => {
  const response = await api.patch<User>('/users/me', data);
  return response.data;
};

// Notes API
export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

export const fetchNotes = async (params?: {
  search?: string;
  page?: number;
  tag?: string;
  
}): Promise<FetchNotesResponse> => {
  const response = await api.get<FetchNotesResponse>('/notes', {
    params: { ...params, perPage: 12 },
  });
  return response.data;
};

export const fetchNoteById = async (id: string): Promise<Note> => {
  const response = await api.get<Note>(`/notes/${id}`);
  return response.data;
};

export const createNote = async (data: CreateNotePayload): Promise<Note> => {
  const response = await api.post<Note>('/notes', data);
  return response.data;
};

export const deleteNote = async (id: string): Promise<Note> => {
  const response = await api.delete<Note>(`/notes/${id}`);
  return response.data;
};