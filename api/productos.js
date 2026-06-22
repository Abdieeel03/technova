import { getProductosCollection } from "./_mongo.js";
import { randomUUID } from "crypto";

const PRODUCTOS_CACHE_CONTROL = "public, s-maxage=300, stale-while-revalidate=86400";

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
  try {
    if (req.method === "GET") {
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

      res.setHeader("Cache-Control", PRODUCTOS_CACHE_CONTROL);
      return res.status(200).json({ productos });
    }

    if (req.method === "POST") {
      const collection = await getProductosCollection();
      const body = req.body || {};
      const nombre = body.nombre?.trim();
      const categoria = body.categoria?.trim();
      const tipo = body.tipo?.trim() || categoria;
      const marca = body.marca?.trim();
      const imagen = body.imagen?.trim();
      const descripcion = body.descripcion?.trim();
      const descripcionDetallada = body.descripcionDetallada?.trim() || descripcion;
      const precio = Number(body.precio);
      const stock = Number(body.stock);
      const garantia = body.garantia?.trim() || "";
      const caracteristicas = Array.isArray(body.caracteristicas)
        ? body.caracteristicas
            .map((item) => String(item).trim())
            .filter(Boolean)
        : String(body.caracteristicas || "")
            .split("\n")
            .map((item) => item.trim())
            .filter(Boolean);
      const especificaciones = Array.isArray(body.especificaciones)
        ? body.especificaciones.reduce((acc, item) => {
            const key = String(item?.key || "").trim();
            const value = String(item?.value || "").trim();
            if (key && value) {
              acc[key] = value;
            }
            return acc;
          }, {})
        : body.especificaciones || {};
      const masVendido = Boolean(body.masVendido);
      const ofertaNavideña = body.ofertaNavideña || body.oferta || null;

      if (!nombre || !categoria || !tipo || !marca || !imagen || !descripcion) {
        return res.status(400).json({ error: "Completa los campos obligatorios." });
      }

      if (!Array.isArray(body.caracteristicas) && typeof body.caracteristicas !== "string") {
        return res.status(400).json({ error: "Caracteristicas invalidas." });
      }

      if (!Number.isFinite(precio) || precio <= 0) {
        return res.status(400).json({ error: "Precio invalido." });
      }

      if (!Number.isFinite(stock) || stock < 0) {
        return res.status(400).json({ error: "Stock invalido." });
      }

      const lastProduct = await collection.find({}, { projection: { id: 1 } }).sort({ id: -1 }).limit(1).toArray();
      const nextId = lastProduct[0]?.id ? Number(lastProduct[0].id) + 1 : 1;

      const producto = {
        id: Number.isInteger(nextId) ? nextId : randomUUID(),
        nombre,
        categoria,
        tipo,
        marca,
        imagen,
        descripcion,
        descripcionDetallada,
        precio,
        stock,
        garantia,
        caracteristicas,
        especificaciones,
        masVendido,
        ofertaNavideña: ofertaNavideña?.activa
          ? {
              activa: true,
              etiqueta: ofertaNavideña.etiqueta || "Oferta",
              precioOriginal: Number(ofertaNavideña.precioOriginal ?? precio),
              precioOferta: Number(ofertaNavideña.precioOferta ?? precio),
              descuento: Number(ofertaNavideña.descuento ?? 0),
            }
          : { activa: false },
      };

      await collection.insertOne(producto);

      return res.status(201).json({ producto });
    }

    res.setHeader("Allow", "GET, POST");
    return res.status(405).json({ error: "Method not allowed" });
  } catch (error) {
    console.error("Error fetching productos", error);
    return res.status(500).json({ error: "Error fetching productos" });
  }
}
