/**
 * Stats dashboard — summary cards with interactive DPP filter and print button.
 */

import type { GestanteWithUrgency } from '../main';
import { calculateIG } from '../logic/dates';

let dashEl: HTMLElement | null = null;
let currentItems: GestanteWithUrgency[] = [];
let onDppFilter: ((items: GestanteWithUrgency[]) => void) | null = null;

export function initStatsDashboard(container: HTMLElement, dppFilterCallback?: (items: GestanteWithUrgency[]) => void): void {
  onDppFilter = dppFilterCallback || null;
  dashEl = document.createElement('div');
  dashEl.id = 'stats-dashboard';
  dashEl.className = 'absolute bottom-4 left-4 z-[900] bg-white rounded-lg shadow-lg p-3 w-auto';
  dashEl.innerHTML = '';
  container.appendChild(dashEl);
}

export function updateStatsDashboard(items: GestanteWithUrgency[]): void {
  if (!dashEl) return;
  currentItems = items;

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
      <div class="text-center px-2 cursor-pointer hover:bg-orange-50 rounded p-1 transition-colors" id="dpp-filter-card" title="Clique para filtrar gestantes com parto previsto em 30 dias">
        <div class="text-lg font-bold text-orange-600">${dppProximas}</div>
        <div class="text-xs text-gray-500">DPP 30d</div>
      </div>
      <div class="text-center px-2">
        <div class="text-lg font-bold text-red-600">${expostas}</div>
        <div class="text-xs text-gray-500">Expostas</div>
      </div>
      <div class="w-px h-8 bg-gray-200"></div>
      <button id="print-list-btn" class="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded text-xs font-medium text-gray-700 transition-colors" title="Imprimir lista filtrada">
        🖨️ Imprimir
      </button>
    </div>
  `;

  // Feature 5: DPP click filter
  dashEl.querySelector('#dpp-filter-card')?.addEventListener('click', () => {
    if (onDppFilter) {
      const dppItems = currentItems.filter(i => {
        if (i.gestante.isPuerpera) return false;
        const dpp = new Date(i.gestante.consultas.dpp).getTime();
        const dias = (dpp - Date.now()) / (1000 * 60 * 60 * 24);
        return dias > 0 && dias <= 30;
      });
      onDppFilter(dppItems);
    }
  });

  // Feature 3: Print button
  dashEl.querySelector('#print-list-btn')?.addEventListener('click', () => {
    printFilteredList(currentItems);
  });
}

function printFilteredList(items: GestanteWithUrgency[]): void {
  const sorted = [...items].sort((a, b) => b.urgency.score - a.urgency.score);

  const printWindow = window.open('', '_blank');
  if (!printWindow) return;

  const html = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <title>Lista de Gestantes — US Moab Caldas</title>
  <style>
    body { font-family: -apple-system, sans-serif; font-size: 11px; margin: 20px; }
    h1 { font-size: 16px; margin-bottom: 4px; }
    .meta { color: #666; margin-bottom: 12px; }
    table { width: 100%; border-collapse: collapse; }
    th, td { border: 1px solid #ddd; padding: 4px 6px; text-align: left; }
    th { background: #f5f5f5; font-size: 10px; text-transform: uppercase; }
    .critico { background: #fef2f2; }
    .atencao { background: #fffbeb; }
    @media print { body { margin: 10px; } }
  </style>
</head>
<body>
  <h1>📋 Lista de Gestantes — US Moab Caldas</h1>
  <p class="meta">Gerado em ${new Date().toLocaleDateString('pt-BR')} • ${sorted.length} gestantes</p>
  <table>
    <thead>
      <tr>
        <th>Nome</th>
        <th>Endereço</th>
        <th>IG</th>
        <th>Urgência</th>
        <th>Score</th>
        <th>Alertas</th>
        <th>ACS</th>
      </tr>
    </thead>
    <tbody>
      ${sorted.map(item => {
        const g = item.gestante;
        const ig = g.isPuerpera ? 'Puérpera' : calculateIG(g.consultas.dum) + ' sem';
        const urgLabel = item.urgency.category === 'critico' ? '🔴 Crítico' : item.urgency.category === 'atencao' ? '🟡 Atenção' : '🟢 Normal';
        const alerts = item.urgency.alerts.map(a => a.message).join('; ');
        return `<tr class="${item.urgency.category}">
          <td><strong>${g.nome}</strong></td>
          <td>${g.endereco.rua}, ${g.endereco.numero}</td>
          <td>${ig}</td>
          <td>${urgLabel}</td>
          <td>${item.urgency.score}</td>
          <td>${alerts || '—'}</td>
          <td>${g.microarea}</td>
        </tr>`;
      }).join('')}
    </tbody>
  </table>
</body>
</html>`;

  printWindow.document.write(html);
  printWindow.document.close();
  setTimeout(() => printWindow.print(), 300);
}
