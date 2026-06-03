/**
 * Curated street data — real streets in the Santa Tereza/Vila Cruzeiro area
 * near US Moab Caldas, with verified coordinates from OpenStreetMap.
 */

export interface CuratedStreet {
  nome: string;
  /** Center coordinate of the street */
  lat: number;
  lng: number;
  /** Which microárea this street belongs to */
  microarea: string;
}

/**
 * Real streets from OSM Overpass API, within 600m of US Moab Caldas.
 * Grouped by microárea based on geographic position.
 */
export const CURATED_STREETS: CuratedStreet[] = [
  // --- MA1: Norte da Av. Moab Caldas ---
  { nome: 'Avenida Moab Caldas', lat: -30.0693360, lng: -51.2167740, microarea: 'MA1' },
  { nome: 'Rua Gabriel Fialho Camargo', lat: -30.0690506, lng: -51.2158547, microarea: 'MA1' },
  { nome: 'Rua Abelardo Marquês', lat: -30.0708593, lng: -51.2161781, microarea: 'MA1' },
  { nome: 'Rua Bernardino Caetano Fraga', lat: -30.0713530, lng: -51.2166852, microarea: 'MA1' },

  // --- MA2: Área central ---
  { nome: 'Rua Januário Scalzilli', lat: -30.0718656, lng: -51.2160464, microarea: 'MA2' },
  { nome: 'Rua Felipe Weimann', lat: -30.0735963, lng: -51.2171576, microarea: 'MA2' },
  { nome: 'Rua Professor Manoel Lobato', lat: -30.0717846, lng: -51.2179323, microarea: 'MA2' },
  { nome: 'Rua Júlio Lopes dos Santos Sobrinho', lat: -30.0718596, lng: -51.2175061, microarea: 'MA2' },
  { nome: 'Avenida Deputado Aramy Silva', lat: -30.0740700, lng: -51.2181119, microarea: 'MA2' },
  { nome: 'Avenida Francisco Massena Vieira', lat: -30.0735574, lng: -51.2184027, microarea: 'MA2' },
  { nome: 'Rua Antônio Pereira Júnior', lat: -30.0750849, lng: -51.2201410, microarea: 'MA2' },

  // --- MA3: Lado oeste (Becos) ---
  { nome: 'Rua Nossa Senhora do Brasil', lat: -30.0703885, lng: -51.2226177, microarea: 'MA3' },
  { nome: 'Rua Mutualidade', lat: -30.0717282, lng: -51.2252316, microarea: 'MA3' },
  { nome: 'Rua Corrêa Lima', lat: -30.0700984, lng: -51.2265082, microarea: 'MA3' },
  { nome: 'Rua Santa Cruz', lat: -30.0674979, lng: -51.2229020, microarea: 'MA3' },
  { nome: 'Rua Gilberto Laste', lat: -30.0686951, lng: -51.2249152, microarea: 'MA3' },
  { nome: 'Travessa Valeriano Rodrigues', lat: -30.0722543, lng: -51.2240974, microarea: 'MA3' },
  { nome: 'Rua Banco Inglês', lat: -30.0722844, lng: -51.2209007, microarea: 'MA3' },
  { nome: 'Beco dos Coqueiros', lat: -30.0731362, lng: -51.2215084, microarea: 'MA3' },

  // --- MA4: Sul — Vila Cruzeiro ---
  { nome: 'Rua Cruzeiro do Sul', lat: -30.0769872, lng: -51.2238590, microarea: 'MA4' },
  { nome: 'Rua Maria José Alberton Silva', lat: -30.0772716, lng: -51.2226634, microarea: 'MA4' },
  { nome: 'Rua Aracy de Azevedo José', lat: -30.0779449, lng: -51.2232544, microarea: 'MA4' },
  { nome: 'Rua Álvaro Osimo Caetano', lat: -30.0782186, lng: -51.2225885, microarea: 'MA4' },
  { nome: 'Avenida Joracy Camargo', lat: -30.0767416, lng: -51.2214078, microarea: 'MA4' },
  { nome: 'Rua Gibran Khalil Gibran', lat: -30.0770083, lng: -51.2204013, microarea: 'MA4' },
  { nome: 'Rua Doutor Leônidas Soares Machado', lat: -30.0760913, lng: -51.2182121, microarea: 'MA4' },
  { nome: 'Rua Paulino Vasco Micco', lat: -30.0768681, lng: -51.2179651, microarea: 'MA4' },
  { nome: 'Rua Madre Brígida Pastorino', lat: -30.0760548, lng: -51.2242543, microarea: 'MA4' },

  // --- MA5: Sudoeste ---
  { nome: 'Rua Flores', lat: -30.0752843, lng: -51.2245407, microarea: 'MA5' },
  { nome: 'Rua Caixa Econômica', lat: -30.0738131, lng: -51.2227532, microarea: 'MA5' },
  { nome: 'Rua Neves', lat: -30.0746465, lng: -51.2255236, microarea: 'MA5' },
];
