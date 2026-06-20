import { MongoClient } from "mongodb";

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
