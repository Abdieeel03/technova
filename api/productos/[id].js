import { getProductosCollection } from "../_mongo.js";

const PRODUCTO_CACHE_CONTROL =
  "public, s-maxage=300, stale-while-revalidate=86400";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const id = Number(req.query.id);

    if (!Number.isInteger(id)) {
      return res.status(400).json({ error: "Invalid product id" });
    }

    const collection = await getProductosCollection();
    const producto = await collection.findOne(
      { id },
      { projection: { _id: 0 } },
    );

    if (!producto) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.setHeader("Cache-Control", PRODUCTO_CACHE_CONTROL);
    return res.status(200).json({ producto });
  } catch (error) {
    console.error("Error fetching producto", error);
    return res.status(500).json({ error: "Error fetching producto" });
  }
}
