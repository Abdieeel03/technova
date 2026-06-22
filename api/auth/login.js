import bcrypt from "bcryptjs";
import { getUsuariosCollection } from "../_mongo.js";

const toPublicUser = (user) => ({
  id: user.id,
  name: user.name,
  email: user.email,
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { email, password } = req.body || {};
    const trimmedEmail = email?.trim().toLowerCase();
    const trimmedPassword = password?.trim();

    if (!trimmedEmail || !trimmedPassword) {
      return res
        .status(400)
        .json({ error: "Completa correo y contrasena para continuar." });
    }

    const collection = await getUsuariosCollection();
    const user = await collection.findOne({ email: trimmedEmail });

    if (!user || !bcrypt.compareSync(trimmedPassword, user.passwordHash)) {
      return res.status(401).json({ error: "Correo o contrasena invalidos." });
    }

    return res.status(200).json({ user: toPublicUser(user) });
  } catch (error) {
    console.error("Error logging in user", error);
    return res.status(500).json({ error: "Error logging in user" });
  }
}
