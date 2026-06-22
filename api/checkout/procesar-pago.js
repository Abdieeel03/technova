import { randomUUID } from "crypto";
import {
  getOrdenesCollection,
  getTransaccionesCollection,
} from "../_mongo.js";

const SIMULATED_DELAY_MS = 1500;

const buildOrder = ({ userId, items, subtotal, pago, envio }) => ({
  id: randomUUID(),
  userId,
  items,
  subtotal,
  total: subtotal + (envio?.costoEnvio || 0),
  pago: {
    metodo: "tarjeta_simulada",
    ultimos4: pago.ultimos4,
    titular: pago.titular,
    status: "pendiente",
    transaccionId: null,
    pagadoEn: null,
    moneda: "PEN",
  },
  envio: envio || {},
  status: "pendiente",
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

const buildTransaction = ({ orderId, userId, amount, ultimos4, status }) => ({
  id: randomUUID(),
  orderId,
  userId,
  amount,
  ultimos4,
  status,
  createdAt: new Date().toISOString(),
});

const simulatePayment = async (ultimos4) => {
  await new Promise((resolve) => setTimeout(resolve, SIMULATED_DELAY_MS));

  if (ultimos4 === "0000") {
    return { ok: false, error: "Pago rechazado por el banco." };
  }

  return { ok: true };
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { userId, items, subtotal, pago, envio } = req.body || {};

    if (!userId) {
      return res
        .status(400)
        .json({ error: "Debes iniciar sesion para comprar." });
    }

    const safeItems = Array.isArray(items) ? items : [];
    if (safeItems.length === 0) {
      return res
        .status(400)
        .json({ error: "No hay productos en el carrito." });
    }

    const amount = Number(subtotal);
    if (!Number.isFinite(amount) || amount <= 0) {
      return res.status(400).json({ error: "Subtotal invalido." });
    }

    if (!pago?.ultimos4 || !pago?.titular) {
      return res
        .status(400)
        .json({ error: "Datos de pago incompletos." });
    }

    // Simulate payment processing
    const result = await simulatePayment(pago.ultimos4);

    const ordenesCol = await getOrdenesCollection();
    const transaccionesCol = await getTransaccionesCollection();

    if (!result.ok) {
      const txn = buildTransaction({
        orderId: null,
        userId,
        amount,
        ultimos4: pago.ultimos4,
        status: "rechazado",
      });
      await transaccionesCol.insertOne(txn);

      return res.status(402).json({ error: result.error });
    }

    // Payment approved — create order
    const order = buildOrder({
      userId,
      items: safeItems,
      subtotal: amount,
      pago,
      envio,
    });

    const txn = buildTransaction({
      orderId: order.id,
      userId,
      amount: order.total,
      ultimos4: pago.ultimos4,
      status: "aprobado",
    });

    order.pago.status = "pagado";
    order.pago.transaccionId = txn.id;
    order.pago.pagadoEn = new Date().toISOString();
    order.status = "pagado";
    order.updatedAt = new Date().toISOString();

    await ordenesCol.insertOne(order);
    await transaccionesCol.insertOne(txn);

    const { _id, ...orderWithoutMongo } = order;

    return res.status(201).json({ ok: true, orden: orderWithoutMongo });
  } catch (error) {
    console.error("Error processing payment", error);
    return res.status(500).json({ error: "Error al procesar el pago." });
  }
}
