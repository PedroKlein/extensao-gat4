/**
 * Curated data generator — produces 50 gestantes at real addresses
 * with intentional clinical scenarios for a convincing demo.
 */

import { faker } from '@faker-js/faker/locale/pt_BR';
import { CURATED_STREETS } from './curated-streets';
import { CURATED_MICROAREAS } from './curated-microareas';
import type { Gestante } from '../src/models/gestante';
import { writeFileSync, mkdirSync } from 'fs';
import { resolve, dirname } from 'path';

const SEED = 42;
faker.seed(SEED);

function formatDate(d: Date): string {
  return d.toISOString().split('T')[0];
}

function daysAgo(days: number): Date {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d;
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pickStreet(microarea?: string) {
  const pool = microarea
    ? CURATED_STREETS.filter(s => s.microarea === microarea)
    : CURATED_STREETS;
  const street = pool[randomInt(0, pool.length - 1)];
  // Add slight random offset so patients aren't exactly on the street center
  const offset = 0.0003; // ~33 meters
  return {
    rua: street.nome,
    numero: String(randomInt(10, 1500)),
    lat: street.lat + (Math.random() - 0.5) * offset,
    lng: street.lng + (Math.random() - 0.5) * offset,
    microarea: street.microarea,
  };
}

// Generate a patient with specific scenario
function makePatient(
  index: number,
  scenario: string,
  microarea?: string,
  forcedAddress?: { rua: string; numero: string; lat: number; lng: number; microarea: string }
): Gestante {
  const addr = forcedAddress || pickStreet(microarea);
  const age = randomInt(16, 42);
  const birthDate = new Date();
  birthDate.setFullYear(birthDate.getFullYear() - age);
  birthDate.setMonth(randomInt(0, 11));
  birthDate.setDate(randomInt(1, 28));

  const nome = faker.person.fullName({ sex: 'female' });
  const cns = String(randomInt(100000000000000, 999999999999999));
  const telefone = `51 9${randomInt(10000000, 99999999)}`;

  // Base gestante (will be modified by scenario)
  const gestante: Gestante = {
    id: `gest-${String(index + 1).padStart(3, '0')}`,
    nome,
    cns,
    dataNascimento: formatDate(birthDate),
    telefone,
    endereco: {
      rua: addr.rua,
      numero: addr.numero,
      lat: addr.lat,
      lng: addr.lng,
    },
    microarea: addr.microarea,
    consultas: {
      igAbertura: '<12 sem',
      dum: '',
      dpp: '',
      dataUltimaConsulta: '',
      numeroConsultas: 0,
      pressaoArterial: '120/80',
      acompanhamentoPesoAltura: 'Em dia',
      visitasDomiciliares: 0,
    },
    exames: {
      trPrimeiroTrimestre: 'Não Feito',
      trSegundoTrimestre: 'Não Feito',
      trTerceiroTrimestre: 'Não Feito',
      resultadoTR: 'Não realizado',
    },
    avaliacaoOdonto: 'Não realizada',
    vacinaDTpa: 'Não realizada',
    trSifilisHivPrimeiroTri: 'Não Feito',
    trSifilisHivTerceiroTri: 'Não Feito',
    isPuerpera: false,
    isExposta: false,
  };

  // Apply scenario
  applyScenario(gestante, scenario);
  return gestante;
}

function setDUM(g: Gestante, weeksAgo: number): void {
  const dum = daysAgo(weeksAgo * 7);
  const dpp = new Date(dum);
  dpp.setDate(dpp.getDate() + 280);
  g.consultas.dum = formatDate(dum);
  g.consultas.dpp = formatDate(dpp);
}

function applyScenario(g: Gestante, scenario: string): void {
  switch (scenario) {
    case 'normal-1tri': {
      setDUM(g, randomInt(6, 12));
      g.consultas.dataUltimaConsulta = formatDate(daysAgo(randomInt(3, 10)));
      g.consultas.numeroConsultas = randomInt(1, 2);
      g.consultas.visitasDomiciliares = 1;
      g.exames.trPrimeiroTrimestre = 'Feito';
      g.exames.resultadoTR = 'Não Reagente';
      g.avaliacaoOdonto = 'Agendada';
      g.vacinaDTpa = 'Não se aplica';
      g.consultas.acompanhamentoPesoAltura = 'Em dia';
      break;
    }
    case 'normal-2tri': {
      setDUM(g, randomInt(14, 26));
      g.consultas.dataUltimaConsulta = formatDate(daysAgo(randomInt(5, 12)));
      g.consultas.numeroConsultas = randomInt(3, 5);
      g.consultas.visitasDomiciliares = randomInt(1, 3);
      g.exames.trPrimeiroTrimestre = 'Feito';
      g.exames.trSegundoTrimestre = 'Feito';
      g.exames.resultadoTR = 'Não Reagente';
      g.avaliacaoOdonto = 'Realizada';
      g.vacinaDTpa = 'Realizada';
      break;
    }
    case 'normal-3tri': {
      setDUM(g, randomInt(28, 37));
      g.consultas.dataUltimaConsulta = formatDate(daysAgo(randomInt(3, 14)));
      g.consultas.numeroConsultas = randomInt(5, 8);
      g.consultas.visitasDomiciliares = randomInt(2, 4);
      g.exames.trPrimeiroTrimestre = 'Feito';
      g.exames.trSegundoTrimestre = 'Feito';
      g.exames.trTerceiroTrimestre = 'Feito';
      g.exames.resultadoTR = 'Não Reagente';
      g.avaliacaoOdonto = 'Realizada';
      g.vacinaDTpa = 'Realizada';
      break;
    }
    case 'consulta-atrasada-leve': {
      setDUM(g, randomInt(15, 30));
      g.consultas.dataUltimaConsulta = formatDate(daysAgo(randomInt(18, 40)));
      g.consultas.numeroConsultas = randomInt(2, 3);
      g.consultas.visitasDomiciliares = randomInt(0, 1);
      g.exames.trPrimeiroTrimestre = 'Feito';
      g.exames.trSegundoTrimestre = Math.random() > 0.5 ? 'Feito' : 'Não Feito';
      g.exames.resultadoTR = 'Não Reagente';
      g.avaliacaoOdonto = Math.random() > 0.5 ? 'Realizada' : 'Não realizada';
      break;
    }
    case 'consulta-atrasada-grave': {
      setDUM(g, randomInt(20, 35));
      g.consultas.dataUltimaConsulta = formatDate(daysAgo(randomInt(50, 80)));
      g.consultas.numeroConsultas = randomInt(1, 2);
      g.consultas.visitasDomiciliares = 0;
      g.exames.trPrimeiroTrimestre = 'Feito';
      g.exames.resultadoTR = 'Não Reagente';
      g.avaliacaoOdonto = 'Não realizada';
      g.vacinaDTpa = 'Não realizada';
      break;
    }
    case 'exposta-hiv': {
      setDUM(g, randomInt(12, 30));
      g.consultas.dataUltimaConsulta = formatDate(daysAgo(randomInt(5, 20)));
      g.consultas.numeroConsultas = randomInt(3, 6);
      g.consultas.visitasDomiciliares = randomInt(1, 3);
      g.exames.trPrimeiroTrimestre = 'Feito';
      g.exames.trSegundoTrimestre = 'Feito';
      g.exames.resultadoTR = 'Reagente';
      g.isExposta = true;
      g.avaliacaoOdonto = 'Realizada';
      g.vacinaDTpa = 'Realizada';
      g.exposicao = {
        hiv: {
          trRealizado: true,
          resultado: 'Reagente',
          confirmacaoLaboratorial: true,
          cargaViral: Math.random() > 0.5 ? '≥ 1.000 cópias/mL' : '< 50 cópias/mL',
          cd4: Math.random() > 0.5 ? '> 500 células/mm3' : '< 200 células/mm3',
          tarvIniciado: true,
          dataTarv: formatDate(daysAgo(randomInt(20, 90))),
        },
      };
      break;
    }
    case 'exposta-sifilis': {
      setDUM(g, randomInt(10, 28));
      g.consultas.dataUltimaConsulta = formatDate(daysAgo(randomInt(3, 15)));
      g.consultas.numeroConsultas = randomInt(3, 5);
      g.consultas.visitasDomiciliares = randomInt(1, 2);
      g.exames.trPrimeiroTrimestre = 'Feito';
      g.exames.resultadoTR = 'Reagente';
      g.isExposta = true;
      const doses = randomInt(1, 3);
      g.exposicao = {
        sifilis: {
          trRealizado: true,
          resultado: 'Reagente',
          dataTR: formatDate(daysAgo(randomInt(30, 90))),
          vdrlSolicitado: true,
          resultadoVDRL: `Reagente 1:${Math.pow(2, randomInt(1, 4))}`,
          tipoSifilis: (['Primária', 'Secundária', 'Latente'] as const)[randomInt(0, 2)],
          notificacao: true,
          dataPrimeiraDose: doses >= 1 ? formatDate(daysAgo(randomInt(30, 60))) : undefined,
          dataSegundaDose: doses >= 2 ? formatDate(daysAgo(randomInt(15, 29))) : undefined,
          dataTerceiraDose: doses >= 3 ? formatDate(daysAgo(randomInt(1, 14))) : undefined,
          vdrlControleRealizado: doses >= 3,
        },
      };
      break;
    }
    case 'exposta-hepb': {
      setDUM(g, randomInt(12, 30));
      g.consultas.dataUltimaConsulta = formatDate(daysAgo(randomInt(5, 15)));
      g.consultas.numeroConsultas = randomInt(3, 5);
      g.consultas.visitasDomiciliares = randomInt(1, 2);
      g.exames.trPrimeiroTrimestre = 'Feito';
      g.exames.resultadoTR = 'Reagente';
      g.isExposta = true;
      const vDoses = randomInt(1, 3);
      g.exposicao = {
        hepatiteB: {
          trRealizado: true,
          resultado: 'Reagente',
          dataTR: formatDate(daysAgo(randomInt(40, 100))),
          antiHBsSolicitado: true,
          resultadoAntiHBs: 'Não Reagente',
          vacinacaoIniciada: true,
          dataPrimeiraDoseVacina: vDoses >= 1 ? formatDate(daysAgo(randomInt(50, 80))) : undefined,
          dataSegundaDoseVacina: vDoses >= 2 ? formatDate(daysAgo(randomInt(20, 49))) : undefined,
          dataTerceiraDoseVacina: vDoses >= 3 ? formatDate(daysAgo(randomInt(1, 19))) : undefined,
        },
      };
      break;
    }
    case 'pressao-alta': {
      setDUM(g, randomInt(20, 35));
      g.consultas.dataUltimaConsulta = formatDate(daysAgo(randomInt(3, 10)));
      g.consultas.numeroConsultas = randomInt(4, 7);
      g.consultas.visitasDomiciliares = randomInt(2, 4);
      g.consultas.pressaoArterial = `${randomInt(140, 165)}/${randomInt(90, 110)}`;
      g.exames.trPrimeiroTrimestre = 'Feito';
      g.exames.trSegundoTrimestre = 'Feito';
      g.exames.resultadoTR = 'Não Reagente';
      g.avaliacaoOdonto = 'Realizada';
      g.vacinaDTpa = 'Realizada';
      break;
    }
    case 'dpp-proxima': {
      const diasParaDpp = randomInt(3, 25);
      const igWeeks = Math.floor((280 - diasParaDpp) / 7);
      setDUM(g, igWeeks);
      g.consultas.dataUltimaConsulta = formatDate(daysAgo(randomInt(3, 14)));
      g.consultas.numeroConsultas = randomInt(6, 9);
      g.consultas.visitasDomiciliares = randomInt(3, 5);
      g.exames.trPrimeiroTrimestre = 'Feito';
      g.exames.trSegundoTrimestre = 'Feito';
      g.exames.trTerceiroTrimestre = Math.random() > 0.3 ? 'Feito' : 'Não Feito';
      g.exames.resultadoTR = 'Não Reagente';
      g.avaliacaoOdonto = 'Realizada';
      g.vacinaDTpa = 'Realizada';
      break;
    }
    case 'puerpera-ok': {
      const diasPosParto = randomInt(5, 35);
      g.isPuerpera = true;
      setDUM(g, 40 + Math.floor(diasPosParto / 7));
      g.consultas.dataUltimaConsulta = formatDate(daysAgo(randomInt(2, 10)));
      g.consultas.numeroConsultas = randomInt(6, 9);
      g.exames.trPrimeiroTrimestre = 'Feito';
      g.exames.trSegundoTrimestre = 'Feito';
      g.exames.trTerceiroTrimestre = 'Feito';
      g.exames.resultadoTR = 'Não Reagente';
      g.vacinaDTpa = 'Realizada';
      g.posNatal = { consultaPuerperio: true, visitaDomiciliarPosNatal: true, avaliacaoOdontoPosNatal: Math.random() > 0.3 };
      break;
    }
    case 'puerpera-pendente': {
      const diasPosParto = randomInt(10, 40);
      g.isPuerpera = true;
      setDUM(g, 40 + Math.floor(diasPosParto / 7));
      g.consultas.dataUltimaConsulta = formatDate(daysAgo(randomInt(15, diasPosParto)));
      g.consultas.numeroConsultas = randomInt(4, 7);
      g.exames.trPrimeiroTrimestre = 'Feito';
      g.exames.trSegundoTrimestre = 'Feito';
      g.exames.trTerceiroTrimestre = 'Feito';
      g.exames.resultadoTR = 'Não Reagente';
      g.posNatal = { consultaPuerperio: false, visitaDomiciliarPosNatal: false, avaliacaoOdontoPosNatal: false };
      break;
    }
    case 'sem-odonto-sem-vd': {
      setDUM(g, randomInt(14, 30));
      g.consultas.dataUltimaConsulta = formatDate(daysAgo(randomInt(5, 14)));
      g.consultas.numeroConsultas = randomInt(2, 4);
      g.consultas.visitasDomiciliares = 0;
      g.exames.trPrimeiroTrimestre = 'Feito';
      g.exames.trSegundoTrimestre = Math.random() > 0.5 ? 'Feito' : 'Não Feito';
      g.exames.resultadoTR = 'Não Reagente';
      g.avaliacaoOdonto = 'Não realizada';
      break;
    }
    case 'vacina-pendente': {
      setDUM(g, randomInt(22, 34));
      g.consultas.dataUltimaConsulta = formatDate(daysAgo(randomInt(5, 14)));
      g.consultas.numeroConsultas = randomInt(3, 5);
      g.consultas.visitasDomiciliares = randomInt(1, 2);
      g.exames.trPrimeiroTrimestre = 'Feito';
      g.exames.trSegundoTrimestre = 'Feito';
      g.exames.resultadoTR = 'Não Reagente';
      g.avaliacaoOdonto = Math.random() > 0.5 ? 'Realizada' : 'Não realizada';
      g.vacinaDTpa = 'Não realizada';
      break;
    }
    case 'poucas-consultas': {
      setDUM(g, randomInt(24, 34));
      g.consultas.dataUltimaConsulta = formatDate(daysAgo(randomInt(10, 25)));
      g.consultas.numeroConsultas = randomInt(1, 2);
      g.consultas.visitasDomiciliares = randomInt(0, 1);
      g.exames.trPrimeiroTrimestre = 'Feito';
      g.exames.resultadoTR = 'Não Reagente';
      g.avaliacaoOdonto = 'Não realizada';
      g.vacinaDTpa = 'Não realizada';
      break;
    }
  }

  // Sync fields
  g.trSifilisHivPrimeiroTri = g.exames.trPrimeiroTrimestre;
  g.trSifilisHivTerceiroTri = g.exames.trTerceiroTrimestre;
}

// --- Define the 50 patients with intentional distribution ---
interface PatientSpec {
  scenario: string;
  microarea?: string;
  forcedAddress?: { rua: string; numero: string; lat: number; lng: number; microarea: string };
}

const PATIENT_SPECS: PatientSpec[] = [
  // Normal cases (35%) — distributed across all MAs
  { scenario: 'normal-1tri', microarea: 'MA1' },
  { scenario: 'normal-1tri', microarea: 'MA3' },
  { scenario: 'normal-2tri', microarea: 'MA1' },
  { scenario: 'normal-2tri', microarea: 'MA2' },
  { scenario: 'normal-2tri', microarea: 'MA3' },
  { scenario: 'normal-2tri', microarea: 'MA4' },
  { scenario: 'normal-2tri', microarea: 'MA5' },
  { scenario: 'normal-3tri', microarea: 'MA1' },
  { scenario: 'normal-3tri', microarea: 'MA2' },
  { scenario: 'normal-3tri', microarea: 'MA3' },
  { scenario: 'normal-3tri', microarea: 'MA4' },
  { scenario: 'normal-3tri', microarea: 'MA5' },
  { scenario: 'normal-2tri', microarea: 'MA1' },
  { scenario: 'normal-3tri', microarea: 'MA2' },
  { scenario: 'normal-1tri', microarea: 'MA4' },
  { scenario: 'normal-2tri', microarea: 'MA5' },
  { scenario: 'normal-3tri', microarea: 'MA3' },

  // Consulta atrasada (12 patients)
  { scenario: 'consulta-atrasada-leve', microarea: 'MA1' },
  { scenario: 'consulta-atrasada-leve', microarea: 'MA2' },
  { scenario: 'consulta-atrasada-leve', microarea: 'MA3' },
  { scenario: 'consulta-atrasada-leve', microarea: 'MA4' },
  { scenario: 'consulta-atrasada-leve', microarea: 'MA5' },
  { scenario: 'consulta-atrasada-grave', microarea: 'MA3' },
  { scenario: 'consulta-atrasada-grave', microarea: 'MA4' },
  { scenario: 'consulta-atrasada-grave', microarea: 'MA1' },

  // Expostas (8 patients)
  { scenario: 'exposta-hiv', microarea: 'MA2' },
  { scenario: 'exposta-hiv', microarea: 'MA4' },
  { scenario: 'exposta-sifilis', microarea: 'MA1' },
  { scenario: 'exposta-sifilis', microarea: 'MA3' },
  { scenario: 'exposta-sifilis', microarea: 'MA4' },
  { scenario: 'exposta-sifilis', microarea: 'MA5' },
  { scenario: 'exposta-hepb', microarea: 'MA2' },
  { scenario: 'exposta-hepb', microarea: 'MA5' },

  // Pressão alta (5 patients)
  { scenario: 'pressao-alta', microarea: 'MA1' },
  { scenario: 'pressao-alta', microarea: 'MA2' },
  { scenario: 'pressao-alta', microarea: 'MA3' },
  { scenario: 'pressao-alta', microarea: 'MA4' },
  { scenario: 'pressao-alta', microarea: 'MA5' },

  // DPP próxima (4 patients)
  { scenario: 'dpp-proxima', microarea: 'MA1' },
  { scenario: 'dpp-proxima', microarea: 'MA2' },
  { scenario: 'dpp-proxima', microarea: 'MA4' },
  { scenario: 'dpp-proxima', microarea: 'MA5' },

  // Puérperas (5 patients)
  { scenario: 'puerpera-ok', microarea: 'MA1' },
  { scenario: 'puerpera-ok', microarea: 'MA3' },
  { scenario: 'puerpera-pendente', microarea: 'MA2' },
  { scenario: 'puerpera-pendente', microarea: 'MA4' },
  { scenario: 'puerpera-pendente', microarea: 'MA5' },

  // Sem odonto + sem VD (3 patients)
  { scenario: 'sem-odonto-sem-vd', microarea: 'MA2' },
  { scenario: 'sem-odonto-sem-vd', microarea: 'MA3' },
  { scenario: 'sem-odonto-sem-vd', microarea: 'MA5' },

  // Vacina pendente (2 patients)
  { scenario: 'vacina-pendente', microarea: 'MA1' },
  { scenario: 'vacina-pendente', microarea: 'MA4' },

  // Poucas consultas (3 patients)
  { scenario: 'poucas-consultas', microarea: 'MA3' },
  { scenario: 'poucas-consultas', microarea: 'MA4' },
  { scenario: 'poucas-consultas', microarea: 'MA5' },
];

// --- Add household duplicates (same address) ---
// Two pairs will share addresses for the household grouping demo
const SHARED_ADDRESSES = [
  { rua: 'Rua Banco Inglês', numero: '245', lat: -30.0722844, lng: -51.2209007, microarea: 'MA2' },
  { rua: 'Rua Cruzeiro do Sul', numero: '890', lat: -30.0769872, lng: -51.2238590, microarea: 'MA4' },
];

// --- Generate ---
function main() {
  console.log(`Generating ${PATIENT_SPECS.length} curated gestantes...`);

  const gestantes: Gestante[] = [];

  for (let i = 0; i < PATIENT_SPECS.length; i++) {
    const spec = PATIENT_SPECS[i];
    let forcedAddr = spec.forcedAddress;

    // Force shared addresses for first 2 patients in MA2 and MA4
    if (i === 3) forcedAddr = SHARED_ADDRESSES[0]; // normal-2tri MA2 → shared addr 1
    if (i === 17) forcedAddr = SHARED_ADDRESSES[0]; // consulta-atrasada-leve MA1 → same addr (household)
    if (i === 19) forcedAddr = SHARED_ADDRESSES[1]; // consulta-atrasada-leve MA3 → shared addr 2
    if (i === 21) forcedAddr = SHARED_ADDRESSES[1]; // consulta-atrasada-leve MA5 → same addr (household)

    const g = makePatient(i, spec.scenario, spec.microarea, forcedAddr);
    gestantes.push(g);
  }

  // Write output
  const outDir = resolve(dirname(new URL(import.meta.url).pathname), '../src/data');
  mkdirSync(outDir, { recursive: true });

  writeFileSync(resolve(outDir, 'gestantes.json'), JSON.stringify(gestantes, null, 2), 'utf-8');
  console.log(`✓ Written ${gestantes.length} gestantes to src/data/gestantes.json`);

  writeFileSync(resolve(outDir, 'microareas.json'), JSON.stringify(CURATED_MICROAREAS, null, 2), 'utf-8');
  console.log(`✓ Written ${CURATED_MICROAREAS.length} microáreas to src/data/microareas.json`);

  // Stats
  const expostas = gestantes.filter(g => g.isExposta).length;
  const puerperas = gestantes.filter(g => g.isPuerpera).length;
  const byMA: Record<string, number> = {};
  for (const g of gestantes) {
    byMA[g.microarea] = (byMA[g.microarea] || 0) + 1;
  }
  console.log(`\nDistribution:`);
  console.log(`  Total: ${gestantes.length}`);
  console.log(`  Expostas: ${expostas} (${(expostas / gestantes.length * 100).toFixed(0)}%)`);
  console.log(`  Puérperas: ${puerperas} (${(puerperas / gestantes.length * 100).toFixed(0)}%)`);
  console.log(`  By microárea:`, byMA);
}

main();
