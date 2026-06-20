import { getProductosCollection } from "./_mongo.js";

const parseBoolean = (value) => {
  if (value === "true") {
    return true;
  }

  if (value === "false") {
    return false;
  }

  return undefined;
};

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const collection = await getProductosCollection();
    const { categoria, tipo, masVendido, limit } = req.query;
    const query = {};

    if (categoria) {
      query.categoria = categoria;
    }

    if (tipo) {
      query.tipo = tipo;
    }

    const masVendidoBoolean = parseBoolean(masVendido);
    if (typeof masVendidoBoolean === "boolean") {
      query.masVendido = masVendidoBoolean;
    }

    const parsedLimit = Number(limit);
    const cursor = collection
      .find(query, { projection: { _id: 0 } })
      .sort({ id: 1 });

    if (Number.isInteger(parsedLimit) && parsedLimit > 0) {
      cursor.limit(parsedLimit);
    }

    const productos = await cursor.toArray();

    return res.status(200).json({ productos });
  } catch (error) {
    console.error("Error fetching productos", error);
    return res.status(500).json({ error: "Error fetching productos" });
  }
}
