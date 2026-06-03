/**
 * Detail panel — shows full patient info when a marker is clicked.
 */

import type { Gestante, UrgencyResult, UrgencyCategory } from '../models';
import { calculateAge, calculateIG, distanceMeters, daysSince } from '../logic/dates';
import { acronymHtml } from '../data/acronyms';
import { getScoreBreakdown, SCORE_EXPLANATION } from '../logic/urgency';
import { MICROAREA_ACS, MICROAREA_COLORS } from './microarea-layer';

const US_MOAB_LAT = -30.0692745;
const US_MOAB_LNG = -51.2166063;

const URGENCY_COLORS: Record<UrgencyCategory, string> = {
  critico: '#dc2626',
  atencao: '#d97706',
  normal: '#16a34a',
};

const URGENCY_LABELS: Record<UrgencyCategory, string> = {
  critico: 'Crítico',
  atencao: 'Atenção',
  normal: 'Normal',
};

let panelEl: HTMLElement | null = null;

export function initDetailPanel(): void {
  panelEl = document.createElement('div');
  panelEl.id = 'detail-panel';
  panelEl.className = 'fixed top-0 right-0 h-full w-96 max-w-[90vw] bg-white shadow-2xl z-[1000] transform translate-x-full transition-transform duration-300 overflow-y-auto';
  panelEl.innerHTML = '';
  document.body.appendChild(panelEl);
}

export function showDetailPanel(gestante: Gestante, urgency: UrgencyResult): void {
  if (!panelEl) return;

  const age = calculateAge(gestante.dataNascimento);
  const igWeeks = gestante.isPuerpera ? null : calculateIG(gestante.consultas.dum);
  const diasSemConsulta = daysSince(gestante.consultas.dataUltimaConsulta);
  const distUS = distanceMeters(
    gestante.endereco.lat, gestante.endereco.lng,
    US_MOAB_LAT, US_MOAB_LNG
  );
  const color = URGENCY_COLORS[urgency.category];

  // DPP info
  const dpp = new Date(gestante.consultas.dpp);
  const diasParaDpp = Math.ceil((dpp.getTime() - Date.now()) / (1000 * 60 * 60 * 24));

  const scoreBreakdown = getScoreBreakdown(urgency.alerts);

  panelEl.innerHTML = `
    <div class="p-4">
      <!-- Header -->
      <div class="flex items-center justify-between mb-4">
        <button id="close-panel" class="text-gray-400 hover:text-gray-600 text-2xl leading-none">&times;</button>
        <span class="px-3 py-1 rounded-full text-white text-xs font-semibold" style="background:${color}">
          ${URGENCY_LABELS[urgency.category]} (${urgency.score} pts)
        </span>
      </div>

      <!-- Score breakdown (if any) -->
      ${urgency.score > 0 ? `
      <div class="mb-4 p-2 bg-slate-50 rounded-lg border border-slate-200">
        <div class="flex items-center justify-between">
          <p class="text-xs font-semibold text-slate-600">Composição do score:</p>
          <button id="score-help-btn" class="text-xs text-blue-500 hover:text-blue-700">Como funciona?</button>
        </div>
        <div class="flex flex-wrap gap-1 mt-1">
          ${scoreBreakdown.map(s => `<span class="text-xs bg-slate-200 text-slate-700 px-2 py-0.5 rounded">${s}</span>`).join('')}
        </div>
        <div id="score-help" class="hidden mt-2 pt-2 border-t border-slate-200">
          <p class="text-xs text-slate-500 mb-1">O score soma pontos por cada fator de risco:</p>
          <div class="grid grid-cols-2 gap-x-2 gap-y-0.5">
            ${SCORE_EXPLANATION.map(e => `<span class="text-xs text-slate-500">${e.fator}</span><span class="text-xs text-slate-700 font-mono text-right">${e.pontos}</span>`).join('')}
          </div>
          <p class="text-xs text-slate-400 mt-1">🟢 0–10 = Normal | 🟡 11–30 = Atenção | 🔴 31+ = Crítico</p>
        </div>
      </div>
      ` : ''}

      <!-- Identification -->
      <div class="mb-4">
        <h2 class="text-lg font-bold text-gray-800">${gestante.nome}</h2>
        <p class="text-sm text-gray-500">${age} anos • ${acronymHtml('CNS')}: ${gestante.cns}</p>
        <p class="text-sm text-gray-500">📞 ${gestante.telefone}</p>
        <p class="text-sm text-gray-500">📍 ${gestante.endereco.rua}, ${gestante.endereco.numero}${gestante.endereco.complemento ? ' - ' + gestante.endereco.complemento : ''}</p>
        <p class="text-xs text-gray-400 mt-1">Microárea: ${gestante.microarea} • Distância ${acronymHtml('US')}: ${distUS > 1000 ? (distUS / 1000).toFixed(1) + ' km' : distUS + ' m'} (~${Math.ceil(distUS / 80)} min caminhando)</p>
      </div>

      <!-- Pregnancy info -->
      <div class="mb-4 p-3 bg-blue-50 rounded-lg">
        <h3 class="text-sm font-semibold text-blue-800 mb-2">🤰 Gestação</h3>
        ${gestante.isPuerpera ? `
          <p class="text-sm"><span class="font-medium">Puérpera</span> — parto em ${formatDate(gestante.consultas.dpp)}</p>
        ` : `
          <div class="grid grid-cols-3 gap-2 text-center">
            <div class="bg-white rounded p-2">
              <div class="text-lg font-bold text-blue-700">${igWeeks}</div>
              <div class="text-xs text-gray-500">${acronymHtml('IG')} (sem)</div>
            </div>
            <div class="bg-white rounded p-2">
              <div class="text-lg font-bold ${diasParaDpp < 30 ? 'text-orange-600' : 'text-blue-700'}">${diasParaDpp > 0 ? diasParaDpp : 0}</div>
              <div class="text-xs text-gray-500">dias p/ ${acronymHtml('DPP')}</div>
            </div>
            <div class="bg-white rounded p-2">
              <div class="text-lg font-bold ${diasSemConsulta > 30 ? 'text-red-600' : 'text-blue-700'}">${diasSemConsulta}</div>
              <div class="text-xs text-gray-500">dias s/ consulta</div>
            </div>
          </div>
          <p class="text-xs text-gray-500 mt-2">${acronymHtml('DUM')}: ${formatDate(gestante.consultas.dum)} • ${acronymHtml('DPP')}: ${formatDate(gestante.consultas.dpp)}</p>
        `}
      </div>

      <!-- Consultations -->
      <div class="mb-4 p-3 bg-gray-50 rounded-lg">
        <h3 class="text-sm font-semibold text-gray-700 mb-2">📋 Consultas</h3>
        <div class="text-sm space-y-1">
          <p>Última consulta: <strong>${formatDate(gestante.consultas.dataUltimaConsulta)}</strong> <span class="text-gray-400">(${diasSemConsulta}d atrás)</span></p>
          <p>Total consultas ${acronymHtml('PN')}: <strong>${gestante.consultas.numeroConsultas}</strong></p>
          <p>${acronymHtml('PA')}: <strong>${gestante.consultas.pressaoArterial}</strong></p>
          <p>${acronymHtml('VD')}: <strong>${gestante.consultas.visitasDomiciliares}</strong> realizada(s)</p>
          <p>Peso/Altura: <strong>${gestante.consultas.acompanhamentoPesoAltura}</strong></p>
        </div>
      </div>

      <!-- Exams -->
      <div class="mb-4 p-3 bg-gray-50 rounded-lg">
        <h3 class="text-sm font-semibold text-gray-700 mb-2">🧪 Exames (${acronymHtml('TR')} / Sorologia)</h3>
        <table class="w-full text-xs">
          <thead>
            <tr class="text-gray-500">
              <th class="text-left py-1">Trimestre</th>
              <th class="text-center py-1">${acronymHtml('HIV')}/Sífilis</th>
            </tr>
          </thead>
          <tbody>
            <tr><td class="py-1">1º trimestre</td><td class="text-center">${examBadge(gestante.exames.trPrimeiroTrimestre)}</td></tr>
            <tr><td class="py-1">2º trimestre</td><td class="text-center">${examBadge(gestante.exames.trSegundoTrimestre)}</td></tr>
            <tr><td class="py-1">3º trimestre</td><td class="text-center">${examBadge(gestante.exames.trTerceiroTrimestre)}</td></tr>
          </tbody>
        </table>
        <div class="mt-2 text-xs space-y-1">
          <p>Avaliação Odonto: ${examBadge(gestante.avaliacaoOdonto === 'Realizada' ? 'Feito' : 'Não Feito')}</p>
          <p>${acronymHtml('DTpa')}: ${examBadge(gestante.vacinaDTpa === 'Realizada' ? 'Feito' : gestante.vacinaDTpa === 'Não se aplica' ? 'N/A' : 'Não Feito')}</p>
        </div>
      </div>

      <!-- Alerts -->
      ${urgency.alerts.length > 0 ? `
      <div class="mb-4 p-3 bg-red-50 rounded-lg border border-red-100">
        <h3 class="text-sm font-semibold text-red-800 mb-2">⚠️ Alertas (${urgency.alerts.length})</h3>
        <ul class="space-y-1">
          ${urgency.alerts.map(a => `
            <li class="text-xs ${a.type === 'critical' ? 'text-red-700' : 'text-amber-700'}">
              ${a.type === 'critical' ? '🔴' : '🟡'} ${a.message}
            </li>
          `).join('')}
        </ul>
      </div>
      ` : `
      <div class="mb-4 p-3 bg-green-50 rounded-lg">
        <p class="text-sm text-green-700">✅ Sem alertas — pré-natal em dia</p>
      </div>
      `}

      <!-- Exposição (if applicable) -->
      ${gestante.isExposta && gestante.exposicao ? renderExposicao(gestante) : ''}

      <!-- Post-natal (if puérpera) -->
      ${gestante.isPuerpera && gestante.posNatal ? `
      <div class="mb-4 p-3 bg-purple-50 rounded-lg">
        <h3 class="text-sm font-semibold text-purple-800 mb-2">👶 Pós-parto</h3>
        <div class="text-xs space-y-1">
          <p>Consulta puerpério: ${gestante.posNatal.consultaPuerperio ? '✅ Realizada' : '❌ Pendente'}</p>
          <p>${acronymHtml('VD')} pós-natal: ${gestante.posNatal.visitaDomiciliarPosNatal ? '✅ Realizada' : '❌ Pendente'}</p>
          <p>Odonto pós-natal: ${gestante.posNatal.avaliacaoOdontoPosNatal ? '✅ Realizada' : '❌ Pendente'}</p>
        </div>
      </div>
      ` : ''}
    </div>
  `;

  // Close button
  panelEl.querySelector('#close-panel')?.addEventListener('click', hideDetailPanel);

  // Score help toggle
  panelEl.querySelector('#score-help-btn')?.addEventListener('click', () => {
    const helpEl = panelEl!.querySelector('#score-help');
    if (helpEl) helpEl.classList.toggle('hidden');
  });

  // Show panel
  panelEl.classList.remove('translate-x-full');
}

export function hideDetailPanel(): void {
  if (!panelEl) return;
  panelEl.classList.add('translate-x-full');
}

function renderExposicao(g: Gestante): string {
  const exp = g.exposicao!;
  let html = `<div class="mb-4 p-3 bg-red-50 rounded-lg border border-red-200">
    <h3 class="text-sm font-semibold text-red-800 mb-2">🔬 Tratamento — Gestante Exposta</h3>`;

  if (exp.hiv) {
    html += `
      <div class="mb-2">
        <p class="text-xs font-medium text-red-700">${acronymHtml('HIV')}</p>
        <p class="text-xs">Carga viral: ${exp.hiv.cargaViral}</p>
        <p class="text-xs">${acronymHtml('CD4')}: ${exp.hiv.cd4}</p>
        <p class="text-xs">${acronymHtml('TARV')}: ${exp.hiv.tarvIniciado ? `✅ Iniciado${exp.hiv.dataTarv ? ' em ' + formatDate(exp.hiv.dataTarv) : ''}` : '❌ Não iniciado'}</p>
      </div>`;
  }

  if (exp.sifilis) {
    const doses = [exp.sifilis.dataPrimeiraDose, exp.sifilis.dataSegundaDose, exp.sifilis.dataTerceiraDose].filter(Boolean).length;
    html += `
      <div class="mb-2">
        <p class="text-xs font-medium text-red-700">Sífilis (${exp.sifilis.tipoSifilis || 'tipo não definido'})</p>
        <p class="text-xs">${acronymHtml('VDRL')}: ${exp.sifilis.resultadoVDRL || 'Aguardando'}</p>
        <p class="text-xs">Doses penicilina: ${doses}/3 ${doses >= 3 ? '✅' : '⏳'}</p>
        <p class="text-xs">Controle ${acronymHtml('VDRL')}: ${exp.sifilis.vdrlControleRealizado ? '✅' : '❌'}</p>
      </div>`;
  }

  if (exp.hepatiteB) {
    const doses = [exp.hepatiteB.dataPrimeiraDoseVacina, exp.hepatiteB.dataSegundaDoseVacina, exp.hepatiteB.dataTerceiraDoseVacina].filter(Boolean).length;
    html += `
      <div class="mb-2">
        <p class="text-xs font-medium text-red-700">${acronymHtml('HepB')}</p>
        <p class="text-xs">${acronymHtml('Anti-HBs')}: ${exp.hepatiteB.resultadoAntiHBs || 'Aguardando'}</p>
        <p class="text-xs">Vacina: ${doses}/3 doses ${doses >= 3 ? '✅' : '⏳'}</p>
      </div>`;
  }

  html += '</div>';
  return html;
}

function examBadge(status: string): string {
  if (status === 'Feito') return '<span class="text-green-600 font-medium">✓ Feito</span>';
  if (status === 'Não Feito') return '<span class="text-red-600 font-medium">✗ Pendente</span>';
  return '<span class="text-gray-400">N/A</span>';
}

function formatDate(iso: string): string {
  if (!iso) return '—';
  const [y, m, d] = iso.split('-');
  return `${d}/${m}/${y}`;
}

/**
 * Shows the US Moab territory overview in the side panel.
 */
export function showUSPanel(items: { gestante: { microarea: string; isExposta: boolean; isPuerpera: boolean; consultas: { dpp: string } }; urgency: { category: UrgencyCategory } }[]): void {
  if (!panelEl) return;

  const total = items.length;
  const criticas = items.filter(i => i.urgency.category === 'critico').length;
  const atencao = items.filter(i => i.urgency.category === 'atencao').length;
  const normais = items.filter(i => i.urgency.category === 'normal').length;
  const expostas = items.filter(i => i.gestante.isExposta).length;
  const puerperas = items.filter(i => i.gestante.isPuerpera).length;
  const percentEmDia = total > 0 ? Math.round((normais / total) * 100) : 0;

  // DPP próxima (<30 dias)
  const now = Date.now();
  const dppProximas = items.filter(i => {
    if (i.gestante.isPuerpera) return false;
    const dpp = new Date(i.gestante.consultas.dpp).getTime();
    const dias = (dpp - now) / (1000 * 60 * 60 * 24);
    return dias > 0 && dias <= 30;
  }).length;

  // By microárea
  const byMA: Record<string, { total: number; criticas: number }> = {};
  for (const i of items) {
    const ma = i.gestante.microarea;
    if (!byMA[ma]) byMA[ma] = { total: 0, criticas: 0 };
    byMA[ma].total++;
    if (i.urgency.category === 'critico') byMA[ma].criticas++;
  }

  panelEl.innerHTML = `
    <div class="p-4">
      <!-- Header -->
      <div class="flex items-center justify-between mb-4">
        <button id="close-panel" class="text-gray-400 hover:text-gray-600 text-2xl leading-none">&times;</button>
        <span class="px-3 py-1 rounded-full bg-blue-600 text-white text-xs font-semibold">
          Unidade de Saúde
        </span>
      </div>

      <!-- US Info -->
      <div class="mb-4">
        <h2 class="text-lg font-bold text-gray-800">US Moab Caldas</h2>
        <p class="text-sm text-gray-500">Clínica da Família Moab Caldas</p>
        <p class="text-sm text-gray-500">📍 Av. Moab Caldas, 400 — Santa Tereza</p>
        <p class="text-sm text-gray-500">Porto Alegre / RS</p>
        <p class="text-xs text-gray-400 mt-1">Gestão: Rede de Saúde da Divina Providência</p>
        <p class="text-xs text-gray-400">Equipe foco: Equipe 4 de ESF</p>
      </div>

      <!-- Territory stats -->
      <div class="mb-4 p-3 bg-blue-50 rounded-lg">
        <h3 class="text-sm font-semibold text-blue-800 mb-3">📊 Território — Resumo</h3>
        <div class="grid grid-cols-3 gap-2 text-center mb-3">
          <div class="bg-white rounded p-2">
            <div class="text-xl font-bold text-gray-800">${total}</div>
            <div class="text-xs text-gray-500">Gestantes</div>
          </div>
          <div class="bg-white rounded p-2">
            <div class="text-xl font-bold text-green-600">${percentEmDia}%</div>
            <div class="text-xs text-gray-500">Em dia</div>
          </div>
          <div class="bg-white rounded p-2">
            <div class="text-xl font-bold text-orange-600">${dppProximas}</div>
            <div class="text-xs text-gray-500">DPP 30d</div>
          </div>
        </div>
        <div class="grid grid-cols-3 gap-2 text-center">
          <div class="bg-white rounded p-2">
            <div class="text-lg font-bold text-red-600">${criticas}</div>
            <div class="text-xs text-gray-500">🔴 Críticas</div>
          </div>
          <div class="bg-white rounded p-2">
            <div class="text-lg font-bold text-amber-600">${atencao}</div>
            <div class="text-xs text-gray-500">🟡 Atenção</div>
          </div>
          <div class="bg-white rounded p-2">
            <div class="text-lg font-bold text-green-600">${normais}</div>
            <div class="text-xs text-gray-500">🟢 Normais</div>
          </div>
        </div>
      </div>

      <!-- Expostas + Puérperas -->
      <div class="mb-4 p-3 bg-red-50 rounded-lg">
        <h3 class="text-sm font-semibold text-red-800 mb-2">⚠️ Atenção especial</h3>
        <div class="text-sm space-y-1">
          <p><strong>${expostas}</strong> gestante(s) exposta(s) (HIV/Sífilis/HepB)</p>
          <p><strong>${puerperas}</strong> puérpera(s) em acompanhamento</p>
          <p><strong>${dppProximas}</strong> parto(s) previsto(s) nos próximos 30 dias</p>
        </div>
      </div>

      <!-- By ACS -->
      <div class="mb-4 p-3 bg-gray-50 rounded-lg">
        <h3 class="text-sm font-semibold text-gray-700 mb-2">🗂️ Por <span title="Agente Comunitário(a) de Saúde" style="border-bottom:1px dotted #888;cursor:help">ACS</span></h3>
        <div class="space-y-1">
          ${Object.entries(byMA).sort(([a], [b]) => a.localeCompare(b)).map(([ma, stats]) => {
            const acsName = MICROAREA_ACS[ma] || ma;
            const color = MICROAREA_COLORS[ma] || '#888';
            return `
            <div class="flex items-center justify-between text-xs">
              <span class="flex items-center gap-1.5"><span class="w-2.5 h-2.5 rounded" style="background:${color};display:inline-block"></span>${acsName}</span>
              <span><strong>${stats.total}</strong> gestantes ${stats.criticas > 0 ? `<span class="text-red-600">(🔴 ${stats.criticas})</span>` : ''}</span>
            </div>
          `;
          }).join('')}
        </div>
      </div>
    </div>
  `;

  // Close button
  panelEl.querySelector('#close-panel')?.addEventListener('click', hideDetailPanel);

  // Show panel
  panelEl.classList.remove('translate-x-full');
}
