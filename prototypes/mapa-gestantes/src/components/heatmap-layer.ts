/**
 * Heatmap layer — density visualization using leaflet.heat.
 */

import L from 'leaflet';
import 'leaflet.heat';
import type { GestanteWithUrgency } from '../main';

let heatLayer: L.Layer | null = null;
let isActive = false;
let mapRef: L.Map | null = null;
let toggleBtn: HTMLElement | null = null;
let markersRef: GestanteWithUrgency[] = [];

export function initHeatmapLayer(container: HTMLElement, map: L.Map, markers: GestanteWithUrgency[]): void {
  mapRef = map;
  markersRef = markers;

  toggleBtn = document.createElement('button');
  toggleBtn.id = 'heatmap-toggle';
  toggleBtn.className = 'absolute bottom-4 right-4 z-[900] bg-white rounded-lg shadow-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 border border-gray-200';
  toggleBtn.textContent = '🌡️ Mapa de Calor';
  toggleBtn.addEventListener('click', toggleHeatmap);
  container.appendChild(toggleBtn);
}

function toggleHeatmap(): void {
  if (!mapRef || !toggleBtn) return;

  if (isActive) {
    // Deactivate heatmap, show markers
    if (heatLayer) {
      mapRef.removeLayer(heatLayer);
      heatLayer = null;
    }
    for (const item of markersRef) {
      if (!mapRef.hasLayer(item.marker)) {
        item.marker.addTo(mapRef);
      }
    }
    toggleBtn.textContent = '🌡️ Mapa de Calor';
    toggleBtn.classList.remove('bg-blue-100', 'text-blue-700');
    isActive = false;
  } else {
    // Activate heatmap, hide markers
    for (const item of markersRef) {
      if (mapRef.hasLayer(item.marker)) {
        mapRef.removeLayer(item.marker);
      }
    }
    const points: [number, number, number][] = markersRef.map(item => [
      item.gestante.endereco.lat,
      item.gestante.endereco.lng,
      item.urgency.category === 'critico' ? 1.0 : item.urgency.category === 'atencao' ? 0.6 : 0.3,
    ]);
    heatLayer = L.heatLayer(points, {
      radius: 30,
      blur: 20,
      maxZoom: 17,
      gradient: { 0.2: '#22c55e', 0.5: '#f59e0b', 0.8: '#ef4444', 1.0: '#7f1d1d' },
    }).addTo(mapRef);
    toggleBtn.textContent = '📍 Marcadores';
    toggleBtn.classList.add('bg-blue-100', 'text-blue-700');
    isActive = true;
  }
}

export function isHeatmapActive(): boolean {
  return isActive;
}
