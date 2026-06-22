import { randomUUID } from "crypto";
import bcrypt from "bcryptjs";
import { getUsuariosCollection } from "../_mongo.js";

const SALT_ROUNDS = 10;

const toPublicUser = (user) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  role: user.role || "cliente",
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { name, email, password } = req.body || {};
    const trimmedName = name?.trim();
    const trimmedEmail = email?.trim().toLowerCase();
    const trimmedPassword = password?.trim();

    if (!trimmedName || !trimmedEmail || !trimmedPassword) {
      return res.status(400).json({ error: "Completa todos los campos." });
    }

    if (trimmedPassword.length < 6) {
      return res
        .status(400)
        .json({ error: "La contrasena debe tener al menos 6 caracteres." });
    }

    const collection = await getUsuariosCollection();
    const existingUser = await collection.findOne({ email: trimmedEmail });

    if (existingUser) {
      return res
        .status(409)
        .json({ error: "Ya existe una cuenta con ese correo." });
    }

    const user = {
      id: randomUUID(),
      name: trimmedName,
      email: trimmedEmail,
      passwordHash: bcrypt.hashSync(trimmedPassword, SALT_ROUNDS),
      role: "cliente",
      createdAt: new Date().toISOString(),
    };

    await collection.insertOne(user);

    return res.status(201).json({ user: toPublicUser(user) });
  } catch (error) {
    if (error?.code === 11000) {
      return res
        .status(409)
        .json({ error: "Ya existe una cuenta con ese correo." });
    }

    console.error("Error registering user", error);
    return res.status(500).json({ error: "Error registering user" });
  }
}
