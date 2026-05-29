/**
 * Stats dashboard — summary cards showing aggregate statistics.
 */

import type { GestanteWithUrgency } from '../main';

let dashEl: HTMLElement | null = null;

export function initStatsDashboard(container: HTMLElement): void {
  dashEl = document.createElement('div');
  dashEl.id = 'stats-dashboard';
  dashEl.className = 'absolute bottom-4 left-4 z-[900] bg-white rounded-lg shadow-lg p-3 w-auto';
  dashEl.innerHTML = '';
  container.appendChild(dashEl);
}

export function updateStatsDashboard(items: GestanteWithUrgency[]): void {
  if (!dashEl) return;

  const total = items.length;
  const criticas = items.filter(i => i.urgency.category === 'critico').length;
  const atencao = items.filter(i => i.urgency.category === 'atencao').length;
  const normais = items.filter(i => i.urgency.category === 'normal').length;
  const expostas = items.filter(i => i.gestante.isExposta).length;

  // DPP próxima (< 30 dias)
  const now = Date.now();
  const dppProximas = items.filter(i => {
    if (i.gestante.isPuerpera) return false;
    const dpp = new Date(i.gestante.consultas.dpp).getTime();
    const diasRestantes = (dpp - now) / (1000 * 60 * 60 * 24);
    return diasRestantes > 0 && diasRestantes <= 30;
  }).length;

  const percentEmDia = total > 0 ? Math.round((normais / total) * 100) : 0;

  dashEl.innerHTML = `
    <div class="flex gap-3 items-center">
      <div class="text-center px-2">
        <div class="text-lg font-bold text-gray-800">${total}</div>
        <div class="text-xs text-gray-500">Total</div>
      </div>
      <div class="w-px h-8 bg-gray-200"></div>
      <div class="text-center px-2">
        <div class="text-lg font-bold text-red-600">${criticas}</div>
        <div class="text-xs text-gray-500">Críticas</div>
      </div>
      <div class="text-center px-2">
        <div class="text-lg font-bold text-amber-600">${atencao}</div>
        <div class="text-xs text-gray-500">Atenção</div>
      </div>
      <div class="text-center px-2">
        <div class="text-lg font-bold text-green-600">${normais}</div>
        <div class="text-xs text-gray-500">Normal</div>
      </div>
      <div class="w-px h-8 bg-gray-200"></div>
      <div class="text-center px-2">
        <div class="text-lg font-bold text-green-600">${percentEmDia}%</div>
        <div class="text-xs text-gray-500">Em dia</div>
      </div>
      <div class="text-center px-2">
        <div class="text-lg font-bold text-orange-600">${dppProximas}</div>
        <div class="text-xs text-gray-500">DPP 30d</div>
      </div>
      <div class="text-center px-2">
        <div class="text-lg font-bold text-red-600">${expostas}</div>
        <div class="text-xs text-gray-500">Expostas</div>
      </div>
    </div>
  `;
}
