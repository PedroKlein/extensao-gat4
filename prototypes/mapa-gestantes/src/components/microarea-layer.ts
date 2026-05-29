/**
 * Microárea layer — renders polygons with distinct colors per area.
 * Each microárea has its own identifying color.
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

const MICROAREA_FILL_OPACITY = 0.15;
const MICROAREA_BORDER_OPACITY = 0.7;

let polygonLayer: L.LayerGroup | null = null;
let isVisible = false;
let mapRef: L.Map | null = null;
let toggleBtn: HTMLElement | null = null;

export function initMicroareaLayer(container: HTMLElement, map: L.Map, markers: GestanteWithUrgency[]): void {
  mapRef = map;
  polygonLayer = L.layerGroup();

  for (const ma of microareas) {
    const color = MICROAREA_COLORS[ma.id] || '#888888';

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
      fillOpacity: MICROAREA_FILL_OPACITY,
      opacity: MICROAREA_BORDER_OPACITY,
      dashArray: '6 4',
    });

    polygon.bindTooltip(`
      <div style="min-width:160px">
        <div style="display:flex;align-items:center;gap:6px;margin-bottom:4px">
          <span style="width:12px;height:12px;border-radius:3px;background:${color};display:inline-block"></span>
          <strong>${ma.id}</strong>
        </div>
        <div style="font-size:11px;color:#555">
          <strong>ACS:</strong> ${ma.acsNome}<br/>
          <strong>Gestantes:</strong> ${total}<br/>
          🔴 ${criticas} críticas • 🟢 ${percentEmDia}% em dia
        </div>
      </div>
    `, { sticky: true });

    // Add a label in the center of the polygon
    const center = getPolygonCenter(ma.polygon);
    const label = L.marker(center as L.LatLngExpression, {
      icon: L.divIcon({
        className: '',
        html: `<div style="background:${color};color:white;padding:2px 6px;border-radius:4px;font-size:10px;font-weight:bold;white-space:nowrap;box-shadow:0 1px 3px rgba(0,0,0,0.3)">${ma.id}</div>`,
        iconSize: [40, 20],
        iconAnchor: [20, 10],
      }),
      interactive: false,
    });

    polygonLayer.addLayer(polygon);
    polygonLayer.addLayer(label);
  }

  // Toggle button
  toggleBtn = document.createElement('button');
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
