import { getOrdenesCollection } from "../_mongo.js";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { orderId, userId } = req.query;

    if (!orderId || !userId) {
      return res
        .status(400)
        .json({ error: "Missing orderId or userId" });
    }

    const collection = await getOrdenesCollection();
    const orden = await collection.findOne(
      { id: orderId, userId },
      { projection: { _id: 0 } },
    );

    if (!orden) {
      return res.status(404).json({ error: "Orden no encontrada." });
    }

    return res.status(200).json({ orden });
  } catch (error) {
    console.error("Error fetching order", error);
    return res.status(500).json({ error: "Error al obtener la orden." });
  }
}
