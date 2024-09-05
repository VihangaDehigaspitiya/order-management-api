import Joi from "joi";

const customerDetailsSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  mobile_no: Joi.string()
    .pattern(/^[0-9]{10,15}$/)
    .required(),
  address: Joi.string().required(),
});

const productSchema = Joi.object({
  id: Joi.number().required(),
  price: Joi.number().positive().required(),
  quantity: Joi.number().integer().positive().required(),
});

const addOrderSchema = Joi.object({
  customer_details: customerDetailsSchema.required(),
  products: Joi.array().items(productSchema).min(1).required(),
});

export default {
  addOrderSchema,
};
