import './style.css';
import L from 'leaflet';
import gestantesData from './data/gestantes.json';
import type { Gestante } from './models';
import { calculateUrgency } from './logic/urgency';
import type { UrgencyCategory, UrgencyResult } from './models';
import { initDetailPanel, showDetailPanel } from './components/detail-panel';
import { initFilters, updateFilterCount } from './components/filters';
import { matchesFilter, type FilterState } from './logic/filter-engine';
import { daysSince } from './logic/dates';
import { initPriorityList, updatePriorityList } from './components/priority-list';
import { initStatsDashboard, updateStatsDashboard } from './components/stats-dashboard';
import { initSearch } from './components/search';
import { initHeatmapLayer } from './components/heatmap-layer';
import { initMicroareaLayer } from './components/microarea-layer';
import { detectHouseholds } from './logic/household';

// US Moab Caldas coordinates
const US_MOAB_COORDS: L.LatLngExpression = [-30.0729573, -51.2201539];
const DEFAULT_ZOOM = 15;

// Urgency colors
export const URGENCY_COLORS: Record<UrgencyCategory, string> = {
  critico: '#dc2626',
  atencao: '#d97706',
  normal: '#16a34a',
};

// Initialize map — no zoom buttons, standard smooth behavior
const map = L.map('map', {
  zoomControl: false,
}).setView(US_MOAB_COORDS, DEFAULT_ZOOM);

// OSM tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  maxZoom: 19,
}).addTo(map);

// US Moab Caldas marker (reference point)
const usIcon = L.divIcon({
  className: '',
  html: `<div style="display:flex;align-items:center;justify-content:center;width:36px;height:36px;background:#2563eb;border-radius:50%;border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.3)">
    <span style="color:white;font-size:10px;font-weight:bold">US</span>
  </div>`,
  iconSize: [36, 36],
  iconAnchor: [18, 18],
});

L.marker(US_MOAB_COORDS, { icon: usIcon })
  .addTo(map)
  .bindTooltip('US Moab Caldas', { permanent: false, direction: 'top', offset: [0, -18] });

// Initialize UI components
initDetailPanel();

// --- Data + markers ---
export interface GestanteWithUrgency {
  gestante: Gestante;
  urgency: UrgencyResult;
  marker: L.CircleMarker;
  diasSemConsulta: number;
}

const gestantes = gestantesData as unknown as Gestante[];
export const gestanteMarkers: GestanteWithUrgency[] = [];

// --- Selection state ---
let selectedId: string | null = null;

export function selectGestante(id: string): void {
  // Deselect previous
  if (selectedId) {
    const prev = gestanteMarkers.find(m => m.gestante.id === selectedId);
    if (prev) {
      const color = URGENCY_COLORS[prev.urgency.category];
      const baseRadius = prev.urgency.category === 'critico' ? 10 : prev.urgency.category === 'atencao' ? 8 : 6;
      prev.marker.setStyle({
        radius: baseRadius,
        color: '#ffffff',
        weight: 2,
        fillColor: color,
        fillOpacity: 0.85,
      });
    }
  }

  // Select new
  selectedId = id;
  const item = gestanteMarkers.find(m => m.gestante.id === id);
  if (item) {
    const baseRadius = item.urgency.category === 'critico' ? 10 : item.urgency.category === 'atencao' ? 8 : 6;
    item.marker.setStyle({
      radius: baseRadius + 4,
      color: '#1e3a8a',
      weight: 4,
      fillOpacity: 1,
    });
    item.marker.bringToFront();
  }
}

export function getSelectedId(): string | null {
  return selectedId;
}

// --- Render markers ---
for (const g of gestantes) {
  const urgency = calculateUrgency(g);
  const color = URGENCY_COLORS[urgency.category];
  const diasSemConsulta = daysSince(g.consultas.dataUltimaConsulta);

  const marker = L.circleMarker([g.endereco.lat, g.endereco.lng], {
    radius: urgency.category === 'critico' ? 10 : urgency.category === 'atencao' ? 8 : 6,
    fillColor: color,
    color: '#ffffff',
    weight: 2,
    fillOpacity: 0.85,
    opacity: 1,
  }).addTo(map);

  gestanteMarkers.push({ gestante: g, urgency, marker, diasSemConsulta });
}

// --- Same-address grouping ---
const households = detectHouseholds(gestanteMarkers);

for (const group of households) {
  // For grouped markers, add a badge and custom click behavior
  const first = group.members[0];
  const badgeIcon = L.divIcon({
    className: '',
    html: `<div style="position:relative">
      <div style="position:absolute;top:-8px;right:-8px;background:#1d4ed8;color:white;border-radius:50%;width:18px;height:18px;display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:bold;border:2px solid white;box-shadow:0 1px 3px rgba(0,0,0,0.3)">${group.members.length}</div>
    </div>`,
    iconSize: [18, 18],
    iconAnchor: [9, -4],
  });

  const badge = L.marker([first.gestante.endereco.lat, first.gestante.endereco.lng], {
    icon: badgeIcon,
    interactive: true,
    zIndexOffset: 1000,
  }).addTo(map);

  // Click on grouped marker → show picker popup
  const popupContent = `
    <div style="min-width:160px">
      <p style="font-size:11px;color:#666;margin:0 0 6px">Mesmo endereço (${group.members.length}):</p>
      ${group.members.map(m => {
        const c = URGENCY_COLORS[m.urgency.category];
        return `<div class="household-pick" data-id="${m.gestante.id}" style="padding:4px 0;cursor:pointer;border-bottom:1px solid #eee;display:flex;align-items:center;gap:6px">
          <span style="width:8px;height:8px;border-radius:50%;background:${c};display:inline-block"></span>
          <span style="font-size:12px">${m.gestante.nome}</span>
        </div>`;
      }).join('')}
    </div>
  `;

  badge.bindPopup(popupContent);
  badge.on('popupopen', () => {
    setTimeout(() => {
      document.querySelectorAll('.household-pick').forEach(el => {
        el.addEventListener('click', () => {
          const id = (el as HTMLElement).dataset.id!;
          const item = gestanteMarkers.find(m => m.gestante.id === id);
          if (item) {
            selectGestante(id);
            showDetailPanel(item.gestante, item.urgency);
            badge.closePopup();
          }
        });
      });
    }, 50);
  });

  // Also set click on individual markers within group
  for (const m of group.members) {
    m.marker.off('click');
    m.marker.on('click', () => {
      badge.openPopup();
    });
  }
}

// Single markers (not in a group) — direct click
const groupedIds = new Set(households.flatMap(h => h.members.map(m => m.gestante.id)));
for (const item of gestanteMarkers) {
  if (!groupedIds.has(item.gestante.id)) {
    item.marker.on('click', () => {
      selectGestante(item.gestante.id);
      showDetailPanel(item.gestante, item.urgency);
    });
  }
}

// --- Filter system ---
function applyFilters(filters: FilterState): void {
  const visibleItems: GestanteWithUrgency[] = [];

  for (const item of gestanteMarkers) {
    const visible = matchesFilter(
      item.gestante,
      item.urgency.category,
      item.diasSemConsulta,
      filters
    );
    if (visible) {
      if (!map.hasLayer(item.marker)) {
        item.marker.addTo(map);
      }
      visibleItems.push(item);
    } else {
      if (map.hasLayer(item.marker)) {
        map.removeLayer(item.marker);
      }
    }
  }

  updateFilterCount(visibleItems.length);
  updatePriorityList(visibleItems);
  updateStatsDashboard(visibleItems);
}

// --- Initialize all UI ---
const appEl = document.getElementById('app')!;
initFilters(appEl, applyFilters);
initPriorityList(appEl, map);
initStatsDashboard(appEl);
initSearch(appEl, map, gestanteMarkers);
initHeatmapLayer(appEl, map, gestanteMarkers);
initMicroareaLayer(appEl, map, gestanteMarkers);

// Initial state
updateFilterCount(gestanteMarkers.length);
updatePriorityList(gestanteMarkers);
updateStatsDashboard(gestanteMarkers);

console.log(`Mapa Gestantes: ${gestantes.length} marcadores renderizados`);
