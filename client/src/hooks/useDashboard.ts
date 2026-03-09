// ============================================================
// src/hooks/useDashboard.ts
// React Query hooks voor routes en taken
// ============================================================

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchRoutes, fetchTasks, setTaskChecked, markRouteSeen } from '../api/dashboard';

// ------------------------------------------------------------
// Routes
// ------------------------------------------------------------
export function useRoutes(userName: string, day?: string) {
  return useQuery({
    queryKey: ['routes', userName, day],
    queryFn: () => fetchRoutes(userName, day),
    enabled: !!userName,
    refetchInterval: 60_000,
  });
}

// ------------------------------------------------------------
// Taken voor een route
// ------------------------------------------------------------
export function useTasks(rideId: number | null, day?: string, showChecked?: boolean) {
  return useQuery({
    queryKey: ['tasks', rideId, day, showChecked],
    queryFn: () => fetchTasks({ rideId: rideId ?? undefined, day, showChecked }),
    enabled: rideId !== null,
  });
}

// ------------------------------------------------------------
// Taak checken / unchecken
// ------------------------------------------------------------
export function useSetTaskChecked() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: setTaskChecked,
    onSuccess: () => {
      // Invalideer alle taken zodat de lijst direct ververst
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
}

// ------------------------------------------------------------
// Route als gezien markeren
// ------------------------------------------------------------
export function useMarkRouteSeen() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: markRouteSeen,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['routes'] });
    },
  });
}
