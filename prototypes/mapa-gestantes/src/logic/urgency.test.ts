import { describe, it, expect } from 'vitest';
import { calculateUrgency } from './urgency';
import { daysBetween, calculateIG, getTrimester, calculateDPP, distanceMeters } from './dates';
import type { Gestante } from '../models';

// Helper to create a base gestante for testing
function makeGestante(overrides: Partial<Gestante> = {}): Gestante {
  const today = new Date();
  const dum = new Date(today);
  dum.setDate(dum.getDate() - 20 * 7); // 20 weeks ago

  const lastConsult = new Date(today);
  lastConsult.setDate(lastConsult.getDate() - 10); // 10 days ago

  return {
    id: 'test-1',
    nome: 'Maria Teste',
    cns: '123456789012345',
    dataNascimento: '1994-11-12',
    telefone: '51999999999',
    endereco: { rua: 'Av. Moab Caldas', numero: '100', lat: -30.073, lng: -51.220 },
    microarea: 'MA1',
    consultas: {
      igAbertura: '<12 sem',
      dum: dum.toISOString().split('T')[0],
      dpp: calculateDPP(dum.toISOString().split('T')[0]),
      dataUltimaConsulta: lastConsult.toISOString().split('T')[0],
      dataProximaConsulta: undefined,
      numeroConsultas: 4,
      pressaoArterial: '120/80',
      acompanhamentoPesoAltura: 'Em dia',
      visitasDomiciliares: 2,
    },
    exames: {
      trPrimeiroTrimestre: 'Feito',
      trSegundoTrimestre: 'Feito',
      trTerceiroTrimestre: 'Não se aplica',
      resultadoTR: 'Não Reagente',
    },
    avaliacaoOdonto: 'Realizada',
    vacinaDTpa: 'Realizada',
    trSifilisHivPrimeiroTri: 'Feito',
    trSifilisHivTerceiroTri: 'Não se aplica',
    isPuerpera: false,
    isExposta: false,
    ...overrides,
  };
}

describe('dates helpers', () => {
  it('daysBetween calculates correctly', () => {
    expect(daysBetween('2026-01-01', '2026-01-11')).toBe(10);
    expect(daysBetween('2026-01-01', '2026-02-01')).toBe(31);
  });

  it('calculateIG returns weeks from DUM', () => {
    const today = new Date();
    const dum = new Date(today);
    dum.setDate(dum.getDate() - 24 * 7); // 24 weeks ago
    expect(calculateIG(dum.toISOString().split('T')[0])).toBe(24);
  });

  it('getTrimester maps weeks correctly', () => {
    expect(getTrimester(1)).toBe(1);
    expect(getTrimester(13)).toBe(1);
    expect(getTrimester(14)).toBe(2);
    expect(getTrimester(27)).toBe(2);
    expect(getTrimester(28)).toBe(3);
    expect(getTrimester(40)).toBe(3);
  });

  it('calculateDPP adds 280 days to DUM', () => {
    expect(calculateDPP('2025-12-03')).toBe('2026-09-09');
  });

  it('distanceMeters calculates reasonable distance', () => {
    // US Moab to a point ~500m away
    const d = distanceMeters(-30.0729573, -51.2201539, -30.0770, -51.2201);
    expect(d).toBeGreaterThan(400);
    expect(d).toBeLessThan(600);
  });
});

describe('urgency score calculation', () => {
  it('returns normal for gestante with everything OK', () => {
    const g = makeGestante();
    const result = calculateUrgency(g);
    expect(result.category).toBe('normal');
    expect(result.score).toBe(0);
    expect(result.alerts).toHaveLength(0);
  });

  it('TR reagente → critico + 50 points', () => {
    const g = makeGestante({
      exames: {
        trPrimeiroTrimestre: 'Feito',
        trSegundoTrimestre: 'Feito',
        trTerceiroTrimestre: 'Não se aplica',
        resultadoTR: 'Reagente',
      },
      isExposta: true,
    });
    const result = calculateUrgency(g);
    expect(result.category).toBe('critico');
    expect(result.score).toBeGreaterThanOrEqual(50);
    expect(result.alerts.some(a => a.code === 'TR_REAGENTE')).toBe(true);
  });

  it('PA elevada (140/90) → critico + 40 points', () => {
    const g = makeGestante({
      consultas: {
        ...makeGestante().consultas,
        pressaoArterial: '140/90',
      },
    });
    const result = calculateUrgency(g);
    expect(result.category).toBe('critico');
    expect(result.score).toBeGreaterThanOrEqual(40);
    expect(result.alerts.some(a => a.code === 'PA_ELEVADA')).toBe(true);
  });

  it('PA 150/100 → critico', () => {
    const g = makeGestante({
      consultas: { ...makeGestante().consultas, pressaoArterial: '150/100' },
    });
    const result = calculateUrgency(g);
    expect(result.category).toBe('critico');
  });

  it('consulta atrasada 20 dias → atencao', () => {
    const today = new Date();
    const lastConsult = new Date(today);
    lastConsult.setDate(lastConsult.getDate() - 20);

    const g = makeGestante({
      consultas: {
        ...makeGestante().consultas,
        dataUltimaConsulta: lastConsult.toISOString().split('T')[0],
      },
    });
    const result = calculateUrgency(g);
    expect(result.category).toBe('atencao');
    expect(result.alerts.some(a => a.code === 'CONSULTA_ATRASADA')).toBe(true);
  });

  it('consulta atrasada 60 dias → critico', () => {
    const today = new Date();
    const lastConsult = new Date(today);
    lastConsult.setDate(lastConsult.getDate() - 60);

    const g = makeGestante({
      consultas: {
        ...makeGestante().consultas,
        dataUltimaConsulta: lastConsult.toISOString().split('T')[0],
      },
    });
    const result = calculateUrgency(g);
    expect(result.category).toBe('critico');
    expect(result.alerts.some(a => a.code === 'CONSULTA_MUITO_ATRASADA')).toBe(true);
  });

  it('sem odonto → atencao + 5 points', () => {
    const g = makeGestante({ avaliacaoOdonto: 'Não realizada' });
    const result = calculateUrgency(g);
    expect(result.category).toBe('atencao');
    expect(result.score).toBe(5);
    expect(result.alerts.some(a => a.code === 'SEM_ODONTO')).toBe(true);
  });

  it('DTpa pendente >20 weeks → atencao + 5 points', () => {
    // Create a gestante at 22 weeks (past the 20-week threshold)
    const today = new Date();
    const dum = new Date(today);
    dum.setDate(dum.getDate() - 22 * 7); // 22 weeks ago
    const lastConsult = new Date(today);
    lastConsult.setDate(lastConsult.getDate() - 10);

    const g = makeGestante({
      vacinaDTpa: 'Não realizada',
      consultas: {
        ...makeGestante().consultas,
        dum: dum.toISOString().split('T')[0],
        dpp: calculateDPP(dum.toISOString().split('T')[0]),
        dataUltimaConsulta: lastConsult.toISOString().split('T')[0],
      },
    });
    const result = calculateUrgency(g);
    expect(result.alerts.some(a => a.code === 'DTPA_PENDENTE')).toBe(true);
    expect(result.score).toBeGreaterThanOrEqual(5);
  });

  it('sem VD → atencao + 10 points', () => {
    const g = makeGestante({
      consultas: { ...makeGestante().consultas, visitasDomiciliares: 0 },
    });
    const result = calculateUrgency(g);
    expect(result.alerts.some(a => a.code === 'SEM_VD')).toBe(true);
    expect(result.score).toBeGreaterThanOrEqual(10);
  });

  it('combined: exposta + consulta atrasada = score sums', () => {
    const today = new Date();
    const lastConsult = new Date(today);
    lastConsult.setDate(lastConsult.getDate() - 30);

    const g = makeGestante({
      exames: {
        trPrimeiroTrimestre: 'Feito',
        trSegundoTrimestre: 'Feito',
        trTerceiroTrimestre: 'Não se aplica',
        resultadoTR: 'Reagente',
      },
      isExposta: true,
      consultas: {
        ...makeGestante().consultas,
        dataUltimaConsulta: lastConsult.toISOString().split('T')[0],
      },
    });
    const result = calculateUrgency(g);
    expect(result.category).toBe('critico');
    // TR: 50 + days: (30-14)*2 = 32 → total >= 82
    expect(result.score).toBeGreaterThanOrEqual(80);
  });
});

describe('urgency puérpera logic', () => {
  it('puérpera sem registro pós-natal → critico', () => {
    const g = makeGestante({ isPuerpera: true, posNatal: undefined });
    const result = calculateUrgency(g);
    expect(result.category).toBe('critico');
    expect(result.alerts.some(a => a.code === 'SEM_ACOMP_POSNATAL')).toBe(true);
  });

  it('puérpera com tudo em dia → normal', () => {
    const today = new Date();
    const lastConsult = new Date(today);
    lastConsult.setDate(lastConsult.getDate() - 5);

    const g = makeGestante({
      isPuerpera: true,
      consultas: {
        ...makeGestante().consultas,
        dataUltimaConsulta: lastConsult.toISOString().split('T')[0],
      },
      posNatal: {
        consultaPuerperio: true,
        visitaDomiciliarPosNatal: true,
        avaliacaoOdontoPosNatal: true,
      },
    });
    const result = calculateUrgency(g);
    expect(result.category).toBe('normal');
    expect(result.alerts).toHaveLength(0);
  });

  it('puérpera sem consulta puerpério → critico', () => {
    const today = new Date();
    const lastConsult = new Date(today);
    lastConsult.setDate(lastConsult.getDate() - 5);

    const g = makeGestante({
      isPuerpera: true,
      consultas: {
        ...makeGestante().consultas,
        dataUltimaConsulta: lastConsult.toISOString().split('T')[0],
      },
      posNatal: {
        consultaPuerperio: false,
        visitaDomiciliarPosNatal: true,
        avaliacaoOdontoPosNatal: true,
      },
    });
    const result = calculateUrgency(g);
    expect(result.category).toBe('critico');
    expect(result.alerts.some(a => a.code === 'SEM_CONSULTA_PUERPERIO')).toBe(true);
  });

  it('puérpera sem VD pós-natal → atencao', () => {
    const today = new Date();
    const lastConsult = new Date(today);
    lastConsult.setDate(lastConsult.getDate() - 5);

    const g = makeGestante({
      isPuerpera: true,
      consultas: {
        ...makeGestante().consultas,
        dataUltimaConsulta: lastConsult.toISOString().split('T')[0],
      },
      posNatal: {
        consultaPuerperio: true,
        visitaDomiciliarPosNatal: false,
        avaliacaoOdontoPosNatal: true,
      },
    });
    const result = calculateUrgency(g);
    expect(result.category).toBe('atencao');
    expect(result.alerts.some(a => a.code === 'SEM_VD_POSNATAL')).toBe(true);
  });
});
