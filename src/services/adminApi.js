const requestJson = async (url, options) => {
  const response = await fetch(url, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || `Request failed with status ${response.status}`);
  }

  return data;
};

export const createProduct = async (producto) => {
  const data = await requestJson("/api/productos", {
    method: "POST",
    body: JSON.stringify(producto),
  });

  return data.producto;
};

export const fetchAdminOrders = async () => {
  const data = await requestJson("/api/ordenes?all=true");
  return data.ordenes || [];
};
