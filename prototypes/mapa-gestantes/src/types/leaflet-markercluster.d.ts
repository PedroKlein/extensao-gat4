// Type augmentation for leaflet.markercluster
import 'leaflet';

declare module 'leaflet' {
  interface MarkerClusterGroupOptions {
    maxClusterRadius?: number;
    iconCreateFunction?: (cluster: MarkerCluster) => DivIcon;
    showCoverageOnHover?: boolean;
    zoomToBoundsOnClick?: boolean;
    spiderfyOnMaxZoom?: boolean;
    disableClusteringAtZoom?: number;
  }

  interface MarkerCluster {
    getChildCount(): number;
    getAllChildMarkers(): Marker[];
  }

  class MarkerClusterGroup extends FeatureGroup {
    constructor(options?: MarkerClusterGroupOptions);
    addLayer(layer: Layer): this;
    removeLayer(layer: Layer): this;
    clearLayers(): this;
  }

  function markerClusterGroup(options?: MarkerClusterGroupOptions): MarkerClusterGroup;
}
