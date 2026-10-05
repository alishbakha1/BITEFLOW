const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    image: { type: String, default: '' },
    logo: { type: String, default: '' },
    address: { type: String, required: true },
    cuisine: [{ type: String }], // kept for backward compatibility
    categories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category' }],
    rating: { type: Number, default: 0, min: 0, max: 5 },
    numReviews: { type: Number, default: 0 },
    deliveryTime: { type: Number, default: 30 }, // minutes
    deliveryFee: { type: Number, default: 0 },
    minimumOrder: { type: Number, default: 0 },
    priceLevel: { type: String, enum: ['$', '$$', '$$$'], default: '$$' },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    status: { type: String, enum: ['open', 'closed', 'pending'], default: 'pending' },
    isOpen: { type: Boolean, default: true }, // kept for backward compatibility
    featured: { type: Boolean, default: false },
    verified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

restaurantSchema.index({ name: 'text', description: 'text' });

module.exports = mongoose.model('Restaurant', restaurantSchema);
