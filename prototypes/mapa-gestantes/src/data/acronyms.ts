/**
 * Dicionário de siglas médicas para tooltips.
 */
export const ACRONYMS: Record<string, string> = {
  'CNS': 'Cartão Nacional de Saúde',
  'IG': 'Idade Gestacional',
  'DPP': 'Data Provável do Parto',
  'DUM': 'Data da Última Menstruação',
  'TR': 'Teste Rápido',
  'TARV': 'Terapia Antirretroviral',
  'DTpa': 'Difteria, Tétano e Coqueluche (vacina acelular)',
  'VDRL': 'Venereal Disease Research Laboratory (teste para sífilis)',
  'PA': 'Pressão Arterial',
  'VD': 'Visita Domiciliar',
  'PN': 'Pré-Natal',
  'HIV': 'Vírus da Imunodeficiência Humana',
  'HBsAg': 'Antígeno de Superfície da Hepatite B',
  'Anti-HBs': 'Anticorpo contra Hepatite B',
  'CD4': 'Linfócitos T CD4 (células de defesa)',
  'ACS': 'Agente Comunitário de Saúde',
  'ESF': 'Estratégia Saúde da Família',
  'US': 'Unidade de Saúde',
  'SUS': 'Sistema Único de Saúde',
  'APS': 'Atenção Primária à Saúde',
  'HepB': 'Hepatite B',
};

/**
 * Wraps an acronym with a tooltip span.
 */
export function acronymHtml(acronym: string): string {
  const expansion = ACRONYMS[acronym];
  if (!expansion) return acronym;
  return `<span class="acronym-tooltip" title="${expansion}" style="border-bottom:1px dotted #888;cursor:help">${acronym}</span>`;
}
