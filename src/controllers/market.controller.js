import db from "../database/db.js";
import { productSchema } from "../schemas/productSchema.js";
import { COLLECTIONS } from "../enums/collections.js";
import { ObjectId } from "mongodb";

async function addToCar(req, res) {
  const token = req.headers.authorization?.replace("Bearer ", "");

  if (!token) {
    res.status(400).send({ message: "Token de acesso não enviado" });
    return;
  }

  const validation = productSchema.validate(req.body, { abortEarly: false });

  const { idProduct, size, color, quantity } = req.body;

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
      res.status(400).send({ message: "Perfil não encontrado" });
      return;
    }

    const userMarket = await db.collection(`${COLLECTIONS.MARKET}`).findOne({
      userId: activeSession.userId,
    });

    const id_Product = await db.collection(`${COLLECTIONS.PRODUCTS}`).findOne({
      _id: ObjectId(idProduct),
    });

    if (!id_Product) {
      res.send({ message: "não foi possível achar o produto com esse ID" });
      return;
    }

    const price = id_Product.price;
    const name = id_Product.name;
    const img = id_Product.img;

    let hasInList = false;

    userMarket.market.forEach((element) => {
      if (element.idProduct === idProduct) {
        hasInList = true;
      }
    });

    if (hasInList) {
      res.status(409).send({ message: "Esse produto já está na sua lista" });
      return;
    }

    if (!userMarket) {
      await db.collection(`${COLLECTIONS.MARKET}`).insertOne({
        userId: `${activeSession.userId}`,
        market: [],
      });
      await db.collection(`${COLLECTIONS.MARKET}`).updateOne(
        { userId: `${activeSession.userId}` }, //activeSession.userId
        {
          $push: {
            market: { idProduct, name, size, color, quantity, price, img },
          },
        }
      );
    } else {
      await db.collection(`${COLLECTIONS.MARKET}`).updateOne(
        { userId: `${activeSession.userId}` }, //activeSession.userId
        {
          $push: {
            market: { idProduct, name, size, color, quantity, price, img },
          },
        }
      );
    }

    //fazer uma verificação pra ver se tem carrinho. (NÃO SEI SE CRIA NO LOGIN OU AQUI)

    res.status(201).send({ message: "Item adicionado ao carrinho" });
  } catch (error) {
    res.status(500).send({
      message:
        "Erro no servidor ou no formato do id enviado, tente novamente mais tarde",
    });
  }
}

async function removeFromCar(req, res) {
  const token = req.headers.authorization?.replace("Bearer ", "");

  if (!token) {
    res.status(400).send({ message: "Token de acesso não enviado" });
    return;
  }

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
      res.status(400).send({ message: "Perfil não encontrado" });
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

async function getItemsFromCar(req, res) {
  const token = req.headers.authorization?.replace("Bearer ", "");

  if (!token) {
    res.status(404).send({ message: "Token de acesso não enviado" });
    return;
  }

  try {
    const activeSession = await db
      .collection(`${COLLECTIONS.SESSIONS}`)
      .findOne({
        token,
      });

    if (!activeSession) {
      res.status(400).send({ message: "Perfil não encontrado" });
      return;
    }

    const userMarket = await db.collection(`${COLLECTIONS.MARKET}`).findOne({
      userId: activeSession.userId.toHexString(),
    });

    if (!userMarket) {
      await db.collection(`${COLLECTIONS.MARKET}`).insertOne({
        userId: `${activeSession.userId}`,
        market: [],
      });

      const userMarketCreate = await db
        .collection(`${COLLECTIONS.MARKET}`)
        .findOne({
          userId: activeSession.userId.toHexString(),
        });

      res.send(userMarketCreate.market);
      return;
    }

    res.send(userMarket.market);
    return;
  } catch (error) {
    res
      .status(500)
      .send({ message: "Erro no servidor, tente novamente mais tarde" });
  }
}

export { addToCar, removeFromCar, getItemsFromCar };
