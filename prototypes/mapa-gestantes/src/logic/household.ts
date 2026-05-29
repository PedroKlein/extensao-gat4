/**
 * Household grouping — detect patients at the same address.
 */

import type { GestanteWithUrgency } from '../main';

export interface HouseholdGroup {
  key: string; // "rua|numero"
  members: GestanteWithUrgency[];
}

/**
 * Groups patients by exact address (street + number).
 * Returns only groups with 2+ members.
 */
export function detectHouseholds(items: GestanteWithUrgency[]): HouseholdGroup[] {
  const map = new Map<string, GestanteWithUrgency[]>();

  for (const item of items) {
    const key = `${item.gestante.endereco.rua}|${item.gestante.endereco.numero}`;
    const group = map.get(key) || [];
    group.push(item);
    map.set(key, group);
  }

  return Array.from(map.entries())
    .filter(([_, members]) => members.length >= 2)
    .map(([key, members]) => ({ key, members }));
}
