/**
 * Types de urgência — categorias visuais + score numérico para ordenação.
 */

export type UrgencyCategory = 'critico' | 'atencao' | 'normal';

export interface UrgencyResult {
  category: UrgencyCategory;
  score: number;
  /** Lista de alertas ativos com descrição */
  alerts: UrgencyAlert[];
}

export interface UrgencyAlert {
  type: 'critical' | 'attention';
  code: string;
  message: string;
}

/**
 * Fatores de score — pontos por condição
 */
export const SCORE_FACTORS = {
  TR_REAGENTE: 50,
  PA_ELEVADA: 40,
  DIAS_SEM_CONSULTA_POR_DIA: 2,
  DIAS_SEM_CONSULTA_THRESHOLD: 14,
  EXAME_PENDENTE_TRIMESTRE: 15,
  SEM_VISITA_DOMICILIAR: 10,
  SEM_ODONTO: 5,
  DTPA_PENDENTE: 5,
  POUCAS_CONSULTAS: 10,
} as const;

/**
 * Limites de dias para classificação temporal
 */
export const TEMPORAL_THRESHOLDS = {
  /** Dias sem consulta para ser CRÍTICO */
  CONSULTA_CRITICO: 45,
  /** Dias sem consulta para ser ATENÇÃO */
  CONSULTA_ATENCAO: 15,
} as const;

/**
 * Limites de trimestre por semana gestacional
 */
export const TRIMESTER_WEEKS = {
  FIRST_END: 13,
  SECOND_END: 27,
  // 28+ = third trimester
} as const;

/**
 * Consultas mínimas esperadas por trimestre (MS recommends 6+ total)
 */
export const EXPECTED_CONSULTATIONS = {
  FIRST_TRIMESTER: 1,
  SECOND_TRIMESTER: 3,
  THIRD_TRIMESTER: 6,
} as const;
