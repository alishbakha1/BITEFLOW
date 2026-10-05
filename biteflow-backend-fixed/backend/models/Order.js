const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema(
  {
    menuItem: { type: mongoose.Schema.Types.ObjectId, ref: 'MenuItem' },
    name: { type: String, required: true }, // snapshot in case menu item changes later
    quantity: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    restaurant: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true },
    items: {
      type: [orderItemSchema],
      validate: [(arr) => arr.length > 0, 'Order must contain at least one item'],
    },
    itemsPrice: { type: Number, required: true, default: 0 },
    deliveryFee: { type: Number, required: true, default: 0 },
    totalAmount: { type: Number, required: true },
    deliveryAddress: { type: String, required: true },
    contactPhone: { type: String, default: '' },
    status: {
      type: String,
      enum: ['Pending', 'Confirmed', 'Preparing', 'Out For Delivery', 'Delivered', 'Cancelled'],
      default: 'Pending',
    },
    paymentMethod: { type: String, enum: ['COD', 'Card'], default: 'COD' },
    isPaid: { type: Boolean, default: false },
    paidAt: { type: Date },
    cancelReason: { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);
