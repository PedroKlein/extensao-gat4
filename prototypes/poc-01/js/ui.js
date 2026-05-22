// ui.js — UI updates (summary, counts, events)

const UIModule = (() => {

  function atualizarContagens(pacientes) {
    const porCondicao = FiltersModule.contarPorCondicao(pacientes);
    const porUrgencia = FiltersModule.contarPorUrgencia(pacientes);

    // Update condition counts
    Object.keys(DataModule.getCondicaoMeta()).forEach(cond => {
      const el = document.getElementById(`count-${cond}`);
      if (el) el.textContent = porCondicao[cond] || 0;
    });

    // Update urgency counts
    document.getElementById('count-atrasado').textContent = porUrgencia.atrasado;
    document.getElementById('count-proximo').textContent = porUrgencia.proximo;
    document.getElementById('count-emdia').textContent = porUrgencia.emdia;
  }

  function atualizarResumo(pacientesFiltrados, todosPacientes) {
    const porUrgencia = FiltersModule.contarPorUrgencia(pacientesFiltrados);
    const porMicroarea = FiltersModule.contarPorMicroarea(pacientesFiltrados);

    const grid = document.getElementById('summary-grid');
    grid.innerHTML = `
      <div class="summary-card">
        <div class="num" style="color:var(--red)">${porUrgencia.atrasado}</div>
        <div class="label">Atrasados</div>
      </div>
      <div class="summary-card">
        <div class="num" style="color:var(--yellow)">${porUrgencia.proximo}</div>
        <div class="label">Próximos</div>
      </div>
      <div class="summary-card">
        <div class="num" style="color:var(--green)">${porUrgencia.emdia}</div>
        <div class="label">Em dia</div>
      </div>
      <div class="summary-card">
        <div class="num">${pacientesFiltrados.length}</div>
        <div class="label">Visíveis</div>
      </div>
    `;
  }

  function bindEventos(onFilterChange) {
    // Condition checkboxes
    document.querySelectorAll('[data-condicao]').forEach(cb => {
      cb.addEventListener('change', () => {
        const ativas = [];
        document.querySelectorAll('[data-condicao]').forEach(el => {
          if (el.checked) ativas.push(el.dataset.condicao);
        });
        FiltersModule.setCondicoes(ativas);
        onFilterChange();
      });
    });

    // Microarea select
    document.getElementById('filter-microarea').addEventListener('change', (e) => {
      FiltersModule.setMicroarea(e.target.value);
      onFilterChange();
    });

    // Urgency checkboxes
    document.querySelectorAll('[data-urgencia]').forEach(cb => {
      cb.addEventListener('change', () => {
        const ativas = [];
        document.querySelectorAll('[data-urgencia]').forEach(el => {
          if (el.checked) ativas.push(el.dataset.urgencia);
        });
        FiltersModule.setUrgencias(ativas);
        onFilterChange();
      });
    });

    // Layer toggles
    document.getElementById('toggle-microareas').addEventListener('change', (e) => {
      MapModule.toggleMicroareas(e.target.checked);
    });
    document.getElementById('toggle-equipamentos').addEventListener('change', (e) => {
      MapModule.toggleEquipamentos(e.target.checked);
    });

    // CSV upload
    document.getElementById('csv-upload').addEventListener('change', async (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const novos = await DataModule.carregarCSV(file);
      document.getElementById('upload-info').textContent =
        `Carregado: ${file.name} (${novos.length} pacientes)`;
      onFilterChange();
    });
  }

  return { atualizarContagens, atualizarResumo, bindEventos };
})();
