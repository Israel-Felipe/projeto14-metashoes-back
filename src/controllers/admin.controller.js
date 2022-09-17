import db from "../database/db.js";
import { STATUS_CODE } from "../enums/statusCode.js";
import { COLLECTIONS } from "../enums/collections.js";
import { registerProductSchema } from "../schemas/productSchema.js";

async function registerProduct(req, res) {
  const { name, img, price, description } = req.body;

  const isValid = registerProductSchema.validate(req.body, {
    aboutEarly: false,
  });

  if (isValid.error) {
    const error = isValid.error.details.map((error) => error.message);
    res.status(STATUS_CODE.BAD_REQUEST).send(error);
    return;
  }

  try {
    if (await db.collection(COLLECTIONS.PRODUCTS).findOne({ name })) {
      res
        .status(STATUS_CODE.CONFLIT)
        .send({ message: "Produto já cadastrado" });
      return;
    }

    db.collection(COLLECTIONS.PRODUCTS).insertOne({
      name,
      img,
      price,
      description,
    });
    return res.sendStatus(STATUS_CODE.CREATED);
  } catch (error) {
    console.error(error);
    return res.send(STATUS_CODE.SERVER_ERROR);
  }
}

async function deleteProduct(req, res) {
  const { name } = req.body;

  try {
    if (await db.collection(COLLECTIONS.PRODUCTS).findOne({ name })) {
      db.collection(COLLECTIONS.PRODUCTS).deleteOne({ name });
      res.send({ message: "Produto deletado com sucesso" });
    }
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
}

export { registerProduct, deleteProduct };
