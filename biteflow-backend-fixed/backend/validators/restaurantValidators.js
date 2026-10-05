const { body } = require('express-validator');

exports.restaurantValidator = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('address').trim().notEmpty().withMessage('Address is required'),
  body('deliveryFee').optional().isFloat({ min: 0 }).withMessage('deliveryFee must be a positive number'),
  body('minimumOrder').optional().isFloat({ min: 0 }).withMessage('minimumOrder must be a positive number'),
];

exports.menuItemValidator = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('price').isFloat({ min: 0 }).withMessage('price must be a positive number'),
];
