/**
 * Search component — find patient by name or CNS.
 */

import type { GestanteWithUrgency } from '../main';
import { selectGestante } from '../main';
import { showDetailPanel } from './detail-panel';
import L from 'leaflet';

let searchEl: HTMLElement | null = null;
let allItems: GestanteWithUrgency[] = [];
let mapRef: L.Map | null = null;

export function initSearch(container: HTMLElement, map: L.Map, items: GestanteWithUrgency[]): void {
  mapRef = map;
  allItems = items;

  searchEl = document.createElement('div');
  searchEl.id = 'search-box';
  searchEl.className = 'absolute top-3 left-1/2 -translate-x-1/2 z-[1100] w-96 max-w-[50vw]';
  searchEl.innerHTML = `
    <div class="relative">
      <input
        type="text"
        id="search-input"
        placeholder="Buscar por nome ou CNS..."
        class="w-full px-4 py-2 pl-9 rounded-lg bg-white shadow-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
    </div>
    <div id="search-results" class="mt-1 bg-white rounded-lg shadow-lg overflow-hidden hidden"></div>
  `;
  container.appendChild(searchEl);

  const input = searchEl.querySelector('#search-input') as HTMLInputElement;
  input.addEventListener('input', () => handleSearch(input.value));
  input.addEventListener('blur', () => {
    // Delay to allow click on results
    setTimeout(() => {
      const results = searchEl!.querySelector('#search-results')!;
      results.classList.add('hidden');
    }, 200);
  });
  input.addEventListener('focus', () => {
    if (input.value.length >= 2) handleSearch(input.value);
  });
}

function handleSearch(query: string): void {
  const results = searchEl!.querySelector('#search-results')!;

  if (query.length < 2) {
    results.classList.add('hidden');
    return;
  }

  const q = query.toLowerCase();
  const matches = allItems.filter(item =>
    item.gestante.nome.toLowerCase().includes(q) ||
    item.gestante.cns.includes(q)
  ).slice(0, 5);

  if (matches.length === 0) {
    results.innerHTML = '<p class="p-3 text-xs text-gray-500">Nenhum resultado</p>';
    results.classList.remove('hidden');
    return;
  }

  results.innerHTML = matches.map(item => `
    <div class="search-result px-3 py-2 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-0" data-id="${item.gestante.id}">
      <p class="text-sm font-medium text-gray-800">${item.gestante.nome}</p>
      <p class="text-xs text-gray-500">${item.gestante.endereco.rua} • ${item.gestante.microarea}</p>
    </div>
  `).join('');
  results.classList.remove('hidden');

  // Bind clicks
  results.querySelectorAll('.search-result').forEach(el => {
    el.addEventListener('mousedown', (e) => {
      e.preventDefault(); // Prevent blur
      const id = (el as HTMLElement).dataset.id;
      const item = allItems.find(i => i.gestante.id === id);
      if (item && mapRef) {
        selectGestante(id!);
        mapRef.setView([item.gestante.endereco.lat, item.gestante.endereco.lng], 17, { animate: true });
        showDetailPanel(item.gestante, item.urgency);
        results.classList.add('hidden');
        (searchEl!.querySelector('#search-input') as HTMLInputElement).value = '';
      }
    });
  });
}
