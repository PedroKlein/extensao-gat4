/**
 * Detail panel — shows full patient info when a marker is clicked.
 */

import type { Gestante, UrgencyResult, UrgencyCategory } from '../models';
import { calculateAge, calculateIG, distanceMeters, daysSince } from '../logic/dates';
import { acronymHtml } from '../data/acronyms';

const US_MOAB_LAT = -30.0729573;
const US_MOAB_LNG = -51.2201539;

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

  panelEl.innerHTML = `
    <div class="p-4">
      <!-- Header -->
      <div class="flex items-center justify-between mb-4">
        <button id="close-panel" class="text-gray-400 hover:text-gray-600 text-2xl leading-none">&times;</button>
        <span class="px-3 py-1 rounded-full text-white text-xs font-semibold" style="background:${color}">
          ${URGENCY_LABELS[urgency.category]} (${urgency.score} pts)
        </span>
      </div>

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
