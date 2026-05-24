const initialState = {
  items: [],
  meta: {
    userId: null,
    updatedAt: null,
  },
};

const getProductoPrecio = (producto) => {
  if (producto?.ofertaNavideña?.activa) {
    return Number(producto.ofertaNavideña.precioOferta);
  }

  return Number(producto?.precio ?? 0);
};

const buildCartItem = (producto, cantidad) => {
  const precioUnitario = getProductoPrecio(producto);

  return {
    id: producto.id,
    nombre: producto.nombre,
    marca: producto.marca,
    categoria: producto.categoria,
    imagen: producto.imagen,
    precioUnitario,
    precioOriginal: producto?.ofertaNavideña?.activa
      ? Number(producto.ofertaNavideña.precioOriginal)
      : null,
    descuento: producto?.ofertaNavideña?.activa
      ? Number(producto.ofertaNavideña.descuento)
      : null,
    cantidad,
    stock: Number.isFinite(producto.stock) ? producto.stock : null,
  };
};

const normalizeCantidad = (cantidad) => {
  if (!Number.isFinite(cantidad)) {
    return 1;
  }

  return Math.max(1, Math.floor(cantidad));
};

const clampCantidad = (cantidad, stock) => {
  if (!Number.isFinite(stock)) {
    return cantidad;
  }

  return Math.min(cantidad, stock);
};

const withUpdatedAt = (state) => ({
  ...state,
  meta: {
    ...state.meta,
    updatedAt: new Date().toISOString(),
  },
});

const cartReducer = (state, action) => {
  switch (action.type) {
    case "ADD_ITEM": {
      const { producto, cantidad } = action.payload;
      const baseCantidad = normalizeCantidad(cantidad);
      const existing = state.items.find((item) => item.id === producto.id);
      const stock = Number.isFinite(producto.stock) ? producto.stock : null;

      if (Number.isFinite(stock) && stock <= 0) {
        return state;
      }

      if (existing) {
        const nextCantidad = clampCantidad(
          existing.cantidad + baseCantidad,
          stock ?? existing.stock,
        );
        const updatedItems = state.items.map((item) =>
          item.id === producto.id
            ? {
                ...item,
                ...buildCartItem(producto, nextCantidad),
                cantidad: nextCantidad,
              }
            : item,
        );
        return withUpdatedAt({ ...state, items: updatedItems });
      }

      const nextCantidad = clampCantidad(baseCantidad, stock);
      const newItem = buildCartItem(producto, nextCantidad);
      return withUpdatedAt({ ...state, items: [...state.items, newItem] });
    }
    case "UPDATE_QTY": {
      const { id, cantidad } = action.payload;

      if (!Number.isFinite(cantidad) || cantidad <= 0) {
        const filtered = state.items.filter((item) => item.id !== id);
        return withUpdatedAt({ ...state, items: filtered });
      }

      const updatedItems = state.items.map((item) => {
        if (item.id !== id) {
          return item;
        }

        const nextCantidad = clampCantidad(normalizeCantidad(cantidad), item.stock);
        return {
          ...item,
          cantidad: nextCantidad,
        };
      });

      return withUpdatedAt({ ...state, items: updatedItems });
    }
    case "REMOVE_ITEM": {
      const filtered = state.items.filter((item) => item.id !== action.payload);
      return withUpdatedAt({ ...state, items: filtered });
    }
    case "CLEAR_CART": {
      return withUpdatedAt({ ...state, items: [] });
    }
    case "SET_OWNER": {
      return withUpdatedAt({
        ...state,
        meta: {
          ...state.meta,
          userId: action.payload,
        },
      });
    }
    default:
      return state;
  }
};

export { cartReducer, initialState };
