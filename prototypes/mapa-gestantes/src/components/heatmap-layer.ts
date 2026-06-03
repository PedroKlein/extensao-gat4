/**
 * Heatmap layer — density visualization using leaflet.heat.
 * Switches to dark tiles when active for better visibility.
 */

import L from 'leaflet';
import 'leaflet.heat';
import type { GestanteWithUrgency } from '../main';

let heatLayer: L.Layer | null = null;
let isActive = false;
let mapRef: L.Map | null = null;
let toggleBtn: HTMLElement | null = null;
let markersRef: GestanteWithUrgency[] = [];
let lightTiles: L.TileLayer | null = null;
let darkTiles: L.TileLayer | null = null;

export function initHeatmapLayer(container: HTMLElement, map: L.Map, markers: GestanteWithUrgency[]): void {
  mapRef = map;
  markersRef = markers;

  // Get existing light tile layer
  map.eachLayer((layer) => {
    if (layer instanceof L.TileLayer) {
      lightTiles = layer;
    }
  });

  // Pre-add dark tile layer (hidden initially via opacity)
  darkTiles = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/">CARTO</a>',
    maxZoom: 19,
  }).addTo(map);
  darkTiles.getContainer()!.style.display = 'none';

  toggleBtn = document.createElement('button');
  toggleBtn.id = 'heatmap-toggle';
  toggleBtn.className = 'absolute bottom-4 right-4 z-[900] bg-white rounded-lg shadow-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 border border-gray-200';
  toggleBtn.textContent = '🌡️ Mapa de Calor';
  toggleBtn.addEventListener('click', toggleHeatmap);
  container.appendChild(toggleBtn);
}

function toggleHeatmap(): void {
  if (!mapRef || !toggleBtn || !lightTiles || !darkTiles) return;

  if (isActive) {
    // Deactivate heatmap: show light tiles, hide dark, show markers
    if (heatLayer) {
      mapRef.removeLayer(heatLayer);
      heatLayer = null;
    }
    darkTiles.getContainer()!.style.display = 'none';
    lightTiles.getContainer()!.style.display = '';
    for (const item of markersRef) {
      if (!mapRef.hasLayer(item.marker)) {
        item.marker.addTo(mapRef);
      }
    }
    toggleBtn.textContent = '🌡️ Mapa de Calor';
    toggleBtn.classList.remove('bg-gray-800', 'text-orange-300');
    isActive = false;
  } else {
    // Activate heatmap: hide light tiles, show dark, hide markers
    for (const item of markersRef) {
      if (mapRef.hasLayer(item.marker)) {
        mapRef.removeLayer(item.marker);
      }
    }
    lightTiles.getContainer()!.style.display = 'none';
    darkTiles.getContainer()!.style.display = '';

    const points: [number, number, number][] = markersRef.map(item => [
      item.gestante.endereco.lat,
      item.gestante.endereco.lng,
      item.urgency.category === 'critico' ? 1.0 : item.urgency.category === 'atencao' ? 0.6 : 0.3,
    ]);
    heatLayer = L.heatLayer(points, {
      radius: 35,
      blur: 25,
      maxZoom: 17,
      gradient: { 0.2: '#22c55e', 0.5: '#f59e0b', 0.8: '#ef4444', 1.0: '#7f1d1d' },
    }).addTo(mapRef);
    toggleBtn.textContent = '📍 Marcadores';
    toggleBtn.classList.add('bg-gray-800', 'text-orange-300');
    isActive = true;
  }
}

export function isHeatmapActive(): boolean {
  return isActive;
}
