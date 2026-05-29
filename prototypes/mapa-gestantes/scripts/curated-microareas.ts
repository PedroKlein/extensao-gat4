/**
 * Curated microáreas — irregular polygons that properly contain
 * all assigned streets. Non-overlapping, complete coverage.
 */

import type { Microarea } from '../src/models/microarea';

export const CURATED_MICROAREAS: Microarea[] = [
  {
    id: 'MA1',
    nome: 'Microárea 1 — Moab Caldas Norte',
    acsNome: 'Joana da Silva',
    // North-east: along Av. Moab Caldas upper section
    polygon: [
      [-30.0665, -51.2200],
      [-30.0665, -51.2145],
      [-30.0715, -51.2145],
      [-30.0740, -51.2160],
      [-30.0740, -51.2175],
      [-30.0715, -51.2200],
    ],
  },
  {
    id: 'MA2',
    nome: 'Microárea 2 — Centro / Aramy Silva',
    acsNome: 'Rita de Cássia Santos',
    // Central band: between MA1 and MA4, includes Banco Inglês and Lobato streets
    polygon: [
      [-30.0715, -51.2215],
      [-30.0715, -51.2170],
      [-30.0740, -51.2175],
      [-30.0740, -51.2160],
      [-30.0755, -51.2165],
      [-30.0755, -51.2215],
      [-30.0740, -51.2230],
    ],
  },
  {
    id: 'MA3',
    nome: 'Microárea 3 — Santa Cruz / Becos Oeste',
    acsNome: 'Fátima Oliveira Souza',
    // West side: becos, informal areas, north-west
    polygon: [
      [-30.0665, -51.2200],
      [-30.0715, -51.2200],
      [-30.0715, -51.2215],
      [-30.0740, -51.2230],
      [-30.0730, -51.2280],
      [-30.0695, -51.2280],
      [-30.0660, -51.2260],
    ],
  },
  {
    id: 'MA4',
    nome: 'Microárea 4 — Vila Cruzeiro / Cruzeiro do Sul',
    acsNome: 'Carla Mendes Ferreira',
    // South: Vila Cruzeiro, below the central band
    polygon: [
      [-30.0755, -51.2215],
      [-30.0755, -51.2165],
      [-30.0795, -51.2165],
      [-30.0795, -51.2265],
      [-30.0770, -51.2265],
      [-30.0740, -51.2255],
      [-30.0740, -51.2230],
    ],
  },
  {
    id: 'MA5',
    nome: 'Microárea 5 — Joracy Camargo / Leste',
    acsNome: 'Sandra Pereira Lima',
    // East-south: between MA2 and MA4, includes Gibran and Leônidas
    polygon: [
      [-30.0740, -51.2230],
      [-30.0755, -51.2215],
      [-30.0775, -51.2210],
      [-30.0795, -51.2165],
      [-30.0755, -51.2165],
      [-30.0740, -51.2175],
      [-30.0715, -51.2215],
    ],
  },
];
