import { MongoClient } from "mongodb";
import dotenv from "dotenv";

import { COLLECTIONS } from "../enums/collections.js";

dotenv.config();

const mongoClient = new MongoClient(process.env.MONGO_URI);

try {
  await mongoClient.connect();
} catch (error) {
  console.log(error);
}

const db = mongoClient.db(`${COLLECTIONS.META_SHOES}`);

export default db;
