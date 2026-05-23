const ORDERS_KEY = "technovaOrders";

const safeParse = (value, fallback) => {
  if (!value) {
    return fallback;
  }

  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
};

const getOrders = () => {
  const raw = localStorage.getItem(ORDERS_KEY);
  const parsed = safeParse(raw, []);
  return Array.isArray(parsed) ? parsed : [];
};

const saveOrders = (orders) => {
  localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
};

const buildOrder = ({ userId, items, total }) => ({
  id: crypto.randomUUID(),
  userId,
  items,
  total,
  createdAt: new Date().toISOString(),
});

export const createOrder = ({ userId, items, total }) => {
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

  const orders = getOrders();
  const newOrder = buildOrder({ userId, items: safeItems, total: amount });
  saveOrders([...orders, newOrder]);

  return { ok: true, order: newOrder };
};

export const getOrdersByUser = (userId) => {
  if (!userId) {
    return [];
  }

  return getOrders().filter((order) => order.userId === userId);
};
