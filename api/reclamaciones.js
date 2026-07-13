import { getReclamacionesCollection } from "./_mongo.js";

const serializeReclamacion = (doc) => {
  if (!doc) return doc;
  const { _id, fecha, ...rest } = doc;
  return {
    id: _id?.toString(),
    ...rest,
    fecha: fecha instanceof Date ? fecha.toISOString() : fecha,
  };
};

const handleGet = async (req, res) => {
  const collection = await getReclamacionesCollection();
  const reclamaciones = await collection
    .find({})
    .sort({ fecha: -1 })
    .toArray();

  return res.status(200).json({
    reclamaciones: reclamaciones.map(serializeReclamacion),
  });
};

const handlePost = async (req, res) => {
  const {
    nombre,
    correo,
    telefono,
    tipo,
    motivo,
    descripcion,
    pedido,
  } = req.body;

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
};

export default async function handler(req, res) {
  try {
    if (req.method === "GET") return handleGet(req, res);
    if (req.method === "POST") return handlePost(req, res);

    res.setHeader("Allow", "GET, POST");
    return res.status(405).json({
      error: "Método no permitido",
    });
  } catch (error) {
    console.error("Error al gestionar las reclamaciones:", error);

    return res.status(500).json({
      error: "Error interno del servidor.",
    });
  }
}
