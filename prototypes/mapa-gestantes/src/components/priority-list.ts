/**
 * Priority list — sidebar showing all gestantes sorted by urgency score.
 * Rich display with icons, colors, and key info.
 */

import type { UrgencyCategory } from '../models';
import type { GestanteWithUrgency } from '../main';
import { selectGestante, URGENCY_COLORS } from '../main';
import { showDetailPanel } from './detail-panel';
import { calculateIG } from '../logic/dates';
import { getScoreBreakdown } from '../logic/urgency';
import L from 'leaflet';

const URGENCY_ICONS: Record<UrgencyCategory, string> = {
  critico: '🔴',
  atencao: '🟡',
  normal: '🟢',
};

let listEl: HTMLElement | null = null;
let mapRef: L.Map | null = null;

export function initPriorityList(container: HTMLElement, map: L.Map): void {
  mapRef = map;
  listEl = document.createElement('div');
  listEl.id = 'priority-list';
  listEl.className = 'absolute top-4 right-4 z-[900] bg-white rounded-lg shadow-lg w-80 max-h-[60vh] overflow-hidden flex flex-col';
  listEl.innerHTML = `
    <div class="p-3 border-b border-gray-200 flex items-center justify-between">
      <div>
        <h3 class="font-bold text-gray-800 text-sm">📋 Prioridades</h3>
        <p class="text-xs text-gray-500" id="list-count">0 gestantes</p>
      </div>
      <button id="toggle-list" class="text-gray-400 hover:text-gray-600 text-lg">▼</button>
    </div>
    <div id="list-items" class="overflow-y-auto flex-1"></div>
  `;
  container.appendChild(listEl);

  // Toggle collapse
  listEl.querySelector('#toggle-list')?.addEventListener('click', () => {
    const items = listEl!.querySelector('#list-items') as HTMLElement;
    const btn = listEl!.querySelector('#toggle-list') as HTMLElement;
    if (items.style.display === 'none') {
      items.style.display = '';
      btn.textContent = '▼';
    } else {
      items.style.display = 'none';
      btn.textContent = '▶';
    }
  });
}

export function updatePriorityList(items: GestanteWithUrgency[]): void {
  if (!listEl) return;

  // Sort by score descending
  const sorted = [...items].sort((a, b) => b.urgency.score - a.urgency.score);

  const countEl = listEl.querySelector('#list-count');
  if (countEl) countEl.textContent = `${sorted.length} gestantes`;

  const listItems = listEl.querySelector('#list-items')!;
  listItems.innerHTML = sorted.map(item => {
    const g = item.gestante;
    const color = URGENCY_COLORS[item.urgency.category];
    const icon = URGENCY_ICONS[item.urgency.category];

    // Key info per patient
    let statusLine: string;
    if (g.isPuerpera) {
      statusLine = '👶 Puérpera';
    } else {
      const ig = calculateIG(g.consultas.dum);
      statusLine = `${ig} sem • ${ig <= 13 ? '1º tri' : ig <= 27 ? '2º tri' : '3º tri'}`;
    }

    // Alert summary
    const alertCount = item.urgency.alerts.length;
    const topAlert = item.urgency.alerts[0]?.message || '';

    // Days since last consultation
    const diasInfo = item.diasSemConsulta > 14
      ? `<span class="text-red-600 font-medium">${item.diasSemConsulta}d s/ consulta</span>`
      : '';

    // Score breakdown for tooltip
    const breakdown = getScoreBreakdown(item.urgency.alerts);
    const tooltipText = breakdown.length > 0 ? breakdown.join(' | ') : 'Sem alertas';

    return `
      <div class="list-item px-3 py-2.5 border-b border-gray-50 hover:bg-blue-50 cursor-pointer transition-colors" data-id="${g.id}" style="border-left:3px solid ${color}">
        <div class="flex items-start gap-2">
          <span class="text-sm flex-shrink-0 mt-0.5">${icon}</span>
          <div class="flex-1 min-w-0">
            <div class="flex items-center justify-between">
              <p class="text-xs font-semibold text-gray-800 truncate">${g.nome}</p>
              <span class="text-xs font-mono px-1.5 py-0.5 rounded text-white flex-shrink-0 ml-1 cursor-help" style="background:${color};font-size:10px" title="${tooltipText}">${item.urgency.score}</span>
            </div>
            <p class="text-xs text-gray-500 mt-0.5">${statusLine}${g.isExposta ? ' • <span class="text-red-600 font-medium">Exposta</span>' : ''}</p>
            ${diasInfo ? `<p class="text-xs mt-0.5">${diasInfo}</p>` : ''}
            ${alertCount > 0 ? `<p class="text-xs text-gray-400 mt-0.5 truncate">⚠ ${topAlert}</p>` : ''}
          </div>
        </div>
      </div>
    `;
  }).join('');

  // Bind click events
  listItems.querySelectorAll('.list-item').forEach(el => {
    el.addEventListener('click', () => {
      const id = (el as HTMLElement).dataset.id!;
      const item = items.find(i => i.gestante.id === id);
      if (item && mapRef) {
        selectGestante(id);
        mapRef.setView([item.gestante.endereco.lat, item.gestante.endereco.lng], 17, { animate: true });
        showDetailPanel(item.gestante, item.urgency);
      }
    });
  });
}
