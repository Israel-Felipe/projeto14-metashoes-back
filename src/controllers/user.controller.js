import bcrypt from "bcrypt";
import db from "../database/db.js";
import { v4 as uuid } from "uuid";
import { STATUS_CODE } from "../enums/statusCode.js";
import { COLLECTIONS } from "../enums/collections.js";
import { signUpSchema, signInSchema } from "../schemas/signSchema.js";

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
    return res.send(STATUS_CODE.SERVER_ERROR);
  }
}

async function signIn(req, res) {
  const { email, password } = req.body;

  const isValid = signInSchema.validate(req.body, { aboutEarly: false });

  if (isValid.error) {
    const error = isValid.error.details.map((error) => error.message);
    res.status(STATUS_CODE.BAD_REQUEST).send(error);
    return;
  }

  try {
    const user = await db.collection(COLLECTIONS.USERS).findOne({
      email,
    });

    const isValidPass = bcrypt.compareSync(password, user.password);

    if (!user || !isValidPass) {
      return res
        .status(STATUS_CODE.UNAUTHORIZED)
        .send({ message: "email ou senha incorretos" });
    }

    const token = uuid();
    db.collection(COLLECTIONS.SESSIONS).insertOne({
      userId: user._id,
      token,
    });

    delete user.password;

    return res.send({ token, user });
  } catch (error) {
    console.log(error);
    return res.send(STATUS_CODE.SERVER_ERROR);
  }
}

async function logout(req, res) {
  const token = res.locals.token;

  try {
    await db.collection(COLLECTIONS.SESSIONS).deleteOne({ token });

    res.send(STATUS_CODE.OK);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
}

export { signUp, signIn, logout };
