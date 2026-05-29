/**
 * Lógica de urgência — calcula score numérico e classifica em 3 categorias.
 * Funções puras, sem side effects.
 */

import type { Gestante, UrgencyResult, UrgencyAlert, UrgencyCategory } from '../models';
import { SCORE_FACTORS, TEMPORAL_THRESHOLDS, TRIMESTER_WEEKS, EXPECTED_CONSULTATIONS } from '../models';
import { daysSince, calculateIG, getTrimester } from './dates';

/**
 * Calcula o resultado de urgência para uma gestante.
 * Retorna categoria (critico/atencao/normal), score numérico, e lista de alertas.
 */
export function calculateUrgency(gestante: Gestante): UrgencyResult {
  if (gestante.isPuerpera) {
    return calculateUrgencyPuerpera(gestante);
  }

  const alerts: UrgencyAlert[] = [];
  let score = 0;

  // --- Fatores CRÍTICOS ---

  // TR Reagente (HIV, Sífilis, ou HepB)
  if (gestante.exames.resultadoTR === 'Reagente') {
    score += SCORE_FACTORS.TR_REAGENTE;
    alerts.push({
      type: 'critical',
      code: 'TR_REAGENTE',
      message: 'Teste rápido reagente — gestante exposta',
    });
  }

  // Pressão arterial elevada (≥ 140/90)
  if (isPressaoElevada(gestante.consultas.pressaoArterial)) {
    score += SCORE_FACTORS.PA_ELEVADA;
    alerts.push({
      type: 'critical',
      code: 'PA_ELEVADA',
      message: `Pressão arterial elevada: ${gestante.consultas.pressaoArterial}`,
    });
  }

  // Dias sem consulta
  const diasSemConsulta = daysSince(gestante.consultas.dataUltimaConsulta);
  if (diasSemConsulta > TEMPORAL_THRESHOLDS.CONSULTA_CRITICO) {
    const pontosDias = (diasSemConsulta - SCORE_FACTORS.DIAS_SEM_CONSULTA_THRESHOLD) * SCORE_FACTORS.DIAS_SEM_CONSULTA_POR_DIA;
    score += pontosDias;
    alerts.push({
      type: 'critical',
      code: 'CONSULTA_MUITO_ATRASADA',
      message: `${diasSemConsulta} dias sem consulta (limite: ${TEMPORAL_THRESHOLDS.CONSULTA_CRITICO})`,
    });
  } else if (diasSemConsulta > TEMPORAL_THRESHOLDS.CONSULTA_ATENCAO) {
    const pontosDias = (diasSemConsulta - SCORE_FACTORS.DIAS_SEM_CONSULTA_THRESHOLD) * SCORE_FACTORS.DIAS_SEM_CONSULTA_POR_DIA;
    score += pontosDias;
    alerts.push({
      type: 'attention',
      code: 'CONSULTA_ATRASADA',
      message: `${diasSemConsulta} dias sem consulta`,
    });
  }

  // 3º trimestre sem TR/sorologia feitos
  const igWeeks = calculateIG(gestante.consultas.dum);
  const trimester = getTrimester(igWeeks);
  if (trimester === 3 && gestante.exames.trTerceiroTrimestre === 'Não Feito') {
    score += SCORE_FACTORS.EXAME_PENDENTE_TRIMESTRE;
    alerts.push({
      type: 'critical',
      code: 'TR_3TRI_PENDENTE',
      message: '3º trimestre sem TR/sorologia realizados',
    });
  }

  // --- Fatores de ATENÇÃO ---

  // Exame pendente do trimestre atual
  if (trimester === 1 && gestante.exames.trPrimeiroTrimestre === 'Não Feito' && igWeeks >= 8) {
    score += SCORE_FACTORS.EXAME_PENDENTE_TRIMESTRE;
    alerts.push({
      type: 'attention',
      code: 'TR_1TRI_PENDENTE',
      message: '1º trimestre sem TR/sorologia realizados',
    });
  }
  if (trimester >= 2 && gestante.exames.trSegundoTrimestre === 'Não Feito') {
    score += SCORE_FACTORS.EXAME_PENDENTE_TRIMESTRE;
    alerts.push({
      type: 'attention',
      code: 'TR_2TRI_PENDENTE',
      message: '2º trimestre sem TR/sorologia realizados',
    });
  }

  // Sem avaliação odontológica
  if (gestante.avaliacaoOdonto === 'Não realizada') {
    score += SCORE_FACTORS.SEM_ODONTO;
    alerts.push({
      type: 'attention',
      code: 'SEM_ODONTO',
      message: 'Avaliação odontológica não realizada',
    });
  }

  // DTpa pendente (> 20 semanas)
  if (igWeeks > 20 && gestante.vacinaDTpa === 'Não realizada') {
    score += SCORE_FACTORS.DTPA_PENDENTE;
    alerts.push({
      type: 'attention',
      code: 'DTPA_PENDENTE',
      message: 'Vacina DTpa não realizada (> 20ª semana)',
    });
  }

  // Sem visita domiciliar
  if (gestante.consultas.visitasDomiciliares === 0) {
    score += SCORE_FACTORS.SEM_VISITA_DOMICILIAR;
    alerts.push({
      type: 'attention',
      code: 'SEM_VD',
      message: 'Nenhuma visita domiciliar registrada',
    });
  }

  // Poucas consultas para IG
  const expectedConsultations = getExpectedConsultations(trimester);
  if (gestante.consultas.numeroConsultas < expectedConsultations) {
    score += SCORE_FACTORS.POUCAS_CONSULTAS;
    alerts.push({
      type: 'attention',
      code: 'POUCAS_CONSULTAS',
      message: `${gestante.consultas.numeroConsultas} consultas (esperado ≥ ${expectedConsultations} para ${trimester}º trimestre)`,
    });
  }

  // Peso/Altura atrasada
  if (gestante.consultas.acompanhamentoPesoAltura === 'Atrasada') {
    score += 5;
    alerts.push({
      type: 'attention',
      code: 'PESO_ATRASADO',
      message: 'Acompanhamento peso/altura atrasado',
    });
  }

  // --- Determinar categoria ---
  const category = determineCategory(alerts);

  return { category, score, alerts };
}

/**
 * Lógica de urgência diferenciada para puérperas.
 * Alertas mudam para consulta puerpério, VD pós-parto e odonto pós-parto.
 */
function calculateUrgencyPuerpera(gestante: Gestante): UrgencyResult {
  const alerts: UrgencyAlert[] = [];
  let score = 0;
  const posNatal = gestante.posNatal;

  if (!posNatal) {
    // Puérpera sem nenhum registro pós-natal = crítico
    score += 60;
    alerts.push({
      type: 'critical',
      code: 'SEM_ACOMP_POSNATAL',
      message: 'Puérpera sem nenhum registro de acompanhamento pós-parto',
    });
    return { category: 'critico', score, alerts };
  }

  // Consulta puerpério não realizada
  if (!posNatal.consultaPuerperio) {
    score += 30;
    alerts.push({
      type: 'critical',
      code: 'SEM_CONSULTA_PUERPERIO',
      message: 'Consulta puerpério não realizada',
    });
  }

  // VD pós-natal não realizada
  if (!posNatal.visitaDomiciliarPosNatal) {
    score += SCORE_FACTORS.SEM_VISITA_DOMICILIAR;
    alerts.push({
      type: 'attention',
      code: 'SEM_VD_POSNATAL',
      message: 'Visita domiciliar pós-parto não realizada',
    });
  }

  // Odonto pós-natal
  if (!posNatal.avaliacaoOdontoPosNatal) {
    score += SCORE_FACTORS.SEM_ODONTO;
    alerts.push({
      type: 'attention',
      code: 'SEM_ODONTO_POSNATAL',
      message: 'Avaliação odontológica pós-parto não realizada',
    });
  }

  // Dias desde última consulta (se puérpera ainda tem consulta registrada)
  const diasSemConsulta = daysSince(gestante.consultas.dataUltimaConsulta);
  if (diasSemConsulta > TEMPORAL_THRESHOLDS.CONSULTA_CRITICO) {
    score += diasSemConsulta * SCORE_FACTORS.DIAS_SEM_CONSULTA_POR_DIA;
    alerts.push({
      type: 'critical',
      code: 'PUERPERA_SEM_RETORNO',
      message: `${diasSemConsulta} dias sem consulta pós-parto`,
    });
  }

  const category = determineCategory(alerts);
  return { category, score, alerts };
}

/** Determina a categoria baseada nos alertas (se tem algum critical → critico) */
function determineCategory(alerts: UrgencyAlert[]): UrgencyCategory {
  if (alerts.some(a => a.type === 'critical')) return 'critico';
  if (alerts.some(a => a.type === 'attention')) return 'atencao';
  return 'normal';
}

/** Verifica se a pressão arterial é ≥ 140/90 */
function isPressaoElevada(pa: string): boolean {
  const match = pa.match(/(\d+)\/(\d+)/);
  if (!match) return false;
  const sistolica = parseInt(match[1], 10);
  const diastolica = parseInt(match[2], 10);
  return sistolica >= 140 || diastolica >= 90;
}

/** Retorna consultas mínimas esperadas por trimestre */
function getExpectedConsultations(trimester: 1 | 2 | 3): number {
  switch (trimester) {
    case 1: return EXPECTED_CONSULTATIONS.FIRST_TRIMESTER;
    case 2: return EXPECTED_CONSULTATIONS.SECOND_TRIMESTER;
    case 3: return EXPECTED_CONSULTATIONS.THIRD_TRIMESTER;
  }
}

// Re-export for convenience
export { TRIMESTER_WEEKS, TEMPORAL_THRESHOLDS, SCORE_FACTORS };
