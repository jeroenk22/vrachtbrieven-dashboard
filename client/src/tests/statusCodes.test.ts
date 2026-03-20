import { describe, it, expect } from 'vitest';
import { getStatusLabel, STATUS_LABELS, getTaskTypeConfig } from '../config/statusCodes';

describe('STATUS_LABELS', () => {
  it('bevat alle verwachte statuscodes', () => {
    const verwacht = ['1100', '1200', '1300', '1400', '1500', '1600', '1800', '1900'];
    for (const code of verwacht) {
      expect(STATUS_LABELS).toHaveProperty(code);
    }
  });
});

describe('getStatusLabel', () => {
  it('geeft - terug bij null', () => {
    expect(getStatusLabel(null)).toBe('-');
  });

  it('geeft - terug bij undefined', () => {
    expect(getStatusLabel(undefined)).toBe('-');
  });

  it('geeft - terug bij lege string', () => {
    expect(getStatusLabel('')).toBe('-');
  });

  it('vertaalt bekende statuscodes correct', () => {
    expect(getStatusLabel('1100')).toBe('Nog niet geaccepteerd (WL)');
    expect(getStatusLabel('1200')).toBe('Ongepland (K)');
    expect(getStatusLabel('1300')).toBe('Voorgepland (V)');
    expect(getStatusLabel('1400')).toBe('Gepland (P)');
    expect(getStatusLabel('1500')).toBe('Bezig (B)');
    expect(getStatusLabel('1600')).toBe('Gestart (G)');
    expect(getStatusLabel('1800')).toBe('Afgerond (#)');
    expect(getStatusLabel('1900')).toBe('Geannuleerd (X)');
  });

  it('geeft onbekende code ongewijzigd terug', () => {
    expect(getStatusLabel('9999')).toBe('9999');
  });
});

describe('getTaskTypeConfig', () => {
  it('geeft null terug bij null', () => {
    expect(getTaskTypeConfig(null)).toBeNull();
  });

  it('geeft null terug bij undefined', () => {
    expect(getTaskTypeConfig(undefined)).toBeNull();
  });

  it('geeft null terug bij lege string', () => {
    expect(getTaskTypeConfig('')).toBeNull();
  });

  it('herkent type 0 (Wissel) als string', () => {
    expect(getTaskTypeConfig('0')).toMatchObject({ label: 'Wissel', color: 'blue' });
  });

  it('herkent type 0 (Wissel) als number — bugfix falsy 0', () => {
    expect(getTaskTypeConfig(0)).toMatchObject({ label: 'Wissel', color: 'blue' });
  });

  it('herkent type 1 (Laden)', () => {
    expect(getTaskTypeConfig('1')).toMatchObject({ label: 'Laden', color: 'orange' });
  });

  it('herkent type 2 (Lossen)', () => {
    expect(getTaskTypeConfig('2')).toMatchObject({ label: 'Lossen', color: 'green' });
  });

  it('geeft null terug bij onbekend type', () => {
    expect(getTaskTypeConfig('99')).toBeNull();
  });
});
