import db from "../database/db.js";
import { COLLECTIONS } from "../enums/collections.js";

async function createPurchase(req, res) {
    const { token } = res.locals;
    const { user } = res.locals;

    try {
        cart = await db.collection(COLLECTIONS.MARKET).findOne({ userId: user._id });
        await db.collection(COLLECTIONS.PURCHASES).insertOne(cart);
        await db.collection(COLLECTIONS.MARKET).deleteOne({ _id: cart._id });

        return res.status(201).send({ message: "Pagamento efetuado com sucesso!" });

    } catch(error) {
        console.error(error);
        return res.status(500).send(error.message);
    }
  };

  export { createPurchase };