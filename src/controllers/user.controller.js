import bcrypt from "bcrypt";
import db from "../database/db.js";
import { STATUS_CODE } from "../enums/statusCode.js";
import { COLLECTIONS } from "../enums/collections.js";
import { signUpSchema } from "../schemas/signSchema.js";

async function signUp(req, res) {
  const { name, email, password } = req.body;

  const isValid = signUpSchema.validate(req.body, { aboutEarly: false });

  if (isValid.error) {
    const error = isValid.error.details.map((error) => error.message);
    res.status(STATUS_CODE.BAD_REQUEST).send(error);
    return;
  }

  const encrypetPassword = bcrypt.hashSync(password, 10);
  try {
    if (await db.collection(COLLECTIONS.USERS).findOne({ email })) {
      res.status(STATUS_CODE.CONFLIT).send({ message: "Email já cadastrado" });
      return;
    }

    db.collection(COLLECTIONS.USERS).insertOne({
      name,
      email,
      password: encrypetPassword,
    });
    return res.sendStatus(STATUS_CODE.CREATED);
  } catch (error) {
    console.error(error);
    return res.send(STATUS_CODE.SERVER_ERROR); /* dasd */
  }
}

export { signUp };
