import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  fetchChecklists,
  createChecklist,
  updateChecklist,
  deleteChecklist,
} from '@/api/checklists';
import { Checklist } from '@/types';

const QUERY_KEY = ['checklists'];

export function useChecklists() {
  return useQuery<Checklist[]>({
    queryKey: QUERY_KEY,
    queryFn: fetchChecklists,
    staleTime: 1000 * 60,
  });
}

export function useCreateChecklist() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (newChecklist: Partial<Checklist>) =>
      createChecklist(newChecklist),
    onSuccess: () => qc.invalidateQueries({ queryKey: QUERY_KEY }),
  });
}

export function useUpdateChecklist() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (checklist: Checklist) => updateChecklist(checklist),
    onSuccess: () => qc.invalidateQueries({ queryKey: QUERY_KEY }),
  });
}

export function useDeleteChecklist() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteChecklist(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: QUERY_KEY }),
  });
}
