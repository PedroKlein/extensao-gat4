/**
 * Engine de cenários clínicos para geração de dados fake.
 * Cada cenário aplica condições específicas à gestante base.
 */

import type { Gestante } from '../src/models/gestante';
import type { DadosExposicao } from '../src/models/exposicao';

export type ScenarioTag =
  | 'normal'
  | 'consulta-atrasada-leve'
  | 'consulta-atrasada-grave'
  | 'exposta-hiv'
  | 'exposta-sifilis'
  | 'exposta-hepb'
  | 'pressao-alta'
  | 'sem-odonto'
  | 'vacina-pendente'
  | 'poucas-consultas'
  | 'dpp-proxima'
  | 'puerpera'
  | 'sem-vd';

export interface ScenarioModification {
  tags: ScenarioTag[];
  apply: (g: Gestante, rng: () => number) => Gestante;
  exposicao?: (rng: () => number) => DadosExposicao;
}

function formatDate(d: Date): string {
  return d.toISOString().split('T')[0];
}

function daysAgo(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return formatDate(d);
}

function weeksAgo(weeks: number): string {
  return daysAgo(weeks * 7);
}

/**
 * Gera um DUM que coloque a gestante no trimestre desejado.
 */
function dumForWeeks(weeks: number): string {
  return weeksAgo(weeks);
}

/**
 * Cenário: tudo em dia
 */
export function scenarioNormal(rng: () => number): ScenarioModification {
  const igWeeks = Math.floor(rng() * 35) + 5; // 5-40 weeks
  return {
    tags: ['normal'],
    apply: (g) => {
      const dum = dumForWeeks(igWeeks);
      const dpp = new Date(dum);
      dpp.setDate(dpp.getDate() + 280);

      g.consultas.dum = dum;
      g.consultas.dpp = formatDate(dpp);
      g.consultas.dataUltimaConsulta = daysAgo(Math.floor(rng() * 12) + 1); // 1-12 days ago
      g.consultas.numeroConsultas = Math.min(Math.floor(igWeeks / 4) + 1, 8);
      g.consultas.pressaoArterial = '120/80';
      g.consultas.visitasDomiciliares = Math.floor(rng() * 3) + 1;
      g.consultas.acompanhamentoPesoAltura = 'Em dia';
      g.avaliacaoOdonto = igWeeks > 12 ? 'Realizada' : 'Agendada';
      g.vacinaDTpa = igWeeks > 20 ? 'Realizada' : 'Não se aplica';

      // Exames in order
      g.exames.trPrimeiroTrimestre = igWeeks > 13 ? 'Feito' : (igWeeks > 8 ? 'Feito' : 'Não se aplica');
      g.exames.trSegundoTrimestre = igWeeks > 27 ? 'Feito' : (igWeeks > 13 ? 'Feito' : 'Não se aplica');
      g.exames.trTerceiroTrimestre = igWeeks > 32 ? 'Feito' : 'Não se aplica';
      g.exames.resultadoTR = 'Não Reagente';
      g.isExposta = false;
      g.isPuerpera = false;
      return g;
    },
  };
}

/**
 * Cenário: consulta atrasada (15-45 dias)
 */
export function scenarioConsultaAtrasadaLeve(rng: () => number): ScenarioModification {
  const igWeeks = Math.floor(rng() * 25) + 10; // 10-35 weeks
  const diasAtrasada = Math.floor(rng() * 25) + 16; // 16-40 days

  return {
    tags: ['consulta-atrasada-leve'],
    apply: (g) => {
      const base = scenarioNormal(rng);
      g = base.apply(g, rng);
      g.consultas.dum = dumForWeeks(igWeeks);
      const dpp = new Date(g.consultas.dum);
      dpp.setDate(dpp.getDate() + 280);
      g.consultas.dpp = formatDate(dpp);
      g.consultas.dataUltimaConsulta = daysAgo(diasAtrasada);
      return g;
    },
  };
}

/**
 * Cenário: consulta muito atrasada (>45 dias)
 */
export function scenarioConsultaAtrasadaGrave(rng: () => number): ScenarioModification {
  const igWeeks = Math.floor(rng() * 20) + 15; // 15-35 weeks
  const diasAtrasada = Math.floor(rng() * 40) + 46; // 46-85 days

  return {
    tags: ['consulta-atrasada-grave'],
    apply: (g) => {
      const base = scenarioNormal(rng);
      g = base.apply(g, rng);
      g.consultas.dum = dumForWeeks(igWeeks);
      const dpp = new Date(g.consultas.dum);
      dpp.setDate(dpp.getDate() + 280);
      g.consultas.dpp = formatDate(dpp);
      g.consultas.dataUltimaConsulta = daysAgo(diasAtrasada);
      g.consultas.numeroConsultas = Math.max(1, g.consultas.numeroConsultas - 2);
      return g;
    },
  };
}

/**
 * Cenário: exposta HIV
 */
export function scenarioExpostaHIV(rng: () => number): ScenarioModification {
  const igWeeks = Math.floor(rng() * 25) + 10;
  return {
    tags: ['exposta-hiv'],
    apply: (g) => {
      const base = scenarioNormal(rng);
      g = base.apply(g, rng);
      g.consultas.dum = dumForWeeks(igWeeks);
      const dpp = new Date(g.consultas.dum);
      dpp.setDate(dpp.getDate() + 280);
      g.consultas.dpp = formatDate(dpp);
      g.exames.resultadoTR = 'Reagente';
      g.isExposta = true;
      return g;
    },
    exposicao: (rng) => ({
      hiv: {
        trRealizado: true,
        resultado: 'Reagente',
        confirmacaoLaboratorial: rng() > 0.3,
        cargaViral: rng() > 0.5 ? '≥ 1.000 cópias/mL' : '< 50 cópias/mL',
        cd4: rng() > 0.4 ? '> 500 células/mm3' : '< 200 células/mm3',
        tarvIniciado: rng() > 0.2,
        dataTarv: rng() > 0.2 ? daysAgo(Math.floor(rng() * 60) + 10) : undefined,
      },
    }),
  };
}

/**
 * Cenário: exposta Sífilis
 */
export function scenarioExpostaSifilis(rng: () => number): ScenarioModification {
  const igWeeks = Math.floor(rng() * 25) + 8;
  return {
    tags: ['exposta-sifilis'],
    apply: (g) => {
      const base = scenarioNormal(rng);
      g = base.apply(g, rng);
      g.consultas.dum = dumForWeeks(igWeeks);
      const dpp = new Date(g.consultas.dum);
      dpp.setDate(dpp.getDate() + 280);
      g.consultas.dpp = formatDate(dpp);
      g.exames.resultadoTR = 'Reagente';
      g.isExposta = true;
      return g;
    },
    exposicao: (rng) => {
      const doses = Math.floor(rng() * 3) + 1; // 1-3 doses given
      return {
        sifilis: {
          trRealizado: true,
          resultado: 'Reagente',
          dataTR: daysAgo(Math.floor(rng() * 90) + 14),
          vdrlSolicitado: true,
          resultadoVDRL: `Reagente 1:${Math.pow(2, Math.floor(rng() * 4) + 1)}`,
          tipoSifilis: (['Primária', 'Secundária', 'Latente'] as const)[Math.floor(rng() * 3)],
          notificacao: true,
          dataPrimeiraDose: doses >= 1 ? daysAgo(Math.floor(rng() * 60) + 7) : undefined,
          dataSegundaDose: doses >= 2 ? daysAgo(Math.floor(rng() * 40) + 3) : undefined,
          dataTerceiraDose: doses >= 3 ? daysAgo(Math.floor(rng() * 20) + 1) : undefined,
          vdrlControleRealizado: rng() > 0.5,
        },
      };
    },
  };
}

/**
 * Cenário: exposta Hepatite B
 */
export function scenarioExpostaHepB(rng: () => number): ScenarioModification {
  const igWeeks = Math.floor(rng() * 25) + 10;
  return {
    tags: ['exposta-hepb'],
    apply: (g) => {
      const base = scenarioNormal(rng);
      g = base.apply(g, rng);
      g.consultas.dum = dumForWeeks(igWeeks);
      const dpp = new Date(g.consultas.dum);
      dpp.setDate(dpp.getDate() + 280);
      g.consultas.dpp = formatDate(dpp);
      g.exames.resultadoTR = 'Reagente';
      g.isExposta = true;
      return g;
    },
    exposicao: (rng) => {
      const doses = Math.floor(rng() * 3) + 1;
      return {
        hepatiteB: {
          trRealizado: true,
          resultado: 'Reagente',
          dataTR: daysAgo(Math.floor(rng() * 90) + 14),
          antiHBsSolicitado: true,
          resultadoAntiHBs: 'Não Reagente',
          vacinacaoIniciada: true,
          dataPrimeiraDoseVacina: doses >= 1 ? daysAgo(Math.floor(rng() * 60) + 7) : undefined,
          dataSegundaDoseVacina: doses >= 2 ? daysAgo(Math.floor(rng() * 40) + 3) : undefined,
          dataTerceiraDoseVacina: doses >= 3 ? daysAgo(Math.floor(rng() * 20) + 1) : undefined,
        },
      };
    },
  };
}

/**
 * Cenário: pressão alta
 */
export function scenarioPressaoAlta(rng: () => number): ScenarioModification {
  const igWeeks = Math.floor(rng() * 20) + 15;
  const sistolica = Math.floor(rng() * 30) + 140; // 140-170
  const diastolica = Math.floor(rng() * 20) + 90; // 90-110
  return {
    tags: ['pressao-alta'],
    apply: (g) => {
      const base = scenarioNormal(rng);
      g = base.apply(g, rng);
      g.consultas.dum = dumForWeeks(igWeeks);
      const dpp = new Date(g.consultas.dum);
      dpp.setDate(dpp.getDate() + 280);
      g.consultas.dpp = formatDate(dpp);
      g.consultas.pressaoArterial = `${sistolica}/${diastolica}`;
      return g;
    },
  };
}

/**
 * Cenário: sem avaliação odontológica
 */
export function scenarioSemOdonto(_rng: () => number): ScenarioModification {
  return {
    tags: ['sem-odonto'],
    apply: (g) => {
      g.avaliacaoOdonto = 'Não realizada';
      return g;
    },
  };
}

/**
 * Cenário: vacina DTpa pendente (>20 semanas)
 */
export function scenarioVacinaPendente(rng: () => number): ScenarioModification {
  const igWeeks = Math.floor(rng() * 15) + 22; // 22-37 weeks
  return {
    tags: ['vacina-pendente'],
    apply: (g) => {
      g.consultas.dum = dumForWeeks(igWeeks);
      const dpp = new Date(g.consultas.dum);
      dpp.setDate(dpp.getDate() + 280);
      g.consultas.dpp = formatDate(dpp);
      g.vacinaDTpa = 'Não realizada';
      return g;
    },
  };
}

/**
 * Cenário: poucas consultas para IG
 */
export function scenarioPoucasConsultas(rng: () => number): ScenarioModification {
  const igWeeks = Math.floor(rng() * 15) + 20; // 20-35 weeks
  return {
    tags: ['poucas-consultas'],
    apply: (g) => {
      g.consultas.dum = dumForWeeks(igWeeks);
      const dpp = new Date(g.consultas.dum);
      dpp.setDate(dpp.getDate() + 280);
      g.consultas.dpp = formatDate(dpp);
      g.consultas.numeroConsultas = Math.floor(rng() * 2) + 1; // 1-2 consultations only
      return g;
    },
  };
}

/**
 * Cenário: DPP próxima (<30 dias)
 */
export function scenarioDppProxima(rng: () => number): ScenarioModification {
  const diasParaDpp = Math.floor(rng() * 25) + 3; // 3-27 days
  const igWeeks = Math.floor((280 - diasParaDpp) / 7);
  return {
    tags: ['dpp-proxima'],
    apply: (g) => {
      g.consultas.dum = dumForWeeks(igWeeks);
      const dpp = new Date();
      dpp.setDate(dpp.getDate() + diasParaDpp);
      g.consultas.dpp = formatDate(dpp);
      g.consultas.numeroConsultas = Math.floor(rng() * 3) + 5; // 5-7
      // Ensure 3rd trimester exams are set up
      g.exames.trPrimeiroTrimestre = 'Feito';
      g.exames.trSegundoTrimestre = 'Feito';
      g.exames.trTerceiroTrimestre = rng() > 0.3 ? 'Feito' : 'Não Feito';
      return g;
    },
  };
}

/**
 * Cenário: puérpera
 */
export function scenarioPuerpera(rng: () => number): ScenarioModification {
  const diasPosParto = Math.floor(rng() * 35) + 3; // 3-37 days post-partum
  return {
    tags: ['puerpera'],
    apply: (g) => {
      g.isPuerpera = true;
      g.consultas.dum = weeksAgo(40 + Math.floor(diasPosParto / 7));
      const dpp = new Date();
      dpp.setDate(dpp.getDate() - diasPosParto);
      g.consultas.dpp = formatDate(dpp);
      g.consultas.numeroConsultas = Math.floor(rng() * 3) + 5;
      g.exames.trPrimeiroTrimestre = 'Feito';
      g.exames.trSegundoTrimestre = 'Feito';
      g.exames.trTerceiroTrimestre = 'Feito';
      g.exames.resultadoTR = 'Não Reagente';
      g.vacinaDTpa = 'Realizada';

      // Pós-natal
      const hasConsulta = rng() > 0.4;
      const hasVD = rng() > 0.3;
      const hasOdonto = rng() > 0.5;
      g.posNatal = {
        consultaPuerperio: hasConsulta,
        visitaDomiciliarPosNatal: hasVD,
        avaliacaoOdontoPosNatal: hasOdonto,
      };
      g.consultas.dataUltimaConsulta = daysAgo(Math.floor(rng() * diasPosParto) + 1);
      return g;
    },
  };
}

/**
 * Cenário: sem visita domiciliar
 */
export function scenarioSemVD(_rng: () => number): ScenarioModification {
  return {
    tags: ['sem-vd'],
    apply: (g) => {
      g.consultas.visitasDomiciliares = 0;
      return g;
    },
  };
}

// --- Scenario distribution ---

export interface ScenarioDistribution {
  factory: (rng: () => number) => ScenarioModification;
  weight: number;
  /** Can be combined with other scenarios */
  combinable: boolean;
}

export const PRIMARY_SCENARIOS: ScenarioDistribution[] = [
  { factory: scenarioNormal, weight: 0.30, combinable: false },
  { factory: scenarioConsultaAtrasadaLeve, weight: 0.12, combinable: true },
  { factory: scenarioConsultaAtrasadaGrave, weight: 0.08, combinable: true },
  { factory: scenarioExpostaHIV, weight: 0.05, combinable: true },
  { factory: scenarioExpostaSifilis, weight: 0.08, combinable: true },
  { factory: scenarioExpostaHepB, weight: 0.03, combinable: true },
  { factory: scenarioPressaoAlta, weight: 0.10, combinable: true },
  { factory: scenarioDppProxima, weight: 0.08, combinable: false },
  { factory: scenarioPuerpera, weight: 0.10, combinable: false },
  { factory: scenarioPoucasConsultas, weight: 0.06, combinable: true },
];

/** Secondary scenarios can be applied ON TOP of a primary scenario */
export const SECONDARY_SCENARIOS: ScenarioDistribution[] = [
  { factory: scenarioSemOdonto, weight: 0.30, combinable: true },
  { factory: scenarioVacinaPendente, weight: 0.15, combinable: true },
  { factory: scenarioSemVD, weight: 0.20, combinable: true },
];
