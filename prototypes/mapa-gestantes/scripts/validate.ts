/**
 * Validation script — checks generated data for clinical coherence.
 */

import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import type { Gestante } from '../src/models/gestante';

const dataPath = resolve(dirname(new URL(import.meta.url).pathname), '../src/data/gestantes.json');
const gestantes: Gestante[] = JSON.parse(readFileSync(dataPath, 'utf-8'));

let errors = 0;
let warnings = 0;

function error(id: string, msg: string) {
  console.error(`❌ [${id}] ${msg}`);
  errors++;
}

function warn(id: string, msg: string) {
  console.warn(`⚠️  [${id}] ${msg}`);
  warnings++;
}

// US Moab center
const US_LAT = -30.0729573;
const US_LNG = -51.2201539;
const MAX_RADIUS_KM = 2.0;

for (const g of gestantes) {
  // Required fields
  if (!g.id) error(g.id, 'Missing id');
  if (!g.nome) error(g.id, 'Missing nome');
  if (!g.cns || g.cns.length < 10) error(g.id, `Invalid CNS: ${g.cns}`);
  if (!g.dataNascimento) error(g.id, 'Missing dataNascimento');
  if (!g.endereco?.rua) error(g.id, 'Missing endereco.rua');
  if (!g.endereco?.lat || !g.endereco?.lng) error(g.id, 'Missing coordinates');

  // Coords within radius
  if (g.endereco?.lat && g.endereco?.lng) {
    const dLat = (g.endereco.lat - US_LAT) * 111;
    const dLng = (g.endereco.lng - US_LNG) * 111 * Math.cos(US_LAT * Math.PI / 180);
    const dist = Math.sqrt(dLat * dLat + dLng * dLng);
    if (dist > MAX_RADIUS_KM) {
      error(g.id, `Coords too far from US Moab: ${dist.toFixed(2)}km`);
    }
  }

  // Date coherence
  if (!g.isPuerpera && g.consultas.dum) {
    const dum = new Date(g.consultas.dum);
    const dpp = new Date(g.consultas.dpp);
    const expectedDpp = new Date(dum);
    expectedDpp.setDate(expectedDpp.getDate() + 280);

    const diffDays = Math.abs((dpp.getTime() - expectedDpp.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays > 3) {
      warn(g.id, `DPP inconsistent with DUM+280: off by ${diffDays.toFixed(0)} days`);
    }

    // IG should be positive and < 45 weeks
    const igDays = (new Date().getTime() - dum.getTime()) / (1000 * 60 * 60 * 24);
    const igWeeks = igDays / 7;
    if (igWeeks < 0) {
      error(g.id, `Negative IG: DUM is in the future`);
    }
    if (igWeeks > 44 && !g.isPuerpera) {
      warn(g.id, `IG > 44 weeks but not marked as puérpera`);
    }
  }

  // Exam coherence
  if (g.exames.resultadoTR === 'Reagente' && !g.isExposta) {
    error(g.id, 'TR Reagente but isExposta=false');
  }

  // Last consultation should be in the past
  if (g.consultas.dataUltimaConsulta) {
    const lastConsult = new Date(g.consultas.dataUltimaConsulta);
    if (lastConsult > new Date()) {
      error(g.id, `dataUltimaConsulta is in the future: ${g.consultas.dataUltimaConsulta}`);
    }
  }
}

console.log(`\n=== Validation Results ===`);
console.log(`Total patients: ${gestantes.length}`);
console.log(`Errors: ${errors}`);
console.log(`Warnings: ${warnings}`);

if (errors > 0) {
  process.exit(1);
} else {
  console.log('✅ All validations passed!');
}
