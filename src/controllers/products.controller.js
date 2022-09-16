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

    const userMarket = await db.collection(`${COLLECTIONS.MARKET}`).findOne({
      userId: activeSession.userId,
    });
    console.log(userMarket);
    if (!userMarket) {
      await db.collection(`${COLLECTIONS.MARKET}`).insertOne({
        userId: `${activeSession.userId}`,
        market: [],
      });
      await db.collection(`${COLLECTIONS.MARKET}`).updateOne(
        { userId: `${activeSession.userId}` }, //activeSession.userId
        { $push: { market: { idProduct, name, size, color, quantity } } }
      );
    } else {
      await db.collection(`${COLLECTIONS.MARKET}`).updateOne(
        { userId: `${activeSession.userId}` }, //activeSession.userId
        { $push: { market: { idProduct, name, size, color, quantity } } }
      );
    }

    //fazer uma verificação pra ver se tem carrinho. (NÃO SEI SE CRIA NO LOGIN OU AQUI)

    res.status(201).send({ message: "Item adicionado ao carrinho" });
  } catch (error) {
    res
      .status(500)
      .send({ message: "Erro no servidor, tente novamente mais tarde" });
  }
}

async function removeFromCar(req, res) {
  const token = req.headers.authorization?.replace("Bearer ", "");

  const { idProduct } = req.params;

  if (!idProduct) {
    res.sendStatus(400);
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
    const userMarket = await db.collection(`${COLLECTIONS.MARKET}`).findOne({
      userId: activeSession.userId,
    });

    if (!userMarket) {
      res
        .status(404)
        .send({ message: "Não foi possível encontrar o seu carrinho" });
      return;
    } else {
      let response = await db.collection(`${COLLECTIONS.MARKET}`).updateMany(
        { userId: `${activeSession.userId}` }, //activeSession.userId
        { $pull: { market: { idProduct: idProduct } } }
      );

      if (response.modifiedCount === 0) {
        res.status(404).send({
          message: "Não foi possível remover esse item do seu carrinho",
        });
        return;
      }

      res.status(201).send({ message: "Item removido do carrinho" });
    }
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

export { addToCar, getProduct, removeFromCar };
