import Joi from "joi";

const productSchema = Joi.object({
  idProduct: Joi.string().required(),
  name: Joi.string().required(),
  size: Joi.number().required(),
  color: Joi.string()
    .required()
    .empty("")
    .regex(/[a-zA-Z0-9]/)
    .messages({
      "string.pattern.base": "A cor deve ter pelo menos uma letra",
    }),
  quantity: Joi.number().required(),
});

export { productSchema };
