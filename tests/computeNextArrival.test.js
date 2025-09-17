const { computeNextArrival, toHM } = require('../utils');

describe('computeNextArrival', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2025-09-17T10:00:00Z'));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test('devrait retourner le prochain passage +3 min au format HH:MM', () => {
    const result = computeNextArrival(undefined, 3);
    expect(result.nextArrival).toMatch(/^\d{2}:\d{2}$/);
    expect(result.headwayMin).toBe(3);
  });

  test('devrait utiliser HEADWAY_MIN par défaut si non spécifié', () => {
    const result = computeNextArrival();
    expect(result.nextArrival).toMatch(/^\d{2}:\d{2}$/);
    expect(result.headwayMin).toBe(3);
  });

  test('devrait retourner une erreur si headway est invalide (≤0)', () => {
    const result = computeNextArrival(undefined, 0);
    expect(result).toEqual({
      service: 'closed',
      error: 'headway invalide',
      tz: 'Europe/Paris'
    });
  });

  test('toHM devrait retourner une heure au format HH:MM', () => {
    const date = new Date('2025-09-17T10:05:00Z');
    const result = toHM(date);
    expect(result).toBe('12:05');
  });
});
