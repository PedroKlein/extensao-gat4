// app.js — Main entry point

(async function init() {
  // Mobile sidebar toggle
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebar-overlay');
  const menuBtn = document.getElementById('menu-toggle');

  function toggleSidebar() {
    sidebar.classList.toggle('open');
    overlay.classList.toggle('active');
  }
  menuBtn.addEventListener('click', toggleSidebar);
  overlay.addEventListener('click', toggleSidebar);

  // Initialize map
  MapModule.init();

  // Load data
  const { pacientes, microareas, equipamentos } = await DataModule.carregarDadosIniciais();

  // Render static layers
  MapModule.renderMicroareas(microareas);
  MapModule.renderEquipamentos(equipamentos);

  // Main render function
  function renderizar() {
    const todos = DataModule.getPacientes();
    const filtrados = FiltersModule.aplicar(todos);

    MapModule.renderMarcadores(filtrados);
    UIModule.atualizarContagens(todos);
    UIModule.atualizarResumo(filtrados, todos);
  }

  // Bind UI events
  UIModule.bindEventos(renderizar);

  // Initial render
  renderizar();
})();
