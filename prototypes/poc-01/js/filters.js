// filters.js — Filtering logic

const FiltersModule = (() => {
  let state = {
    condicoes: ['gestante', 'tuberculose', 'cronico', 'acamado', 'transmissivel'],
    microarea: 'todas',
    urgencias: ['atrasado', 'proximo', 'emdia']
  };

  function getState() { return state; }

  function setCondicoes(condicoes) { state.condicoes = condicoes; }
  function setMicroarea(microarea) { state.microarea = microarea; }
  function setUrgencias(urgencias) { state.urgencias = urgencias; }

  function aplicar(pacientes) {
    return pacientes.filter(p => {
      if (!state.condicoes.includes(p.condicao)) return false;
      if (state.microarea !== 'todas' && p.microarea !== parseInt(state.microarea)) return false;
      if (!state.urgencias.includes(p.urgencia)) return false;
      return true;
    });
  }

  function contarPorCondicao(pacientes) {
    const counts = {};
    pacientes.forEach(p => {
      counts[p.condicao] = (counts[p.condicao] || 0) + 1;
    });
    return counts;
  }

  function contarPorUrgencia(pacientes) {
    const counts = { atrasado: 0, proximo: 0, emdia: 0 };
    pacientes.forEach(p => {
      counts[p.urgencia] = (counts[p.urgencia] || 0) + 1;
    });
    return counts;
  }

  function contarPorMicroarea(pacientes) {
    const counts = {};
    pacientes.forEach(p => {
      counts[p.microarea] = (counts[p.microarea] || 0) + 1;
    });
    return counts;
  }

  return {
    getState,
    setCondicoes,
    setMicroarea,
    setUrgencias,
    aplicar,
    contarPorCondicao,
    contarPorUrgencia,
    contarPorMicroarea
  };
})();
