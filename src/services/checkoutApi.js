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

export const procesarPago = async ({ userId, items, subtotal, pago, envio }) => {
  if (!userId) {
    return { ok: false, error: "Debes iniciar sesion para comprar." };
  }

  const safeItems = Array.isArray(items) ? items : [];
  if (safeItems.length === 0) {
    return { ok: false, error: "No hay productos en el carrito." };
  }

  const amount = Number(subtotal);
  if (!Number.isFinite(amount) || amount <= 0) {
    return { ok: false, error: "Subtotal invalido." };
  }

  try {
    const data = await requestJson("/api/checkout/procesar-pago", {
      method: "POST",
      body: JSON.stringify({
        userId,
        items: safeItems,
        subtotal: amount,
        pago,
        envio: envio || {},
      }),
    });

    return { ok: true, orden: data.orden };
  } catch (error) {
    return { ok: false, error: error.message };
  }
};

export const obtenerOrden = async (orderId, userId) => {
  if (!orderId || !userId) {
    return null;
  }

  const params = new URLSearchParams({ orderId, userId });
  const data = await requestJson(`/api/checkout/obtener-orden?${params.toString()}`);
  return data.orden || null;
};
