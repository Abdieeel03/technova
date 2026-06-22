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

export const createOrder = async ({ userId, items, total }) => {
  if (!userId) {
    return { ok: false, error: "Debes iniciar sesion para comprar." };
  }

  const safeItems = Array.isArray(items) ? items : [];
  if (safeItems.length === 0) {
    return { ok: false, error: "No hay productos en el carrito." };
  }

  const amount = Number(total);
  if (!Number.isFinite(amount) || amount <= 0) {
    return { ok: false, error: "Total invalido." };
  }

  try {
    const data = await requestJson("/api/ordenes", {
      method: "POST",
      body: JSON.stringify({ userId, items: safeItems, total: amount }),
    });

    return { ok: true, order: data.orden };
  } catch (error) {
    return { ok: false, error: error.message };
  }
};

export const getOrdersByUser = async (userId) => {
  if (!userId) {
    return [];
  }

  const searchParams = new URLSearchParams({ userId });
  const data = await requestJson(`/api/ordenes?${searchParams.toString()}`);
  return data.ordenes || [];
};
