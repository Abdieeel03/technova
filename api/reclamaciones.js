import { getReclamacionesCollection } from "./_mongo.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({
      error: "Método no permitido",
    });
  }

  try {
    const {
      nombre,
      correo,
      telefono,
      tipo,
      motivo,
      descripcion,
      pedido,
    } = req.body;

    // Validación de campos obligatorios
    if (
      !nombre ||
      !correo ||
      !tipo ||
      !motivo ||
      !descripcion ||
      !pedido
    ) {
      return res.status(400).json({
        error: "Complete todos los campos obligatorios.",
      });
    }

    const collection = await getReclamacionesCollection();

    const nuevaReclamacion = {
      nombre: nombre.trim(),
      correo: correo.trim(),
      telefono: telefono?.trim() || "",
      tipo: tipo.trim(),
      motivo: motivo.trim(),
      descripcion: descripcion.trim(),
      pedido: pedido.trim(),
      fecha: new Date(),
    };

    await collection.insertOne(nuevaReclamacion);

    return res.status(201).json({
      mensaje: "Reclamación registrada correctamente.",
    });
  } catch (error) {
    console.error("Error al registrar la reclamación:", error);

    return res.status(500).json({
      error: "Error interno del servidor.",
    });
  }
}