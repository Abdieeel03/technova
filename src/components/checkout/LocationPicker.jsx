import { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
  useMap,
} from "react-leaflet";
import {
  reverseGeocode,
  searchAddress,
} from "../../services/locationService";

import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";

import styles from "../../css_components/LocationPicker.module.css";

const DEFAULT_POSITION = [-12.046374, -77.042793];

function MapEvents({ onSelectLocation }) {
  useMapEvents({
    click(e) {
      onSelectLocation({
        latitud: e.latlng.lat,
        longitud: e.latlng.lng,
      });
    },
  });

  return null;
}

function ChangeMapView({ position }) {
  const map = useMap();

  useEffect(() => {
    map.flyTo(position, map.getZoom(), {
      animate: true,
      duration: 1.2,
    });
  }, [position, map]);

  return null;
}

export default function LocationPicker({ value, onChange }) {
  const [position, setPosition] = useState(DEFAULT_POSITION);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (value?.latitud && value?.longitud) {
      setPosition([value.latitud, value.longitud]);
    }
  }, [value]);

  const updateLocation = async ({ latitud, longitud }) => {
    setPosition([latitud, longitud]);

    try {
      const location = await reverseGeocode(latitud, longitud);

      onChange({
        latitud,
        longitud,
        direccion: location.direccion,
        distrito: location.distrito,
        ciudad: location.ciudad,
      });
    } catch (error) {
      console.error("Error obteniendo la dirección:", error);

      onChange({
        latitud,
        longitud,
      });
    }
  };

  const handleCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Tu navegador no soporta geolocalización.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        updateLocation({
          latitud: position.coords.latitude,
          longitud: position.coords.longitude,
        });
      },
      (error) => {
        
        console.error(error);
        alert("No se pudo obtener tu ubicación.");
      },
      {
        enableHighAccuracy: true,
      },
    );
  };

  const handleSearch = async () => {
    if (!search.trim()) return;

    try {
      const results = await searchAddress(search);

      if (results.length === 0) {
        alert("No se encontraron resultados.");
        return;
      }

      const place = results[0];

      // Mover el mapa
      setPosition([place.latitud, place.longitud]);

      // Actualizar directamente los campos
      onChange({
        latitud: place.latitud,
        longitud: place.longitud,
        direccion: place.direccion,
        distrito: place.distrito,
        ciudad: place.ciudad,
      });
    } catch (error) {
      console.error(error);
      alert("Ocurrió un error al buscar la dirección.");
    }
  };

  return (
    <div className={styles.container}>
      <h4 className={styles.title}>📍 Selecciona tu ubicación</h4>

      <button
        type="button"
        className={styles.locationButton}
        onClick={handleCurrentLocation}
      >
        📍 Usar mi ubicación actual
      </button>

      <label className={styles.searchLabel}>
        🔍 Buscar una dirección
      </label>

      <div className={styles.searchContainer}>
        <input
          type="text"
          className={styles.searchInput}
          placeholder="Ej: Av. Arequipa 1450, Miraflores..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSearch();
            }
          }}
        />

        <button
          type="button"
          className={styles.searchButton}
          onClick={handleSearch}
        >
          🔍
        </button>
      </div>

      <MapContainer
        center={position}
        zoom={15}
        scrollWheelZoom
        className={styles.map}
      >
        <TileLayer
          attribution="© OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <ChangeMapView position={position} />

        <MapEvents onSelectLocation={updateLocation} />

        <Marker
          draggable
          position={position}
          eventHandlers={{
            dragend(e) {
              const { lat, lng } = e.target.getLatLng();

              updateLocation({
                latitud: lat,
                longitud: lng,
              });
            },
          }}
        />
      </MapContainer>

      <div className={styles.locationCard}>
        <h4 className={styles.locationTitle}>📍 Ubicación seleccionada</h4>

        <p className={styles.locationAddress}>
          {value?.direccion || "Selecciona una ubicación en el mapa"}
        </p>

        {(value?.distrito || value?.ciudad) && (
          <>
            <p>
              <strong>Distrito:</strong> {value?.distrito}
            </p>

            <p>
              <strong>Ciudad:</strong> {value?.ciudad}
            </p>
          </>
        )}

        {value?.direccion && (
          <div className={styles.success}>
            ✓ Lista para el envío
          </div>
        )}
      </div>
    </div>
  );
}