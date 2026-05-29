/**
 * Interface Gestante — campos da planilha principal (gestantes.csv)
 * Inclui identificação, endereço com coordenadas, monitoramento pré-natal e pós-parto.
 */

import type { DadosExposicao } from './exposicao';

export interface Endereco {
  rua: string;
  numero: string;
  complemento?: string;
  /** Coordenadas para posicionamento no mapa */
  lat: number;
  lng: number;
}

export interface ConsultaInfo {
  /** Idade gestacional no momento da abertura do pré-natal */
  igAbertura: string; // e.g. "<12 sem", "12-20 sem"
  /** Data da última menstruação */
  dum: string; // ISO date
  /** Data provável do parto (DUM + 280 dias) */
  dpp: string; // ISO date
  /** Data da última consulta */
  dataUltimaConsulta: string; // ISO date
  /** Data da próxima consulta */
  dataProximaConsulta?: string; // ISO date
  /** Número total de consultas de pré-natal realizadas */
  numeroConsultas: number;
  /** Último registro de pressão arterial (e.g. "120/80") */
  pressaoArterial: string;
  /** Status do acompanhamento peso/altura */
  acompanhamentoPesoAltura: 'Em dia' | 'Atrasada' | 'Não iniciado';
  /** Número de visitas domiciliares realizadas */
  visitasDomiciliares: number;
}

export type StatusExame = 'Feito' | 'Não Feito' | 'Não se aplica';
export type ResultadoTR = 'Reagente' | 'Não Reagente' | 'Não realizado';

export interface ExamesTrimestre {
  /** TR/Sorologia Sífilis + HIV no 1º trimestre */
  trPrimeiroTrimestre: StatusExame;
  /** TR/Sorologia Sífilis + HIV no 2º trimestre */
  trSegundoTrimestre: StatusExame;
  /** TR/Sorologia Sífilis + HIV no 3º trimestre */
  trTerceiroTrimestre: StatusExame;
  /** Resultado do teste rápido (se reagente → exposta) */
  resultadoTR: ResultadoTR;
}

export type StatusOdonto = 'Realizada' | 'Não realizada' | 'Agendada';
export type StatusVacina = 'Realizada' | 'Não realizada' | 'Não se aplica';

export interface MonitoramentoPosNatal {
  consultaPuerperio: boolean;
  visitaDomiciliarPosNatal: boolean;
  avaliacaoOdontoPosNatal: boolean;
}

export interface Gestante {
  /** Identificador único */
  id: string;
  /** Nome completo */
  nome: string;
  /** Cartão Nacional de Saúde (15 dígitos) */
  cns: string;
  /** Data de nascimento (ISO date) */
  dataNascimento: string;
  /** Telefone de contato */
  telefone: string;
  /** Endereço com coordenadas */
  endereco: Endereco;
  /** Microárea atribuída (MA1-MA5) */
  microarea: string;

  // --- Monitoramento pré-natal ---
  consultas: ConsultaInfo;
  exames: ExamesTrimestre;
  avaliacaoOdonto: StatusOdonto;
  /** Vacina DTpa (a partir da 20ª semana) */
  vacinaDTpa: StatusVacina;

  // --- Avaliação de exposição ---
  /** Resultado TR Sífilis+HIV 1º trimestre detalhado */
  trSifilisHivPrimeiroTri: StatusExame;
  /** Resultado TR Sífilis+HIV 3º trimestre detalhado */
  trSifilisHivTerceiroTri: StatusExame;

  // --- Pós-parto (se puérpera) ---
  /** true se já deu à luz (DPP passou e parto confirmado) */
  isPuerpera: boolean;
  posNatal?: MonitoramentoPosNatal;

  // --- Dados de exposição (se exposta) ---
  /** Se é gestante exposta (TR reagente para HIV, Sífilis ou HepB) */
  isExposta: boolean;
  exposicao?: DadosExposicao;
}
