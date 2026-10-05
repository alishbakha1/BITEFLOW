const { body } = require('express-validator');

exports.createOrderValidator = [
  body('restaurant').notEmpty().withMessage('restaurant is required'),
  body('items').isArray({ min: 1 }).withMessage('items must be a non-empty array'),
  body('items.*.menuItem').notEmpty().withMessage('each item needs a menuItem id'),
  body('items.*.quantity').isInt({ min: 1 }).withMessage('each item needs a quantity of at least 1'),
  body('deliveryAddress').trim().notEmpty().withMessage('deliveryAddress is required'),
];
