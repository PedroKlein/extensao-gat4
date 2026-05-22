// data.js — Data loading and parsing

const DataModule = (() => {
  let pacientes = [];
  let microareas = null;
  let equipamentos = null;

  const CONDICAO_META = {
    gestante:      { label: 'Gestante',       icone: '🤰', cor: '#e91e8f' },
    tuberculose:   { label: 'Tuberculose',    icone: '🫁', cor: '#7c3aed' },
    cronico:       { label: 'Crônico',        icone: '💊', cor: '#2563eb' },
    acamado:       { label: 'Acamado',        icone: '🛏️', cor: '#d97706' },
    transmissivel: { label: 'Transmissível',  icone: '⚠️', cor: '#dc2626' }
  };

  function calcularUrgencia(proximo) {
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    const data = new Date(proximo + 'T00:00:00');
    const diffDias = Math.floor((data - hoje) / (1000 * 60 * 60 * 24));

    if (diffDias < 0) return 'atrasado';
    if (diffDias <= 7) return 'proximo';
    return 'emdia';
  }

  function parsePacientesCSV(csvText) {
    const result = Papa.parse(csvText, { header: true, skipEmptyLines: true });
    return result.data.map(row => ({
      id: row.id,
      lat: parseFloat(row.lat),
      lng: parseFloat(row.lng),
      condicao: row.condicao,
      microarea: parseInt(row.microarea),
      ultimoAcomp: row.ultimo_acompanhamento,
      proximoAcomp: row.proximo_acompanhamento,
      endereco: row.endereco,
      observacao: row.observacao,
      urgencia: calcularUrgencia(row.proximo_acompanhamento)
    })).filter(p => !isNaN(p.lat) && !isNaN(p.lng));
  }

  async function carregarDadosIniciais() {
    // Load CSV
    const csvResp = await fetch('data/pacientes.csv');
    const csvText = await csvResp.text();
    pacientes = parsePacientesCSV(csvText);

    // Load GeoJSON
    const microResp = await fetch('data/microareas.geojson');
    microareas = await microResp.json();

    const equipResp = await fetch('data/equipamentos.geojson');
    equipamentos = await equipResp.json();

    return { pacientes, microareas, equipamentos };
  }

  function carregarCSV(file) {
    return new Promise((resolve) => {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (result) => {
          pacientes = result.data.map(row => ({
            id: row.id,
            lat: parseFloat(row.lat),
            lng: parseFloat(row.lng),
            condicao: row.condicao,
            microarea: parseInt(row.microarea),
            ultimoAcomp: row.ultimo_acompanhamento,
            proximoAcomp: row.proximo_acompanhamento,
            endereco: row.endereco,
            observacao: row.observacao,
            urgencia: calcularUrgencia(row.proximo_acompanhamento)
          })).filter(p => !isNaN(p.lat) && !isNaN(p.lng));
          resolve(pacientes);
        }
      });
    });
  }

  function getPacientes() { return pacientes; }
  function getMicroareas() { return microareas; }
  function getEquipamentos() { return equipamentos; }
  function getCondicaoMeta() { return CONDICAO_META; }

  return {
    carregarDadosIniciais,
    carregarCSV,
    getPacientes,
    getMicroareas,
    getEquipamentos,
    getCondicaoMeta,
    calcularUrgencia
  };
})();
