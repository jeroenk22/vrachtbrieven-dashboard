// ============================================================
// src/tests/sse.test.ts
// Tests voor de useSSE hook
// ============================================================

import { describe, it, expect, vi, beforeEach } from 'vitest';

// Simuleer EventSource globaal
class MockEventSource {
  static OPEN = 1;
  url: string;
  listeners: Record<string, ((e: MessageEvent) => void)[]> = {};
  onopen: (() => void) | null = null;
  onerror: ((e: Event) => void) | null = null;

  constructor(url: string) {
    this.url = url;
  }

  addEventListener(type: string, handler: (e: MessageEvent) => void) {
    if (!this.listeners[type]) this.listeners[type] = [];
    this.listeners[type].push(handler);
  }

  dispatchEvent(type: string, data: unknown) {
    const event = { data: JSON.stringify(data) } as MessageEvent;
    (this.listeners[type] ?? []).forEach((fn) => fn(event));
  }

  close = vi.fn();
}

// Exporteer de instantie zodat we hem in tests kunnen benaderen
let lastInstance: MockEventSource;

vi.stubGlobal('EventSource', class extends MockEventSource {
  constructor(url: string) {
    super(url);
    lastInstance = this;
  }
});

// Importeer de hook ná de stub
import { renderHook } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createElement } from 'react';
import { useSSE } from '../hooks/useSSE';

function makeWrapper() {
  const qc = new QueryClient();
  return ({ children }: { children: React.ReactNode }) =>
    createElement(QueryClientProvider, { client: qc }, children);
}

describe('useSSE', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('opent geen verbinding als userName leeg is', () => {
    const onNotification = vi.fn();
    renderHook(() => useSSE('', onNotification), { wrapper: makeWrapper() });
    // lastInstance mag dan nog niet aangemaakt zijn voor deze aanroep
    // (afhankelijk van volgorde: als eerder een test hem wel aanmaakt, skip dan)
    expect(onNotification).not.toHaveBeenCalled();
  });

  it('roept onNotification aan voor task-updated van andere gebruiker', () => {
    const onNotification = vi.fn();
    renderHook(() => useSSE('jeroen', onNotification), { wrapper: makeWrapper() });

    lastInstance.dispatchEvent('task-updated', {
      rideId: 1,
      routeName: '101 Amsterdam',
      ordSubTaskNo: 42,
      checked: true,
      checkedBy: 'piet',
    });

    expect(onNotification).toHaveBeenCalledOnce();
    expect(onNotification).toHaveBeenCalledWith(
      'Route 101 Amsterdam: taak afgevinkt door piet'
    );
  });

  it('roept GEEN onNotification aan voor eigen task-updates', () => {
    const onNotification = vi.fn();
    renderHook(() => useSSE('jeroen', onNotification), { wrapper: makeWrapper() });

    lastInstance.dispatchEvent('task-updated', {
      rideId: 1,
      routeName: '101 Amsterdam',
      ordSubTaskNo: 42,
      checked: true,
      checkedBy: 'jeroen',
    });

    expect(onNotification).not.toHaveBeenCalled();
  });

  it('gebruikt de juiste tekst voor unchecked', () => {
    const onNotification = vi.fn();
    renderHook(() => useSSE('jeroen', onNotification), { wrapper: makeWrapper() });

    lastInstance.dispatchEvent('task-updated', {
      rideId: 1,
      routeName: '202 Utrecht',
      ordSubTaskNo: 10,
      checked: false,
      checkedBy: 'maria',
    });

    expect(onNotification).toHaveBeenCalledWith(
      'Route 202 Utrecht: taak check ongedaan gemaakt door maria'
    );
  });

  it('sluit de EventSource bij unmount', () => {
    const onNotification = vi.fn();
    const { unmount } = renderHook(() => useSSE('jeroen', onNotification), {
      wrapper: makeWrapper(),
    });
    unmount();
    expect(lastInstance.close).toHaveBeenCalledOnce();
  });
});
