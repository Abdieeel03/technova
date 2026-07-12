import { MongoClient } from "mongodb";
import dns from "node:dns/promises";

// En Windows, Node.js 24.13.0+ y 25.x (hasta 25.6.1) tienen un bug conocido
// que rompe la resolución de registros SRV (necesarios para "mongodb+srv://"),
// incluso con DNS públicos válidos configurados en el sistema.
// Ver: https://github.com/nodejs/node/issues/62326
// Forzamos servidores DNS explícitos a través de dns/promises como workaround.
dns.setServers(["8.8.8.8", "1.1.1.1"]);

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB_NAME || "technova-products";

if (!uri) {
  throw new Error("Missing MONGODB_URI environment variable");
}

let clientPromise;

if (process.env.NODE_ENV === "development") {
  if (!globalThis._technovaMongoClientPromise) {
    const client = new MongoClient(uri);
    globalThis._technovaMongoClientPromise = client.connect();
  }

  clientPromise = globalThis._technovaMongoClientPromise;
} else {
  const client = new MongoClient(uri);
  clientPromise = client.connect();
}

export async function getProductosCollection() {
  const client = await clientPromise;
  return client.db(dbName).collection("productos");
}

export async function getUsuariosCollection() {
  const client = await clientPromise;
  return client.db(dbName).collection("usuarios");
}

export async function getOrdenesCollection() {
  const client = await clientPromise;
  return client.db(dbName).collection("ordenes");
}

export async function getTransaccionesCollection() {
  const client = await clientPromise;
  return client.db(dbName).collection("transacciones");
}

export async function getReclamacionesCollection() {
  const client = await clientPromise;
  return client.db(dbName).collection("reclamaciones");
}