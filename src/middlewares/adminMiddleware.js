import { COLLECTIONS } from "../enums/collections.js";
import { STATUS_CODE } from "../enums/statusCode.js";
import db from "../database/db.js";
import { ObjectId } from "mongodb";

async function adminMiddleware(req, res, next) {
  const token = req.headers.authorization?.replace("Bearer ", "");

  if (!token) {
    return res
      .status(COLLECTIONS.UNAUTHORIZED)
      .send({ message: "Admin não conectado" });
  }

  try {
    const session = await db.collection(COLLECTIONS.SESSIONS).findOne({
      token,
    });

    if (!session) {
      return res.send(STATUS_CODE.UNAUTHORIZED);
    }

    const adminON = await db
      .collection(COLLECTIONS.USERS)
      .findOne({ _id: new ObjectId("63254290c7e9c8b06a6ce9a0") });

    if (!adminON) {
      return res
        .status(STATUS_CODE.UNAUTHORIZED)
        .send({ message: "Admin não conectado" });
    }

    next();
  } catch (error) {
    console.log(error);
    return res.sendStatus(STATUS_CODE.SERVER_ERROR);
  }
}

export { adminMiddleware };
