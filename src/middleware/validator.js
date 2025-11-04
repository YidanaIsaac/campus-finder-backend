const Joi = require('joi');

const validateRequest = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });
    if (error) {
      const errors = error.details.map(detail => detail.message);
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors
      });
    }
    next();
  };
};

const registerSchema = Joi.object({
  name: Joi.string().min(2).max(50).required(),
  email: Joi.string().email().required(),
  idNumber: Joi.string().required(),
  userType: Joi.string().valid('student', 'staff', 'security', 'visitor').required(),
  password: Joi.string().min(6).required(),
  phone: Joi.string().allow(''),
  department: Joi.string().allow('')
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

const changePasswordSchema = Joi.object({
  currentPassword: Joi.string().required(),
  newPassword: Joi.string().min(6).required(),
  confirmPassword: Joi.string().valid(Joi.ref('newPassword')).required()
});

const updateProfileSchema = Joi.object({
  name: Joi.string().min(2).max(50),
  email: Joi.string().email(),
  phone: Joi.string().allow(''),
  department: Joi.string().allow('')
});

const lostItemSchema = Joi.object({
  itemName: Joi.string().required(),
  category: Joi.string().valid('Electronics', 'Clothing', 'Books', 'Accessories', 'Documents', 'Other').required(),
  description: Joi.string().min(10).required(),
  location: Joi.string().required(),
  dateLost: Joi.date().required(),
  color: Joi.string().allow(''),
  brand: Joi.string().allow(''),
  images: Joi.array().items(Joi.string())
});

const foundItemSchema = Joi.object({
  itemName: Joi.string().required(),
  category: Joi.string().valid('Electronics', 'Clothing', 'Books', 'Accessories', 'Documents', 'Other').required(),
  description: Joi.string().min(10).required(),
  location: Joi.string().required(),
  dateFound: Joi.date().required(),
  color: Joi.string().allow(''),
  brand: Joi.string().allow(''),
  images: Joi.array().items(Joi.string())
});

module.exports = {
  validateRequest,
  registerSchema,
  loginSchema,
  changePasswordSchema,
  updateProfileSchema,
  lostItemSchema,
  foundItemSchema
};
