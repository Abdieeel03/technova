export async function reverseGeocode(lat, lon) {
  const response = await fetch(
    `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`,
    {
      headers: {
        Accept: "application/json",
      },
    },
  );

  if (!response.ok) {
    throw new Error("No se pudo obtener la dirección.");
  }

  const data = await response.json();

  const address = data.address || {};

  // Ciudad
  let ciudad =
    address.city ||
    address.county ||
    address.state_district ||
    address.town ||
    address.municipality ||
    address.village ||
    "";

  // Para Lima Metropolitana siempre mostrar "Lima"
  if (
    address.state_district === "Lima Metropolitana" ||
    address.region === "Lima"
  ) {
    ciudad = "Lima";
  }

  return {
    direccion:
      [address.road, address.house_number]
        .filter(Boolean)
        .join(" ") || data.name || "",

    distrito:
      address.city_district ||
      address.borough ||
      address.township ||
      address.suburb ||
      address.quarter ||
      "",

    ciudad,
  };
}

export async function searchAddress(query) {
  if (!query.trim()) return [];

  const response = await fetch(
    `https://nominatim.openstreetmap.org/search?format=jsonv2&q=${encodeURIComponent(
      `${query}, Lima, Perú`,
    )}&countrycodes=pe&addressdetails=1&limit=5`,
    {
      headers: {
        Accept: "application/json",
      },
    },
  );

  if (!response.ok) {
    throw new Error("No se pudieron buscar direcciones.");
  }

  const data = await response.json();

  console.log(data);

  return data.map((item) => ({
  id: item.place_id,
  nombre: item.display_name,
  latitud: Number(item.lat),
  longitud: Number(item.lon),

  direccion:
    [item.address?.road, item.address?.house_number]
      .filter(Boolean)
      .join(" ") || "",

  distrito:
    item.address?.city_district ||
    item.address?.suburb ||
    item.address?.borough ||
    item.address?.quarter ||
    "",

  ciudad:
  item.address?.state_district === "Lima Metropolitana"
    ? "Lima"
    : item.address?.city ||
      item.address?.county ||
      item.address?.town ||
      "Lima",
}));
}