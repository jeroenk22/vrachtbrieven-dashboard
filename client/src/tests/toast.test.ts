// ============================================================
// src/tests/toast.test.ts
// Tests voor het ToastContainer component
// ============================================================

import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { ToastContainer } from '../components/Toast';

describe('ToastContainer', () => {
  it('rendert niets als de lijst leeg is', () => {
    const { container } = render(ToastContainer({ items: [] }));
    expect(container.firstChild).toBeNull();
  });

  it('rendert een toast met het juiste bericht', () => {
    const { getByText } = render(
      ToastContainer({ items: [{ id: 1, message: 'Route X: taak afgevinkt door piet' }] })
    );
    expect(getByText('Route X: taak afgevinkt door piet')).toBeTruthy();
  });

  it('rendert meerdere toasts', () => {
    const { getAllByRole } = render(
      ToastContainer({
        items: [
          { id: 1, message: 'Eerste melding' },
          { id: 2, message: 'Tweede melding' },
        ],
      })
    );
    // Elk toast-item is een div zonder specifieke role; check via container
    expect(getAllByRole('generic').length).toBeGreaterThanOrEqual(2);
  });
});
