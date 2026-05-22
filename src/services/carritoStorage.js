const STORAGE_KEY = "technovaCarrito";

const sanitizeItem = (item) => {
  if (!item || typeof item !== "object") {
    return null;
  }

  const cantidad = Number.isFinite(item.cantidad)
    ? Math.max(1, Math.floor(item.cantidad))
    : 1;

  return {
    id: item.id,
    nombre: item.nombre,
    marca: item.marca,
    categoria: item.categoria,
    imagen: item.imagen,
    precioUnitario: Number(item.precioUnitario) || 0,
    precioOriginal:
      item.precioOriginal === null || item.precioOriginal === undefined
        ? null
        : Number(item.precioOriginal) || 0,
    descuento:
      item.descuento === null || item.descuento === undefined
        ? null
        : Number(item.descuento) || 0,
    cantidad,
    stock: Number.isFinite(item.stock) ? item.stock : null,
  };
};

const sanitizeState = (state, fallbackState) => {
  if (!state || typeof state !== "object") {
    return fallbackState;
  }

  const items = Array.isArray(state.items)
    ? state.items.map(sanitizeItem).filter(Boolean)
    : [];

  return {
    ...fallbackState,
    items,
    meta: {
      ...fallbackState.meta,
      ...state.meta,
    },
  };
};

export const loadCarrito = (fallbackState) => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) {
      return fallbackState;
    }

    const parsed = JSON.parse(saved);
    return sanitizeState(parsed, fallbackState);
  } catch {
    return fallbackState;
  }
};

export const saveCarrito = (state) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // no-op
  }
};
