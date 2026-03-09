import { describe, it, expect } from 'vitest';
import {
  formatTime,
  formatDateTime,
  formatEuro,
  toDateInputValue,
  formatLastUpdated,
} from '../utils/format';

describe('formatTime', () => {
  it('geeft - terug bij null', () => {
    expect(formatTime(null)).toBe('-');
  });

  it('geeft - terug bij undefined', () => {
    expect(formatTime(undefined)).toBe('-');
  });

  it('geeft - terug bij ongeldige datum', () => {
    expect(formatTime('geen-datum')).toBe('-');
  });

  it('formatteert een geldige datetime naar HH:MM', () => {
    const result = formatTime('2024-03-09T14:05:00');
    expect(result).toMatch(/^\d{2}:\d{2}$/);
  });
});

describe('formatDateTime', () => {
  it('geeft - terug bij null', () => {
    expect(formatDateTime(null)).toBe('-');
  });

  it('geeft - terug bij undefined', () => {
    expect(formatDateTime(undefined)).toBe('-');
  });

  it('geeft - terug bij ongeldige datum', () => {
    expect(formatDateTime('geen-datum')).toBe('-');
  });

  it('bevat dag, maand, jaar, uur en minuut', () => {
    const result = formatDateTime('2024-03-09T14:05:00');
    expect(result).toContain('2024');
    expect(result).toContain('09');
    expect(result).toContain('03');
  });
});

describe('formatEuro', () => {
  it('geeft - terug bij null', () => {
    expect(formatEuro(null)).toBe('-');
  });

  it('geeft - terug bij undefined', () => {
    expect(formatEuro(undefined)).toBe('-');
  });

  it('formatteert een bedrag als euro', () => {
    const result = formatEuro(12.5);
    expect(result).toContain('12');
    expect(result).toContain('€');
  });
});

describe('toDateInputValue', () => {
  it('geeft YYYY-MM-DD formaat terug', () => {
    const result = toDateInputValue(new Date('2024-03-09T00:00:00Z'));
    expect(result).toBe('2024-03-09');
  });
});

describe('formatLastUpdated', () => {
  it('bevat de dag van de week met hoofdletter', () => {
    const date = new Date('2024-03-05T21:45:00'); // dinsdag
    const result = formatLastUpdated(date);
    expect(result.charAt(0)).toMatch(/[A-Z]/);
  });

  it('bevat "om" en eindigt op "u"', () => {
    const date = new Date('2024-03-05T21:45:00');
    const result = formatLastUpdated(date);
    expect(result).toContain(' om ');
    expect(result.endsWith('u')).toBe(true);
  });

  it('bevat het juiste dagnummer', () => {
    const date = new Date('2024-03-09T10:00:00');
    const result = formatLastUpdated(date);
    expect(result).toContain('9');
  });
});
