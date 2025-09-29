const Joi = require('joi');

const taskValidationSchema = Joi.object({
  title: Joi.string().required().max(100).messages({
    'string.empty': 'The title is required.',
    'string.max': 'The title cannot exceed 100 characters.',
  }),
  description: Joi.string().optional().max(500).messages({
    'string.max': 'The description cannot exceed 500 characters.',
  }),
  status: Joi.string().valid('IN_COURSE', 'FINISHED', 'STOPPED').optional().messages({
    'any.only': 'The status must be IN_COURSE, FINISHED, or STOPPED.',
  }),
  priority: Joi.string().valid('LOW', 'MEDIUM', 'HIGH', 'CRITICAL').optional().messages({
    'any.only': 'The priority must be LOW, MEDIUM, HIGH, or CRITICAL.',
  }),
  dueDate: Joi.date().optional().messages({
    'date.base': 'The date must be valid.',
  }),
});

module.exports = (req, res, next) => {
  const { error } = taskValidationSchema.validate(req.body, { abortEarly: false });
  if (error) {
    return res.status(400).json({
      errors: error.details.map(detail => detail.message),
    });
  }
  next();
};
