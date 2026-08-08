import axios from 'axios';
import { Note, CreateNotePayload, FetchNotesResponse} from '@/types/note';

const API_BASE_URL = 'https://notehub-public.goit.study/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    Authorization: `Bearer ${process.env.NEXT_PUBLIC_NOTEHUB_TOKEN}`,
  },
});

export const fetchNotes = async (
  page = 1,
  search = '',
  tag?: string
): Promise<FetchNotesResponse> => {
  const params: Record<string, string | number> = { page, search };
  if (tag && tag !== 'all') {
    params.tag = tag;
  }

  const response = await api.get<FetchNotesResponse>('/notes', { params });
  return response.data;
};

export const fetchNoteById = async (id: string): Promise<Note> => {
  const response = await api.get<Note>(`/notes/${id}`);
  return response.data;
};

export const createNote = async (payload: CreateNotePayload): Promise<Note> => {
  const response = await api.post<Note>('/notes', payload);
  return response.data;
};

export const deleteNote = async (id: string): Promise<Note> => {
  const response = await api.delete<Note>(`/notes/${id}`);
  return response.data;
};