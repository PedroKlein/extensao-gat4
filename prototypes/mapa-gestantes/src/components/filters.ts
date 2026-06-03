/**
 * Filters UI component — renders filter controls and syncs with map.
 * Collapsible with toggle button.
 */

import type { FilterState } from '../logic/filter-engine';
import { createDefaultFilterState } from '../logic/filter-engine';
import { MICROAREA_COLORS, MICROAREA_ACS } from './microarea-layer';

export type FilterChangeCallback = (filters: FilterState) => void;

let filtersEl: HTMLElement | null = null;
const currentFilters: FilterState = createDefaultFilterState();
let onChangeCallback: FilterChangeCallback | null = null;

export function getFilterState(): FilterState {
  return currentFilters;
}

export function initFilters(container: HTMLElement, onChange: FilterChangeCallback): void {
  onChangeCallback = onChange;
  filtersEl = document.createElement('div');
  filtersEl.id = 'filters-panel';
  const isMobile = window.innerWidth < 768;
  filtersEl.className = `absolute top-4 left-4 z-[1000] bg-white rounded-lg shadow-lg w-64 overflow-hidden text-sm ${isMobile ? '' : 'filters-open'}`;
  filtersEl.innerHTML = renderFilters();
  container.appendChild(filtersEl);
  bindEvents();
}

function renderFilters(): string {
  return `
    <!-- Header with toggle -->
    <div class="flex items-center justify-between p-3 border-b border-gray-100 cursor-pointer select-none" id="filters-header">
      <h3 class="font-bold text-gray-800 text-sm">⚙️ Filtros</h3>
      <span id="filters-toggle" class="text-gray-400 text-xs">▼</span>
    </div>

    <!-- Collapsible body -->
    <div id="filters-body" class="p-4 max-h-[70vh] overflow-y-auto">
      <!-- Urgency -->
      <div class="mb-3">
        <p class="font-semibold text-gray-600 text-xs uppercase mb-1">Urgência</p>
        <label class="flex items-center gap-2 py-0.5 cursor-pointer">
          <input type="checkbox" data-filter="urgency" value="critico" checked class="accent-red-600" />
          <span class="w-3 h-3 rounded-full bg-red-600 inline-block"></span>
          <span>Crítico</span>
        </label>
        <label class="flex items-center gap-2 py-0.5 cursor-pointer">
          <input type="checkbox" data-filter="urgency" value="atencao" checked class="accent-amber-600" />
          <span class="w-3 h-3 rounded-full bg-amber-600 inline-block"></span>
          <span>Atenção</span>
        </label>
        <label class="flex items-center gap-2 py-0.5 cursor-pointer">
          <input type="checkbox" data-filter="urgency" value="normal" checked class="accent-green-600" />
          <span class="w-3 h-3 rounded-full bg-green-600 inline-block"></span>
          <span>Normal</span>
        </label>
      </div>

      <!-- Expostas toggle -->
      <div class="mb-3">
        <label class="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" data-filter="expostas" class="accent-red-600" />
          <span>Apenas expostas</span>
        </label>
      </div>

      <!-- Trimester -->
      <div class="mb-3">
        <p class="font-semibold text-gray-600 text-xs uppercase mb-1">Trimestre</p>
        <label class="flex items-center gap-2 py-0.5 cursor-pointer">
          <input type="checkbox" data-filter="trimestre" value="1" checked />
          <span>1º trimestre</span>
        </label>
        <label class="flex items-center gap-2 py-0.5 cursor-pointer">
          <input type="checkbox" data-filter="trimestre" value="2" checked />
          <span>2º trimestre</span>
        </label>
        <label class="flex items-center gap-2 py-0.5 cursor-pointer">
          <input type="checkbox" data-filter="trimestre" value="3" checked />
          <span>3º trimestre</span>
        </label>
        <label class="flex items-center gap-2 py-0.5 cursor-pointer">
          <input type="checkbox" data-filter="trimestre" value="puerpera" checked />
          <span>Puérperas</span>
        </label>
      </div>

      <!-- Microárea -->
      <div class="mb-3">
        <p class="font-semibold text-gray-600 text-xs uppercase mb-1"><span title="Agente Comunitário(a) de Saúde" style="border-bottom:1px dotted #888;cursor:help">ACS</span> responsável</p>
        ${['MA1', 'MA2', 'MA3', 'MA4', 'MA5'].map(ma => {
          const acsName = MICROAREA_ACS[ma] || ma;
          const firstName = acsName.split(' ')[0];
          return `
          <label class="flex items-center gap-2 py-0.5 cursor-pointer">
            <input type="checkbox" data-filter="microarea" value="${ma}" checked />
            <span class="w-3 h-3 rounded inline-block" style="background:${MICROAREA_COLORS[ma] || '#888'}"></span>
            <span>${firstName}</span>
          </label>
        `;
        }).join('')}
      </div>

      <!-- Time slider -->
      <div class="mb-3">
        <p class="font-semibold text-gray-600 text-xs uppercase mb-1">Tempo sem consulta</p>
        <input type="range" data-filter="slider" min="0" max="90" value="0" class="w-full" />
        <p class="text-xs text-gray-500" id="slider-label">Todas (sem filtro)</p>
      </div>

      <!-- Count + Reset -->
      <div class="pt-2 border-t border-gray-200 flex items-center justify-between">
        <p class="text-xs text-gray-500">Mostrando: <strong id="filter-count">0</strong></p>
        <button id="reset-filters" class="text-xs text-blue-600 hover:text-blue-800 font-medium">Limpar</button>
      </div>
    </div>
  `;
}

function bindEvents(): void {
  if (!filtersEl) return;

  // Collapse/expand toggle
  const header = filtersEl.querySelector('#filters-header')!;
  header.addEventListener('click', () => {
    const body = filtersEl!.querySelector('#filters-body') as HTMLElement;
    const toggle = filtersEl!.querySelector('#filters-toggle') as HTMLElement;
    if (body.style.display === 'none' || !filtersEl!.classList.contains('filters-open')) {
      body.style.display = '';
      filtersEl!.classList.add('filters-open');
      toggle.textContent = '▼';
    } else {
      body.style.display = 'none';
      filtersEl!.classList.remove('filters-open');
      toggle.textContent = '▶';
    }
  });

  // Urgency checkboxes
  filtersEl.querySelectorAll('[data-filter="urgency"]').forEach(el => {
    el.addEventListener('change', () => {
      currentFilters.urgency = new Set(
        Array.from(filtersEl!.querySelectorAll('[data-filter="urgency"]:checked'))
          .map(cb => (cb as HTMLInputElement).value as 'critico' | 'atencao' | 'normal')
      );
      emitChange();
    });
  });

  // Expostas toggle
  filtersEl.querySelector('[data-filter="expostas"]')?.addEventListener('change', (e) => {
    currentFilters.apenasExpostas = (e.target as HTMLInputElement).checked;
    emitChange();
  });

  // Trimester checkboxes
  filtersEl.querySelectorAll('[data-filter="trimestre"]').forEach(el => {
    el.addEventListener('change', () => {
      currentFilters.trimestres = new Set(
        Array.from(filtersEl!.querySelectorAll('[data-filter="trimestre"]:checked'))
          .map(cb => {
            const v = (cb as HTMLInputElement).value;
            return v === 'puerpera' ? 'puerpera' : parseInt(v) as 1 | 2 | 3;
          })
      );
      emitChange();
    });
  });

  // Microárea checkboxes
  filtersEl.querySelectorAll('[data-filter="microarea"]').forEach(el => {
    el.addEventListener('change', () => {
      currentFilters.microareas = new Set(
        Array.from(filtersEl!.querySelectorAll('[data-filter="microarea"]:checked'))
          .map(cb => (cb as HTMLInputElement).value)
      );
      emitChange();
    });
  });

  // Reset filters button (feature 7)
  filtersEl.querySelector('#reset-filters')?.addEventListener('click', () => {
    // Reset all checkboxes
    filtersEl!.querySelectorAll('input[type="checkbox"]').forEach(cb => {
      (cb as HTMLInputElement).checked = !cb.hasAttribute('data-filter') || (cb as HTMLInputElement).getAttribute('data-filter') !== 'expostas';
      if ((cb as HTMLInputElement).getAttribute('data-filter') === 'expostas') {
        (cb as HTMLInputElement).checked = false;
      } else {
        (cb as HTMLInputElement).checked = true;
      }
    });
    // Reset slider
    const slider = filtersEl!.querySelector('[data-filter="slider"]') as HTMLInputElement;
    if (slider) { slider.value = '0'; }
    const label = filtersEl!.querySelector('#slider-label');
    if (label) label.textContent = 'Todas (sem filtro)';
    // Reset state
    Object.assign(currentFilters, createDefaultFilterState());
    emitChange();
  });

  // Time slider
  filtersEl.querySelector('[data-filter="slider"]')?.addEventListener('input', (e) => {
    const value = parseInt((e.target as HTMLInputElement).value);
    currentFilters.diasSemConsultaMin = value;
    const label = filtersEl!.querySelector('#slider-label')!;
    if (value === 0) {
      label.textContent = 'Todas (sem filtro)';
    } else {
      label.textContent = `Sem consulta há mais de ${value} dias`;
    }
    emitChange();
  });
}

function emitChange(): void {
  if (onChangeCallback) {
    onChangeCallback({ ...currentFilters });
  }
}

export function updateFilterCount(count: number): void {
  const el = document.getElementById('filter-count');
  if (el) el.textContent = String(count);
}
