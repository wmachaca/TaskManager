const { body, validationResult } = require('express-validator');
const taskValidationRules = [
  body('title')
    .trim()
    .notEmpty().withMessage('Title is required')
    .isLength({ max: 100 }).withMessage('Title must be less than 100 characters'),
  
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 }).withMessage('Description must be less than 500 characters'),
  
  body('status')
    .optional()
    .isIn(['IN_COURSE', 'FINISHED', 'STOPPED']).withMessage('Invalid status'),
    
  body('priority')
    .optional()
    .isIn(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']).withMessage('Invalid priority'),
    
  body('dueDate')
    .optional()
    .isISO8601().withMessage('Invalid date format')
    .toDate(),
    
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

module.exports = [...taskValidationRules, validate];