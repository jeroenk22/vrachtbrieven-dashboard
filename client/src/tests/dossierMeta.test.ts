// ============================================================
// dossierMeta.test.ts
// Tests voor formatRouteName en countryIso
// ============================================================

import { describe, it, expect } from 'vitest';
import { formatRouteName, countryIso } from '../utils/dossierMeta';

// ------------------------------------------------------------
// formatRouteName
// ------------------------------------------------------------
describe('formatRouteName', () => {
  it('converteert genummerde route naar "Route N"', () => {
    expect(formatRouteName('01 - Noord-Holland')).toBe('Route 1');
    expect(formatRouteName('22 - Eurofins Drenthe/Groningen')).toBe('Route 22');
    expect(formatRouteName('99 - Extra route')).toBe('Route 99');
  });

  it('stript "route" suffix', () => {
    expect(formatRouteName('Testroute')).toBe('Route Test');
    expect(formatRouteName('Brabant route')).toBe('Route Brabant');
  });

  it('stript "route" case-insensitive', () => {
    expect(formatRouteName('TestRoute')).toBe('Route Test');
    expect(formatRouteName('TESTROUTE')).toBe('Route TEST');
  });

  it('gebruikt de volledige naam als er geen nummer of "route" in zit', () => {
    expect(formatRouteName('Speciaal')).toBe('Route Speciaal');
  });
});

// ------------------------------------------------------------
// countryIso
// ------------------------------------------------------------
describe('countryIso', () => {
  it('geeft null terug voor null-input', () => {
    expect(countryIso(null)).toBeNull();
  });

  it('geeft null terug voor onbekend land', () => {
    expect(countryIso('Atlantis')).toBeNull();
  });

  it('herkent Nederlandse landnamen correct', () => {
    expect(countryIso('Nederland')).toBe('NL');
    expect(countryIso('Netherlands')).toBe('NL');
    expect(countryIso('Belgie')).toBe('BE');
    expect(countryIso('België')).toBe('BE');
    expect(countryIso('Belgium')).toBe('BE');
    expect(countryIso('Duitsland')).toBe('DE');
    expect(countryIso('Frankrijk')).toBe('FR');
    expect(countryIso('Luxemburg')).toBe('LU');
    expect(countryIso('Spanje')).toBe('ES');
    expect(countryIso('Italië')).toBe('IT');
    expect(countryIso('Engeland')).toBe('GB');
    expect(countryIso('Verenigd Koninkrijk')).toBe('GB');
    expect(countryIso('Ierland')).toBe('IE');
    expect(countryIso('Denemarken')).toBe('DK');
    expect(countryIso('Zweden')).toBe('SE');
    expect(countryIso('Zwitserland')).toBe('CH');
    expect(countryIso('Oostenrijk')).toBe('AT');
    expect(countryIso('Polen')).toBe('PL');
    expect(countryIso('Tsjechië')).toBe('CZ');
    expect(countryIso('Bulgarije')).toBe('BG');
    expect(countryIso('Verenigde Staten')).toBe('US');
  });

  it('is case-insensitief', () => {
    expect(countryIso('NEDERLAND')).toBe('NL');
    expect(countryIso('belgie')).toBe('BE');
    expect(countryIso('DUITSLAND')).toBe('DE');
  });

  it('trimt witruimte', () => {
    expect(countryIso('  Nederland  ')).toBe('NL');
    expect(countryIso(' België ')).toBe('BE');
  });
});
