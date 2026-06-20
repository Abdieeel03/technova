const buildQueryString = (params = {}) => {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      searchParams.set(key, String(value));
    }
  });

  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : "";
};

const requestJson = async (url, signal) => {
  const response = await fetch(url, { signal });

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  return response.json();
};

export async function fetchProductos(params, signal) {
  const data = await requestJson(`/api/productos${buildQueryString(params)}`, signal);
  return data.productos || [];
}

export async function fetchProductoById(id, signal) {
  const data = await requestJson(`/api/productos/${id}`, signal);
  return data.producto || null;
}
