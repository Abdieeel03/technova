import { randomUUID } from "crypto";
import { getOrdenesCollection } from "./_mongo.js";

const buildOrder = ({ userId, items, total }) => ({
  id: randomUUID(),
  userId,
  items,
  subtotal: total,
  total,
  pago: {
    metodo: "directa",
    ultimos4: null,
    titular: null,
    status: "pagado",
    transaccionId: null,
    pagadoEn: new Date().toISOString(),
    moneda: "PEN",
  },
  envio: {},
  status: "pagado",
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

const handleGet = async (req, res) => {
  const { userId, status } = req.query;

  if (!userId) {
    return res.status(400).json({ error: "Missing userId" });
  }

  const collection = await getOrdenesCollection();
  const query = { userId };

  if (status) {
    query.status = status;
  }

  const ordenes = await collection
    .find(query, { projection: { _id: 0 } })
    .sort({ createdAt: -1 })
    .toArray();

  return res.status(200).json({ ordenes });
};

const handlePost = async (req, res) => {
  const { userId, items, total } = req.body || {};

  if (!userId) {
    return res.status(400).json({ error: "Debes iniciar sesion para comprar." });
  }

  const safeItems = Array.isArray(items) ? items : [];
  if (safeItems.length === 0) {
    return res.status(400).json({ error: "No hay productos en el carrito." });
  }

  const amount = Number(total);
  if (!Number.isFinite(amount) || amount <= 0) {
    return res.status(400).json({ error: "Total invalido." });
  }

  const collection = await getOrdenesCollection();
  const order = buildOrder({ userId, items: safeItems, total: amount });
  await collection.insertOne(order);

  const { _id, ...orderWithoutMongo } = order;

  return res.status(201).json({ orden: orderWithoutMongo });
};

export default async function handler(req, res) {
  try {
    if (req.method === "GET") {
      return handleGet(req, res);
    }

    if (req.method === "POST") {
      return handlePost(req, res);
    }

    res.setHeader("Allow", "GET, POST");
    return res.status(405).json({ error: "Method not allowed" });
  } catch (error) {
    console.error("Error handling ordenes", error);
    return res.status(500).json({ error: "Error handling ordenes" });
  }
}

