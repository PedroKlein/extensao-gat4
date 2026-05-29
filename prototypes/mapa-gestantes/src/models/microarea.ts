/**
 * Interface Microárea — polígonos territoriais com indicadores agregados.
 */

export interface Microarea {
  /** Identificador (e.g. "MA1", "MA2") */
  id: string;
  /** Nome da microárea para exibição */
  nome: string;
  /** Nome da ACS responsável */
  acsNome: string;
  /** Polígono GeoJSON (array de [lat, lng] formando o perímetro) */
  polygon: [number, number][];
  /** Cor de preenchimento (definida em runtime baseada nos indicadores) */
  fillColor?: string;
}

export interface MicroareaStats {
  microareaId: string;
  totalGestantes: number;
  criticas: number;
  atencao: number;
  normais: number;
  /** Percentual com pré-natal em dia */
  percentualEmDia: number;
  /** Gestantes expostas nesta microárea */
  expostas: number;
}
