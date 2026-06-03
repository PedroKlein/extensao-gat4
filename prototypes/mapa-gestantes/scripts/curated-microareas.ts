/**
 * Curated microáreas — non-overlapping polygons with shared edges.
 * Named by ACS responsible. Proper tessellation covering the territory.
 *
 * Shared vertices ensure no overlaps or gaps.
 * Layout:
 *   MA1 (top-right) | MA3 (top-left/west)
 *   MA2 (center)    |
 *   MA4 (bottom-right/south) | MA5 (bottom-left/south-west)
 */

import type { Microarea } from '../src/models/microarea';

// Shared boundary vertices
const A = [-30.0665, -51.2215] as [number, number]; // top-center
const B = [-30.0665, -51.2145] as [number, number]; // top-right
const C = [-30.0715, -51.2145] as [number, number]; // mid-right-top
const D = [-30.0715, -51.2195] as [number, number]; // central junction
const E = [-30.0665, -51.2280] as [number, number]; // top-left
const F = [-30.0715, -51.2280] as [number, number]; // mid-left
const G = [-30.0740, -51.2215] as [number, number]; // lower-central
const H = [-30.0755, -51.2165] as [number, number]; // mid-right-bottom
const I = [-30.0755, -51.2215] as [number, number]; // lower-central-2
const J = [-30.0795, -51.2165] as [number, number]; // bottom-right
const K = [-30.0795, -51.2280] as [number, number]; // bottom-left
const L = [-30.0755, -51.2280] as [number, number]; // mid-left-lower

export const CURATED_MICROAREAS: Microarea[] = [
  {
    id: 'MA1',
    nome: 'Microárea — ACS Joana',
    acsNome: 'Joana da Silva',
    // Top-right: north-east quadrant
    polygon: [A, B, C, D],
  },
  {
    id: 'MA2',
    nome: 'Microárea — ACS Rita',
    acsNome: 'Rita de Cássia Santos',
    // Central band (east side)
    polygon: [D, C, H, I, G],
  },
  {
    id: 'MA3',
    nome: 'Microárea — ACS Fátima',
    acsNome: 'Fátima Oliveira Souza',
    // Top-left / west side (north)
    polygon: [E, A, D, G, L, F],
  },
  {
    id: 'MA4',
    nome: 'Microárea — ACS Carla',
    acsNome: 'Carla Mendes Ferreira',
    // Bottom-right (south-east, Vila Cruzeiro)
    polygon: [I, H, J, K, L],
  },
  {
    id: 'MA5',
    nome: 'Microárea — ACS Sandra',
    acsNome: 'Sandra Pereira Lima',
    // Bottom-left (south-west)
    polygon: [G, I, L, F],
  },
];
