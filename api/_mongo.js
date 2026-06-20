import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB_NAME || "technova-products";

if (!uri) {
  throw new Error("Missing MONGODB_URI environment variable");
}

if (!globalThis._technovaMongoClientPromise) {
  const client = new MongoClient(uri);
  globalThis._technovaMongoClientPromise = client.connect();
}

const clientPromise = globalThis._technovaMongoClientPromise;

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
