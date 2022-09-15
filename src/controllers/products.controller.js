import db from "../database/db.js";
import { ObjectId } from "mongodb";

import { COLLECTIONS } from "../enums/collections.js";

import { productSchema } from "../schemas/productSchema.js";

async function addToCar(req, res) {
  const token = req.headers.authorization?.replace("Bearer ", "");
  const validation = productSchema.validate(req.body, { abortEarly: false });

  const { idProduct, name, size, color, quantity } = req.body;

  if (validation.error) {
    const errors = validation.error.details.map((detail) => detail.message);
    res.status(422).send(errors);
    return;
  }

  try {
    const activeSession = await db
      .collection(`${COLLECTIONS.SESSIONS}`)
      .findOne({
        token,
      });

    if (!activeSession) {
      res.status(400).send({ message: "Token de acesso não enviado" });
      return;
    }
    const userMarket = await db.collection(`${COLLECTIONS.USERS}`).findOne({
      _id: ObjectId(activeSession.userId),
    });

    //fazer uma verificação pra ver se tem carrinho. (NÃO SEI SE CRIA NO LOGIN OU AQUI)

    await db
      .collection(`${COLLECTIONS.USERS}`)
      .updateOne(
        { _id: ObjectId("6323afbfa96506291a990895") },
        { $push: { market: { idProduct, name, size, color, quantity } } }
      );

    res.status(201).send({ message: "Item adicionado ao carrinho" });
  } catch (error) {
    res
      .status(500)
      .send({ message: "Erro no servidor, tente novamente mais tarde" });
  }
}

async function getProduct(req, res) {
  const { ID_PRODUTO } = req.params;

  if (!ID_PRODUTO) {
    res.status(404).send({ message: "Id não enviado" });
    return;
  }

  res.status(200).send(ID_PRODUTO);
}

export { addToCar, getProduct };
