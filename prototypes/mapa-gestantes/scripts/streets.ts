/**
 * Ruas reais na região da US Moab Caldas (Santa Tereza / Vila Cruzeiro / Cristal)
 * Coordenadas aproximadas do início de cada rua para gerar endereços plausíveis.
 */

export interface StreetData {
  nome: string;
  /** Coordenada base (início da rua na região) */
  baseLat: number;
  baseLng: number;
  /** Variação máxima ao longo da rua (em graus, ~111m per 0.001) */
  spreadLat: number;
  spreadLng: number;
}

export const STREETS: StreetData[] = [
  // Avenida principal
  { nome: 'Avenida Moab Caldas', baseLat: -30.0715, baseLng: -51.2210, spreadLat: 0.004, spreadLng: 0.002 },
  // Ruas próximas à US Moab (Santa Tereza)
  { nome: 'Rua Miguel Couto', baseLat: -30.0735, baseLng: -51.2185, spreadLat: 0.002, spreadLng: 0.001 },
  { nome: 'Rua Barão do Amazonas', baseLat: -30.0748, baseLng: -51.2220, spreadLat: 0.003, spreadLng: 0.002 },
  { nome: 'Rua Silveiro', baseLat: -30.0710, baseLng: -51.2175, spreadLat: 0.002, spreadLng: 0.001 },
  { nome: 'Rua Múcio Teixeira', baseLat: -30.0722, baseLng: -51.2190, spreadLat: 0.002, spreadLng: 0.001 },
  { nome: 'Rua Santo Antônio', baseLat: -30.0740, baseLng: -51.2200, spreadLat: 0.002, spreadLng: 0.002 },
  { nome: 'Rua Sarmento Leite', baseLat: -30.0700, baseLng: -51.2165, spreadLat: 0.002, spreadLng: 0.001 },
  // Vila Cruzeiro
  { nome: 'Avenida Capivari', baseLat: -30.0780, baseLng: -51.2240, spreadLat: 0.003, spreadLng: 0.002 },
  { nome: 'Rua Cruzeiro do Sul', baseLat: -30.0765, baseLng: -51.2255, spreadLat: 0.003, spreadLng: 0.002 },
  { nome: 'Rua José do Patrocínio', baseLat: -30.0755, baseLng: -51.2230, spreadLat: 0.002, spreadLng: 0.002 },
  { nome: 'Rua São Carlos', baseLat: -30.0770, baseLng: -51.2215, spreadLat: 0.002, spreadLng: 0.001 },
  // Cristal
  { nome: 'Rua Dona Leopoldina', baseLat: -30.0695, baseLng: -51.2250, spreadLat: 0.002, spreadLng: 0.002 },
  { nome: 'Rua Professor Freitas e Castro', baseLat: -30.0705, baseLng: -51.2230, spreadLat: 0.002, spreadLng: 0.001 },
  { nome: 'Rua Coronel Aparício Borges', baseLat: -30.0760, baseLng: -51.2195, spreadLat: 0.003, spreadLng: 0.002 },
  { nome: 'Travessa dos Venezianos', baseLat: -30.0718, baseLng: -51.2205, spreadLat: 0.001, spreadLng: 0.001 },
];

/**
 * Gera um endereço aleatório numa das ruas da lista.
 */
export function randomAddress(rng: () => number): {
  rua: string;
  numero: string;
  lat: number;
  lng: number;
} {
  const street = STREETS[Math.floor(rng() * STREETS.length)];
  const numero = String(Math.floor(rng() * 1500) + 50);
  const lat = street.baseLat + (rng() - 0.5) * street.spreadLat;
  const lng = street.baseLng + (rng() - 0.5) * street.spreadLng;

  return { rua: street.nome, numero, lat, lng };
}
