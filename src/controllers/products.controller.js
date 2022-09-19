import db from "../database/db.js";
import { ObjectId } from "mongodb";
import { COLLECTIONS } from "../enums/collections.js";

async function getAllProducts(req, res) {
  try {
    let response = await db
      .collection(`${COLLECTIONS.PRODUCTS}`)
      .find()
      .toArray();

    res.send(response);
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

  try {
    let response = await db.collection(`${COLLECTIONS.PRODUCTS}`).findOne({
      _id: ObjectId(ID_PRODUTO),
    });

    if (!response) {
      res.status(404).send({ message: "Não foi possível achar esse tênis" });
      return;
    }

    res.status(200).send(response);
  } catch (error) {
    res
      .status(500)
      .send({ message: "Erro no servidor, ou no formato do ID enviado" });
    return;
  }
}

export { getProduct, getAllProducts };
