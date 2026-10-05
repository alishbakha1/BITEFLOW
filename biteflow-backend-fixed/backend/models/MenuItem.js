const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    price: { type: Number, required: true, min: 0 },
    discount: { type: Number, default: 0, min: 0, max: 100 }, // percentage
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
    image: { type: String, default: '' },
    ingredients: [{ type: String }],
    isAvailable: { type: Boolean, default: true },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    numReviews: { type: Number, default: 0 },
    restaurant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Restaurant',
      required: true,
    },
  },
  { timestamps: true }
);

menuItemSchema.index({ restaurant: 1, isAvailable: 1 });

module.exports = mongoose.model('MenuItem', menuItemSchema);
