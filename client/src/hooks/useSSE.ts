// ============================================================
// src/hooks/useSSE.ts
// Server-Sent Events verbinding + query-invalidatie bij updates
// ============================================================

import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';

interface TaskUpdatedEvent {
  rideId: number;
  routeName: string;
  ordSubTaskNo: number;
  checked: boolean;
  checkedBy: string;
}

export function useSSE(userName: string, onNotification: (message: string) => void): void {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!userName) return;

    const es = new EventSource('/api/dashboard/events');

    es.addEventListener('task-updated', (e: MessageEvent) => {
      const data = JSON.parse(e.data) as TaskUpdatedEvent;
      // Invalideer taken van de betreffende route
      queryClient.invalidateQueries({ queryKey: ['tasks', data.rideId] });
      // Toon melding alleen als de update van een andere gebruiker komt
      if (data.checkedBy !== userName) {
        const actie = data.checked ? 'afgevinkt' : 'check ongedaan gemaakt';
        onNotification(`Route ${data.routeName}: taak ${actie} door ${data.checkedBy}`);
      }
    });

    // EventSource herverbindt automatisch bij fouten — geen extra logica nodig.
    // Cleanup bij unmount:
    return () => {
      es.close();
    };
  }, [queryClient, userName]);
}
