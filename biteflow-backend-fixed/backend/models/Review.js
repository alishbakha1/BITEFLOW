const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    restaurant: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant' },
    menuItem: { type: mongoose.Schema.Types.ObjectId, ref: 'MenuItem' },
    order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, default: '', trim: true },
  },
  { timestamps: true }
);

// A user can only review the same restaurant once
reviewSchema.index({ user: 1, restaurant: 1 }, { unique: true, partialFilterExpression: { restaurant: { $type: 'objectId' } } });

module.exports = mongoose.model('Review', reviewSchema);
