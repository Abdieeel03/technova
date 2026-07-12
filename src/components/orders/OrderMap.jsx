import { MapContainer, TileLayer, Marker } from "react-leaflet";

import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";

import styles from "../../css_components/OrderMap.module.css";

const DEFAULT_POSITION = [-12.046374, -77.042793];

export default function OrderMap({ latitud, longitud }) {
  const hasCoords =
    typeof latitud === "number" && typeof longitud === "number";

  if (!hasCoords) {
    return (
      <div className={styles.placeholder}>
        <span className={styles.placeholderIcon}>📍</span>
        <p>Ubicación no disponible</p>
      </div>
    );
  }

  const center = [latitud, longitud];

  return (
    <MapContainer
      center={center}
      zoom={16}
      scrollWheelZoom={false}
      dragging={false}
      doubleClickZoom={false}
      zoomControl={false}
      keyboard={false}
      className={styles.map}
    >
      <TileLayer
        attribution="© OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={center} />
    </MapContainer>
  );
}
