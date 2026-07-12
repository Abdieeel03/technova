import { useEffect, useRef, useState } from "react";
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
import { useLanguage } from "../../context/LanguageContext";

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

export default function LocationPicker({
  value,
  onChange,
  onDireccionTextChange,
  onDireccionBlur,
  direccionError,
}) {
  const { t } = useLanguage();
  const [position, setPosition] = useState(DEFAULT_POSITION);
  const [results, setResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [searching, setSearching] = useState(false);
  const skipNextSearchRef = useRef(false);
  const containerRef = useRef(null);

  useEffect(() => {
    if (value?.latitud && value?.longitud) {
      setPosition([value.latitud, value.longitud]);
    }
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (skipNextSearchRef.current) {
      skipNextSearchRef.current = false;
      setResults([]);
      setShowDropdown(false);
      return;
    }

    const query = value?.direccion?.trim() || "";

    if (query.length < 3) {
      setResults([]);
      setShowDropdown(false);
      return;
    }

    setSearching(true);

    const timer = setTimeout(async () => {
      try {
        const items = await searchAddress(query);
        setResults(items);
        setShowDropdown(items.length > 0);
      } catch (error) {
        console.error("Error buscando dirección:", error);
        setResults([]);
        setShowDropdown(false);
      } finally {
        setSearching(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [value?.direccion]);

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

  const handleSelectResult = (place) => {
    skipNextSearchRef.current = true;
    setShowDropdown(false);
    setResults([]);
    setPosition([place.latitud, place.longitud]);

    onChange({
      latitud: place.latitud,
      longitud: place.longitud,
      direccion: place.direccion || value?.direccion,
      distrito: place.distrito,
      ciudad: place.ciudad,
    });
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

        <label className={styles.direccionLabel} htmlFor="mapa-direccion">
          {t.checkout.direccion}
        </label>

        <div className={styles.direccionWrapper} ref={containerRef}>
          <div
            className={`${styles.direccionInputContainer} ${direccionError ? styles.direccionErrorInput : ""}`}
          >
            <input
              id="mapa-direccion"
              type="text"
              className={styles.direccionInput}
              autoComplete="off"
              placeholder={
                value?.latitud
                  ? t.checkout.direccionPh
                  : "Selecciona una ubicación en el mapa"
              }
              value={value?.direccion || ""}
              onChange={(e) => onDireccionTextChange?.(e.target.value)}
              onFocus={() => results.length > 0 && setShowDropdown(true)}
              onBlur={() => onDireccionBlur?.()}
            />

            <button
              type="button"
              className={styles.direccionSearchButton}
              aria-label="Buscar dirección"
              disabled={searching}
            >
              {searching ? "⏳" : "🔍"}
            </button>
          </div>

          {showDropdown && results.length > 0 ? (
            <ul className={styles.dropdown}>
              {results.map((place) => (
                <li
                  key={place.id}
                  className={styles.dropdownItem}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    handleSelectResult(place);
                  }}
                >
                  <span className={styles.dropdownIcon}>📍</span>
                  <span className={styles.dropdownText}>{place.nombre}</span>
                </li>
              ))}
            </ul>
          ) : null}
        </div>

        {direccionError ? (
          <p className={styles.errorMsg}>{direccionError}</p>
        ) : null}

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

        {value?.direccion && !direccionError && (
          <div className={styles.success}>
            ✓ Lista para el envío
          </div>
        )}
      </div>
    </div>
  );
}