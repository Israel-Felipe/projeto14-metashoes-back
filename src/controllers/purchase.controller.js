import db from "../database/db.js";
import { COLLECTIONS } from "../enums/collections.js";

async function createPurchase(req, res) {
    const { token } = res.locals;
  
    try {
  
    } catch(error) {
      console.error(error);
      return res.status(500).send(error.message);
    }
  
  };

  export { createPurchase };