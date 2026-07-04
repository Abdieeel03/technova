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

export const uploadImage = async (file) => {
  const formData = new FormData();
  formData.append("image", file);

  const response = await fetch("/api/upload-image", {
    method: "POST",
    body: formData,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || `Upload failed with status ${response.status}`);
  }

  return data.url;
};

export const updateProduct = async (id, producto) => {
  const data = await requestJson(`/api/productos/${id}`, {
    method: "PUT",
    body: JSON.stringify(producto),
  });

  return data.producto;
};

export const deleteProduct = async (id) => {
  const data = await requestJson(`/api/productos/${id}`, {
    method: "DELETE",
  });

  return data;
};

export const fetchAdminOrders = async () => {
  const data = await requestJson("/api/ordenes?all=true");
  return data.ordenes || [];
};
