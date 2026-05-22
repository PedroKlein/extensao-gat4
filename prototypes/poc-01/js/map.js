// map.js — Map initialization and layer management

const MapModule = (() => {
  let map = null;
  let markersLayer = null;
  let microareasLayer = null;
  let equipamentosLayer = null;

  const URGENCIA_CORES = {
    atrasado: '#e53e3e',
    proximo: '#d69e2e',
    emdia: '#38a169'
  };

  function init() {
    map = L.map('map').setView([-30.0740, -51.2210], 16);

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap'
    }).addTo(map);

    markersLayer = L.layerGroup().addTo(map);
    microareasLayer = L.layerGroup().addTo(map);
    equipamentosLayer = L.layerGroup().addTo(map);

    return map;
  }

  function criarMarcador(paciente) {
    const meta = DataModule.getCondicaoMeta()[paciente.condicao] || {};
    const corUrgencia = URGENCIA_CORES[paciente.urgencia];

    const icon = L.divIcon({
      className: 'custom-marker',
      html: `<div style="
        width: 28px; height: 28px; border-radius: 50%;
        background: ${corUrgencia}; border: 3px solid #fff;
        box-shadow: 0 2px 6px rgba(0,0,0,0.3);
        display: flex; align-items: center; justify-content: center;
        font-size: 13px;
      ">${meta.icone || '?'}</div>`,
      iconSize: [28, 28],
      iconAnchor: [14, 14],
      popupAnchor: [0, -16]
    });

    const urgenciaLabel = {
      atrasado: 'Atrasado',
      proximo: 'Próximo',
      emdia: 'Em dia'
    };

    const diasAtraso = (() => {
      const hoje = new Date();
      const prox = new Date(paciente.proximoAcomp + 'T00:00:00');
      const diff = Math.floor((prox - hoje) / (1000 * 60 * 60 * 24));
      if (diff < 0) return `${Math.abs(diff)} dias atrasado`;
      if (diff === 0) return 'Vence hoje';
      return `em ${diff} dias`;
    })();

    const popupHtml = `
      <div class="patient-popup">
        <h4>${meta.icone} ${paciente.id} <span class="status-badge status-${paciente.urgencia}">${urgenciaLabel[paciente.urgencia]}</span></h4>
        <p class="detail"><strong>Condição:</strong> ${meta.label}</p>
        <p class="detail"><strong>Microárea:</strong> ${paciente.microarea}</p>
        <p class="detail"><strong>Endereço:</strong> ${paciente.endereco}</p>
        <p class="detail"><strong>Último acomp.:</strong> ${formatDate(paciente.ultimoAcomp)}</p>
        <p class="detail"><strong>Próximo:</strong> ${formatDate(paciente.proximoAcomp)} (${diasAtraso})</p>
        ${paciente.observacao ? `<p class="detail"><strong>Obs:</strong> ${paciente.observacao}</p>` : ''}
      </div>
    `;

    const marker = L.marker([paciente.lat, paciente.lng], { icon });
    marker.bindPopup(popupHtml);
    marker.pacienteData = paciente;
    return marker;
  }

  function formatDate(isoStr) {
    if (!isoStr) return '—';
    const [y, m, d] = isoStr.split('-');
    return `${d}/${m}/${y}`;
  }

  function renderMarcadores(pacientesFiltrados) {
    markersLayer.clearLayers();
    pacientesFiltrados.forEach(p => {
      const marker = criarMarcador(p);
      markersLayer.addLayer(marker);
    });
  }

  function renderMicroareas(geojson) {
    microareasLayer.clearLayers();
    L.geoJSON(geojson, {
      style: (feature) => ({
        color: feature.properties.cor,
        weight: 2,
        fillOpacity: 0.08,
        dashArray: '5,5'
      }),
      onEachFeature: (feature, layer) => {
        layer.bindTooltip(
          `<strong>${feature.properties.nome}</strong><br>${feature.properties.acs}`,
          { sticky: true }
        );
      }
    }).addTo(microareasLayer);
  }

  function renderEquipamentos(geojson) {
    equipamentosLayer.clearLayers();
    L.geoJSON(geojson, {
      pointToLayer: (feature, latlng) => {
        const icon = L.divIcon({
          className: 'equip-marker',
          html: `<div style="
            font-size: 20px; width: 30px; height: 30px;
            display: flex; align-items: center; justify-content: center;
            background: #fff; border-radius: 6px; border: 1px solid #cbd5e1;
            box-shadow: 0 1px 3px rgba(0,0,0,0.15);
          ">${feature.properties.icone}</div>`,
          iconSize: [30, 30],
          iconAnchor: [15, 15]
        });
        return L.marker(latlng, { icon });
      },
      onEachFeature: (feature, layer) => {
        layer.bindPopup(`
          <div class="equip-popup">
            <h4>${feature.properties.icone} ${feature.properties.nome}</h4>
            <p style="font-size:12px;color:#666;margin:0">${feature.properties.tipo}</p>
          </div>
        `);
      }
    }).addTo(equipamentosLayer);
  }

  function toggleMicroareas(visible) {
    if (visible) map.addLayer(microareasLayer);
    else map.removeLayer(microareasLayer);
  }

  function toggleEquipamentos(visible) {
    if (visible) map.addLayer(equipamentosLayer);
    else map.removeLayer(equipamentosLayer);
  }

  return {
    init,
    renderMarcadores,
    renderMicroareas,
    renderEquipamentos,
    toggleMicroareas,
    toggleEquipamentos
  };
})();
