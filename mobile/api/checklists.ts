// src/api/checklists.ts
import { Checklist } from '@/types';
import api from './client'; // axios instance with SecureStore interceptors

export const fetchChecklists = async (): Promise<Checklist[]> => {
  const { data } = await api.get<Checklist[]>('/checklists');
  return data;
};

export const createChecklist = async (payload: Partial<Checklist>) => {
  const { data } = await api.post<Checklist>('/checklists', payload);
  return data;
};

export const updateChecklist = async ({
  id,
  ...updates
}: { id: string } & Partial<Checklist>) => {
  const { data } = await api.patch<Checklist>(`/checklists/${id}`, updates);
  return data;
};

export const deleteChecklist = async (id: string) => {
  await api.delete(`/checklists/${id}`);
  return id;
};
