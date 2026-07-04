import { getProductosCollection } from "../_mongo.js";

const PRODUCTO_CACHE_CONTROL =
  "public, s-maxage=300, stale-while-revalidate=86400";

export default async function handler(req, res) {
  try {
    const id = Number(req.query.id);

    if (!Number.isInteger(id)) {
      return res.status(400).json({ error: "Invalid product id" });
    }

    const collection = await getProductosCollection();

    if (req.method === "GET") {
      const producto = await collection.findOne(
        { id },
        { projection: { _id: 0 } },
      );

      if (!producto) {
        return res.status(404).json({ error: "Product not found" });
      }

      res.setHeader("Cache-Control", PRODUCTO_CACHE_CONTROL);
      return res.status(200).json({ producto });
    }

    if (req.method === "PUT") {
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
        ? body.caracteristicas.map((item) => String(item).trim()).filter(Boolean)
        : String(body.caracteristicas || "").split("\n").map((item) => item.trim()).filter(Boolean);
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

      const updatedProductData = {
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

      const updateResult = await collection.findOneAndUpdate(
        { id },
        { $set: updatedProductData },
        { returnDocument: 'after', projection: { _id: 0 } }
      );

      if (!updateResult) {
         return res.status(404).json({ error: "Product not found to update" });
      }

      return res.status(200).json({ producto: updateResult });
    }

    if (req.method === "DELETE") {
      const deleteResult = await collection.deleteOne({ id });

      if (deleteResult.deletedCount === 0) {
        return res.status(404).json({ error: "Product not found to delete" });
      }

      return res.status(200).json({ ok: true });
    }

    res.setHeader("Allow", "GET, PUT, DELETE");
    return res.status(405).json({ error: "Method not allowed" });
  } catch (error) {
    console.error("Error with product", error);
    return res.status(500).json({ error: "Error processing product request" });
  }
}
