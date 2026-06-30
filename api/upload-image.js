import { createClient } from "@supabase/supabase-js";
import { randomUUID } from "crypto";
import formidable from "formidable";
import fs from "fs";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

let supabase = null;
if (supabaseUrl && supabaseAnonKey) {
  supabase = createClient(supabaseUrl, supabaseAnonKey);
}

// Desactivamos el bodyParser automático para que formidable pueda parsear los streams directamente
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    if (!supabase) {
      return res.status(500).json({ error: "Supabase credentials are not configured on the server." });
    }

    const form = formidable({
      keepExtensions: true,
      maxFileSize: 5 * 1024 * 1024, // 5MB
    });

    const [fields, files] = await new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err);
        else resolve([fields, files]);
      });
    });

    // En formidable v3, el archivo puede venir como un array o como un objeto simple
    const imageFileRaw = files.image;
    const imageFile = Array.isArray(imageFileRaw) ? imageFileRaw[0] : imageFileRaw;

    if (!imageFile || !imageFile.filepath) {
      return res.status(400).json({ error: "No se recibió ninguna imagen en el campo 'image'." });
    }

    // Validar tipo de archivo (mimetype)
    const fileType = imageFile.mimetype || "";
    if (!fileType.startsWith("image/")) {
      return res.status(400).json({ error: "El archivo seleccionado no es una imagen válida." });
    }

    // Leer el archivo desde la ruta temporal
    const fileBuffer = fs.readFileSync(imageFile.filepath);

    // Generar nombre de archivo único
    const ext = imageFile.originalFilename?.split(".").pop() || "png";
    const uniqueFilename = `${randomUUID()}.${ext}`;

    // Subir a Supabase Storage (bucket "profile-images")
    const { data, error } = await supabase.storage
      .from("profile-images")
      .upload(uniqueFilename, fileBuffer, {
        contentType: fileType,
        duplex: "half",
      });

    // Eliminar archivo temporal local
    try {
      fs.unlinkSync(imageFile.filepath);
    } catch (e) {
      // Ignorar error al borrar el temporal
    }

    if (error) {
      console.error("Error al subir a Supabase Storage:", error);
      return res.status(500).json({ error: `Error de almacenamiento en Supabase: ${error.message}` });
    }

    // Obtener la URL pública
    const { data: { publicUrl } } = supabase.storage
      .from("profile-images")
      .getPublicUrl(uniqueFilename);

    return res.status(200).json({ url: publicUrl });
  } catch (error) {
    console.error("Error en upload-image handler:", error);
    const message = error.message && error.message.includes("maxFileSize")
      ? "La imagen excede el límite de 5MB."
      : "Ocurrió un error inesperado al procesar la imagen.";
    return res.status(500).json({ error: message });
  }
}
