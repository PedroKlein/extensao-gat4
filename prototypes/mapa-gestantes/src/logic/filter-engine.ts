/**
 * Filter engine — pure logic for combining filters.
 */

import type { Gestante, UrgencyCategory } from '../models';
import { calculateIG, getTrimester } from '../logic/dates';

export interface FilterState {
  urgency: Set<UrgencyCategory>;
  apenasExpostas: boolean;
  trimestres: Set<1 | 2 | 3 | 'puerpera'>;
  microareas: Set<string>;
  diasSemConsultaMin: number; // 0 = no filter
}

export function createDefaultFilterState(): FilterState {
  return {
    urgency: new Set(['critico', 'atencao', 'normal']),
    apenasExpostas: false,
    trimestres: new Set([1, 2, 3, 'puerpera']),
    microareas: new Set(['MA1', 'MA2', 'MA3', 'MA4', 'MA5']),
    diasSemConsultaMin: 0,
  };
}

export function matchesFilter(
  gestante: Gestante,
  urgencyCategory: UrgencyCategory,
  diasSemConsulta: number,
  filters: FilterState
): boolean {
  // Urgency filter
  if (!filters.urgency.has(urgencyCategory)) return false;

  // Expostas filter
  if (filters.apenasExpostas && !gestante.isExposta) return false;

  // Trimester filter
  if (gestante.isPuerpera) {
    if (!filters.trimestres.has('puerpera')) return false;
  } else {
    const igWeeks = calculateIG(gestante.consultas.dum);
    const tri = getTrimester(igWeeks);
    if (!filters.trimestres.has(tri)) return false;
  }

  // Microárea filter
  if (!filters.microareas.has(gestante.microarea)) return false;

  // Temporal filter (slider)
  if (filters.diasSemConsultaMin > 0 && diasSemConsulta < filters.diasSemConsultaMin) return false;

  return true;
}
