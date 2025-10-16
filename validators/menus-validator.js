// validation/menuValidation.js
import Joi from "joi";

export const menuSchema = Joi.object({
  restaurant_id: Joi.string().required(),
  name: Joi.string().min(3).required(),
  description: Joi.string().allow(""),
  price: Joi.number().positive().required(),
  category: Joi.string().required(),
});

export const RestaurantSchema = Joi.object({
  id: Joi.string().required(),
  name: Joi.string().min(3).required(),
  address: Joi.string().allow(""),
  phone: Joi.number().positive().required(),
  opening_hours: Joi.string().required(),
});

// middlewares/validateMiddleware.js
export const validateBody = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });
  next();
};
