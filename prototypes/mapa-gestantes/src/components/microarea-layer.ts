/**
 * Microárea layer — renders polygons with distinct colors per ACS.
 * Labels show "ACS [Name]" with tooltip explaining the acronym.
 */

import L from 'leaflet';
import microareasData from '../data/microareas.json';
import type { Microarea } from '../models';
import type { GestanteWithUrgency } from '../main';

const microareas = microareasData as unknown as Microarea[];

/** Fixed distinct colors per microárea — exported for use in filters */
export const MICROAREA_COLORS: Record<string, string> = {
  'MA1': '#3b82f6', // blue
  'MA2': '#8b5cf6', // purple
  'MA3': '#f97316', // orange
  'MA4': '#06b6d4', // cyan
  'MA5': '#ec4899', // pink
};

/** ACS names by MA id — exported for filters */
export const MICROAREA_ACS: Record<string, string> = {};

// Populate from data
for (const ma of microareas) {
  MICROAREA_ACS[ma.id] = ma.acsNome;
}

let polygonLayer: L.LayerGroup | null = null;
let isVisible = false;
let mapRef: L.Map | null = null;
let toggleBtn: HTMLElement | null = null;

export function initMicroareaLayer(container: HTMLElement, map: L.Map, markers: GestanteWithUrgency[]): void {
  mapRef = map;
  polygonLayer = L.layerGroup();

  for (const ma of microareas) {
    const color = MICROAREA_COLORS[ma.id] || '#888888';
    const firstName = ma.acsNome.split(' ')[0]; // "Joana", "Rita", etc.

    // Calculate stats for this microárea
    const maMarkers = markers.filter(m => m.gestante.microarea === ma.id);
    const total = maMarkers.length;
    const criticas = maMarkers.filter(m => m.urgency.category === 'critico').length;
    const normais = maMarkers.filter(m => m.urgency.category === 'normal').length;
    const percentEmDia = total > 0 ? Math.round((normais / total) * 100) : 0;

    const polygon = L.polygon(ma.polygon as L.LatLngExpression[], {
      fillColor: color,
      color: color,
      weight: 3,
      fillOpacity: 0.12,
      opacity: 0.7,
      dashArray: '6 4',
    });

    // Tooltip with ACS acronym explained
    polygon.bindTooltip(`
      <div style="min-width:170px">
        <div style="display:flex;align-items:center;gap:6px;margin-bottom:6px">
          <span style="width:12px;height:12px;border-radius:3px;background:${color};display:inline-block"></span>
          <strong style="font-size:12px">${ma.id}</strong>
        </div>
        <div style="font-size:11px;color:#555;line-height:1.6">
          <span style="border-bottom:1px dotted #888" title="Agente Comunitário(a) de Saúde">ACS</span>: <strong>${ma.acsNome}</strong><br/>
          Gestantes: ${total}<br/>
          🔴 ${criticas} críticas • 🟢 ${percentEmDia}% em dia
        </div>
      </div>
    `, { sticky: true });

    // Label at polygon center
    const center = getPolygonCenter(ma.polygon);
    const label = L.marker(center as L.LatLngExpression, {
      icon: L.divIcon({
        className: '',
        html: `<div style="background:${color};color:white;padding:2px 8px;border-radius:4px;font-size:10px;font-weight:600;white-space:nowrap;box-shadow:0 1px 3px rgba(0,0,0,0.3);letter-spacing:0.3px" title="Agente Comunitário(a) de Saúde: ${ma.acsNome}">ACS ${firstName}</div>`,
        iconSize: [70, 20],
        iconAnchor: [35, 10],
      }),
      interactive: false,
    });

    polygonLayer.addLayer(polygon);
    polygonLayer.addLayer(label);
  }

  // Toggle button
  toggleBtn = document.createElement('button');
  toggleBtn.id = 'microarea-toggle';
  toggleBtn.className = 'absolute bottom-16 right-4 z-[900] bg-white rounded-lg shadow-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 border border-gray-200 transition-colors';
  toggleBtn.textContent = '🗺️ Microáreas';
  toggleBtn.addEventListener('click', toggleMicroareas);
  container.appendChild(toggleBtn);
}

function toggleMicroareas(): void {
  if (!mapRef || !polygonLayer || !toggleBtn) return;

  if (isVisible) {
    mapRef.removeLayer(polygonLayer);
    toggleBtn.textContent = '🗺️ Microáreas';
    toggleBtn.classList.remove('bg-purple-100', 'text-purple-700');
    isVisible = false;
  } else {
    polygonLayer.addTo(mapRef);
    toggleBtn.textContent = '🗺️ Ocultar Microáreas';
    toggleBtn.classList.add('bg-purple-100', 'text-purple-700');
    isVisible = true;
  }
}

/** Calculate centroid of a polygon */
function getPolygonCenter(polygon: [number, number][]): [number, number] {
  let latSum = 0;
  let lngSum = 0;
  for (const [lat, lng] of polygon) {
    latSum += lat;
    lngSum += lng;
  }
  return [latSum / polygon.length, lngSum / polygon.length];
}
