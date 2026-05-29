/**
 * Interface GestanteExposta — dados de tratamento (gestantes-expostas.csv)
 * Acompanhamento de HIV, Sífilis e Hepatite B para gestantes com TR reagente.
 */

export interface TratamentoHIV {
  trRealizado: boolean;
  resultado: 'Reagente' | 'Não Reagente';
  confirmacaoLaboratorial: boolean;
  /** Carga viral */
  cargaViral: string; // e.g. "≥ 1.000 cópias/mL", "< 50 cópias/mL", "Indetectável"
  /** Contagem CD4 */
  cd4: string; // e.g. "< 200 células/mm3", "> 500 células/mm3"
  tarvIniciado: boolean;
  dataTarv?: string; // ISO date
}

export interface TratamentoSifilis {
  trRealizado: boolean;
  resultado: 'Reagente' | 'Não Reagente';
  dataTR?: string; // ISO date
  vdrlSolicitado: boolean;
  resultadoVDRL?: string; // e.g. "Reagente 1:8", "Não Reagente"
  tipoSifilis?: 'Primária' | 'Secundária' | 'Terciária' | 'Latente';
  notificacao: boolean;
  /** Datas das doses de penicilina (até 3) */
  dataPrimeiraDose?: string;
  dataSegundaDose?: string;
  dataTerceiraDose?: string;
  vdrlControleRealizado: boolean;
}

export interface TratamentoHepatiteB {
  trRealizado: boolean;
  resultado: 'Reagente' | 'Não Reagente';
  dataTR?: string; // ISO date
  antiHBsSolicitado: boolean;
  resultadoAntiHBs?: string; // e.g. "Reagente", "Não Reagente"
  vacinacaoIniciada: boolean;
  dataPrimeiraDoseVacina?: string;
  dataSegundaDoseVacina?: string;
  dataTerceiraDoseVacina?: string;
}

export interface DadosExposicao {
  hiv?: TratamentoHIV;
  sifilis?: TratamentoSifilis;
  hepatiteB?: TratamentoHepatiteB;
}
