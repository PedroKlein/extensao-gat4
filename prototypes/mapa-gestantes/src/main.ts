import './style.css';
import L from 'leaflet';
import gestantesData from './data/gestantes.json';
import type { Gestante } from './models';
import { calculateUrgency } from './logic/urgency';
import type { UrgencyCategory, UrgencyResult } from './models';
import { initDetailPanel, showDetailPanel, showUSPanel, hideDetailPanel } from './components/detail-panel';
import { initFilters, updateFilterCount } from './components/filters';
import { matchesFilter, type FilterState } from './logic/filter-engine';
import { daysSince } from './logic/dates';
import { initPriorityList, updatePriorityList } from './components/priority-list';
import { initStatsDashboard, updateStatsDashboard } from './components/stats-dashboard';
import { initSearch } from './components/search';
import { initHeatmapLayer } from './components/heatmap-layer';
import { initMicroareaLayer } from './components/microarea-layer';
import { detectHouseholds } from './logic/household';

// US Moab Caldas coordinates (Av. Moab Caldas, 400 — verified via Nominatim/OSM)
const US_MOAB_COORDS: L.LatLngExpression = [-30.0692745, -51.2166063];
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
  .bindTooltip('US Moab Caldas', { permanent: false, direction: 'top', offset: [0, -18] })
  .on('click', () => {
    markMarkerClick();
    showUSPanel(gestanteMarkers);
  });

// Initialize UI components
initDetailPanel();

// --- Route to patient (OSRM) ---
let routeLayer: L.Polyline | null = null;

function clearRoute(): void {
  if (routeLayer) {
    map.removeLayer(routeLayer);
    routeLayer = null;
  }
}

async function showRoute(destLat: number, destLng: number): Promise<void> {
  clearRoute();
  const usLat = -30.0692745;
  const usLng = -51.2166063;

  try {
    const url = `https://router.project-osrm.org/route/v1/foot/${usLng},${usLat};${destLng},${destLat}?overview=full&geometries=geojson`;
    const resp = await fetch(url);
    const data = await resp.json();

    if (data.routes && data.routes.length > 0) {
      const route = data.routes[0];
      const coords: L.LatLngExpression[] = route.geometry.coordinates.map(
        (c: [number, number]) => [c[1], c[0]] as L.LatLngExpression
      );

      routeLayer = L.polyline(coords, {
        color: '#2563eb',
        weight: 4,
        opacity: 0.7,
        dashArray: '8 6',
      }).addTo(map);

      const distKm = (route.distance / 1000).toFixed(1);
      const timeMin = Math.ceil(route.distance / 83.3); // 5 km/h walking speed
      routeLayer.bindTooltip(`🚶 ${distKm} km • ~${timeMin} min`, { permanent: true, direction: 'center', className: 'route-label' });
    }
  } catch (err) {
    console.error('Erro ao buscar rota:', err);
  }
}

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
  // Clear previous route
  clearRoute();

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

    // Auto-show route
    showRoute(item.gestante.endereco.lat, item.gestante.endereco.lng);
  }
}

export function getSelectedId(): string | null {
  return selectedId;
}

function deselectCurrent(): void {
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
    selectedId = null;
  }
}

// --- Render markers (with hover tooltip — feature 6) ---
for (const g of gestantes) {
  const urgency = calculateUrgency(g);
  const color = URGENCY_COLORS[urgency.category];
  const diasSemConsulta = daysSince(g.consultas.dataUltimaConsulta);
  const igText = g.isPuerpera ? 'Puérpera' : `${Math.floor((Date.now() - new Date(g.consultas.dum).getTime()) / (1000 * 60 * 60 * 24 * 7))} sem`;

  const marker = L.circleMarker([g.endereco.lat, g.endereco.lng], {
    radius: urgency.category === 'critico' ? 10 : urgency.category === 'atencao' ? 8 : 6,
    fillColor: color,
    color: '#ffffff',
    weight: 2,
    fillOpacity: 0.85,
    opacity: 1,
  }).addTo(map);

  // Hover tooltip (feature 6)
  marker.bindTooltip(`<strong>${g.nome}</strong><br/><span style="font-size:11px">${igText} • ${urgency.category === 'critico' ? '🔴' : urgency.category === 'atencao' ? '🟡' : '🟢'}</span>`, {
    direction: 'top',
    offset: [0, -8],
  });

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
      markMarkerClick();
      badge.openPopup();
    });
  }
}

// Single markers (not in a group) — direct click
const groupedIds = new Set(households.flatMap(h => h.members.map(m => m.gestante.id)));
for (const item of gestanteMarkers) {
  if (!groupedIds.has(item.gestante.id)) {
    item.marker.on('click', () => {
      markMarkerClick();
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
initStatsDashboard(appEl, (dppItems) => {
  // When DPP card is clicked, highlight those patients
  for (const item of gestanteMarkers) {
    const isDpp = dppItems.some(d => d.gestante.id === item.gestante.id);
    if (isDpp) {
      if (!map.hasLayer(item.marker)) item.marker.addTo(map);
      item.marker.setStyle({ fillOpacity: 1, opacity: 1 });
    } else {
      item.marker.setStyle({ fillOpacity: 0.15, opacity: 0.3 });
    }
  }
  updatePriorityList(dppItems);
  // Reset after 5 seconds
  setTimeout(() => {
    for (const item of gestanteMarkers) {
      item.marker.setStyle({ fillOpacity: 0.85, opacity: 1 });
    }
    updatePriorityList(gestanteMarkers);
  }, 5000);
});
initSearch(appEl, map, gestanteMarkers);
initHeatmapLayer(appEl, map, gestanteMarkers);
initMicroareaLayer(appEl, map, gestanteMarkers);

// --- Feature 1: Persistent legend ---
const legendEl = document.createElement('div');
legendEl.className = 'absolute bottom-4 left-1/2 -translate-x-1/2 z-[800] bg-white/90 backdrop-blur-sm rounded-lg shadow px-4 py-2 flex items-center gap-4 text-xs';
legendEl.innerHTML = `
  <span class="flex items-center gap-1"><span class="w-3 h-3 rounded-full bg-red-600 inline-block"></span> Crítico</span>
  <span class="flex items-center gap-1"><span class="w-3 h-3 rounded-full bg-amber-600 inline-block"></span> Atenção</span>
  <span class="flex items-center gap-1"><span class="w-3 h-3 rounded-full bg-green-600 inline-block"></span> Normal</span>
  <span class="flex items-center gap-1"><span class="w-4 h-4 rounded-full bg-blue-600 inline-flex items-center justify-center text-white" style="font-size:8px;font-weight:bold">US</span> Unidade</span>
`;
appEl.appendChild(legendEl);

// Initial state
updateFilterCount(gestanteMarkers.length);
updatePriorityList(gestanteMarkers);
updateStatsDashboard(gestanteMarkers);

// --- Feature 4: Esc closes panel + clears route + deselects ---
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    deselectCurrent();
    hideDetailPanel();
    clearRoute();
  }
});

// --- Feature 8: Click on map closes panel + clears route + deselects ---
let justClickedMarker = false;
map.on('click', () => {
  if (justClickedMarker) {
    justClickedMarker = false;
    return;
  }
  deselectCurrent();
  hideDetailPanel();
  clearRoute();
});

// Export helper for marker clicks to set the flag
export function markMarkerClick(): void {
  justClickedMarker = true;
}

console.log(`Mapa Gestantes: ${gestantes.length} marcadores renderizados`);
