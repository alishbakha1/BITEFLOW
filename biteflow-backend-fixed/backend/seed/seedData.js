// Run with: npm run seed
// Wipes and re-populates Users, Categories, Restaurants and MenuItems with
// demo data so the API has something real to return.
const dotenv = require('dotenv');
dotenv.config();

const connectDB = require('../config/db');
const User = require('../models/User');
const Category = require('../models/Category');
const Restaurant = require('../models/Restaurant');
const MenuItem = require('../models/MenuItem');

const categories = ['Pizza', 'Burger', 'Pakistani', 'Chinese', 'BBQ', 'Dessert', 'Healthy', 'Cafe', 'Fast Food'];

const restaurantsSeed = [
  { name: 'Pizza Paradise', category: 'Pizza', rating: 4.8, deliveryTime: 25, deliveryFee: 2.99, minimumOrder: 15, priceLevel: '$$', featured: true,
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80' },
  { name: 'Burger House', category: 'Burger', rating: 4.6, deliveryTime: 20, deliveryFee: 1.99, minimumOrder: 12, priceLevel: '$', featured: false,
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80' },
  { name: 'Spice Village', category: 'Pakistani', rating: 4.9, deliveryTime: 35, deliveryFee: 3.99, minimumOrder: 20, priceLevel: '$$$', featured: true,
    image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=800&q=80' },
  { name: 'Wok Express', category: 'Chinese', rating: 4.5, deliveryTime: 30, deliveryFee: 2.49, minimumOrder: 18, priceLevel: '$', featured: false,
    image: 'https://images.unsplash.com/photo-1525755662778-989d0524087e?auto=format&fit=crop&w=800&q=80' },
  { name: 'BBQ Kingdom', category: 'BBQ', rating: 4.7, deliveryTime: 40, deliveryFee: 4.99, minimumOrder: 25, priceLevel: '$$$', featured: false,
    image: 'https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?auto=format&fit=crop&w=800&q=80' },
  { name: 'Sweet Tooth', category: 'Dessert', rating: 4.4, deliveryTime: 15, deliveryFee: 1.49, minimumOrder: 10, priceLevel: '$', featured: false,
    image: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?auto=format&fit=crop&w=800&q=80' },
  { name: 'Green Bowl', category: 'Healthy', rating: 4.3, deliveryTime: 25, deliveryFee: 2.99, minimumOrder: 16, priceLevel: '$$', featured: false,
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80' },
  { name: 'Cafe Aroma', category: 'Cafe', rating: 4.2, deliveryTime: 20, deliveryFee: 1.99, minimumOrder: 10, priceLevel: '$', featured: false,
    image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=800&q=80' },
  { name: 'Fast Lane', category: 'Fast Food', rating: 4.1, deliveryTime: 15, deliveryFee: 0.99, minimumOrder: 8, priceLevel: '$', featured: false,
    image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?auto=format&fit=crop&w=800&q=80' },
  { name: 'Tandoori Nights', category: 'Pakistani', rating: 4.8, deliveryTime: 35, deliveryFee: 3.49, minimumOrder: 22, priceLevel: '$$$', featured: true,
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80' },
  { name: 'Slice & Dice', category: 'Pizza', rating: 4.0, deliveryTime: 30, deliveryFee: 2.49, minimumOrder: 14, priceLevel: '$$', featured: false,
    image: 'https://images.unsplash.com/photo-1548365328-9f547fb0953b?auto=format&fit=crop&w=800&q=80' },
  { name: 'Golden Dragon', category: 'Chinese', rating: 4.6, deliveryTime: 30, deliveryFee: 2.99, minimumOrder: 20, priceLevel: '$$', featured: true,
    image: 'https://images.unsplash.com/photo-1552611052-33e04de081de?auto=format&fit=crop&w=800&q=80' },
  { name: 'Grill Master', category: 'BBQ', rating: 4.5, deliveryTime: 45, deliveryFee: 5.99, minimumOrder: 30, priceLevel: '$$$', featured: false,
    image: 'https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?auto=format&fit=crop&w=800&q=80' },
  { name: 'Healthy Bites', category: 'Healthy', rating: 4.4, deliveryTime: 20, deliveryFee: 2.49, minimumOrder: 15, priceLevel: '$$', featured: false,
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80' },
  { name: 'Coffee House', category: 'Cafe', rating: 4.3, deliveryTime: 15, deliveryFee: 1.49, minimumOrder: 8, priceLevel: '$', featured: false,
    image: 'https://images.unsplash.com/photo-1501335984760-a3096e5e4fe9?auto=format&fit=crop&w=800&q=80' },
  { name: 'Burger Point', category: 'Burger', rating: 4.7, deliveryTime: 18, deliveryFee: 1.99, minimumOrder: 12, priceLevel: '$', featured: false,
    image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=800&q=80' },
];

const menuImagesByCategory = {
  Pizza: ['https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?auto=format&fit=crop&w=400&q=80', 'https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=400&q=80'],
  Burger: ['https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=400&q=80', 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=400&q=80'],
  Pakistani: ['https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=400&q=80', 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=400&q=80'],
  Chinese: ['https://images.unsplash.com/photo-1525755662778-989d0524087e?auto=format&fit=crop&w=400&q=80', 'https://images.unsplash.com/photo-1552611052-33e04de081de?auto=format&fit=crop&w=400&q=80'],
  BBQ: ['https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?auto=format&fit=crop&w=400&q=80'],
  Dessert: ['https://images.unsplash.com/photo-1551024506-0bccd828d307?auto=format&fit=crop&w=400&q=80', 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=400&q=80'],
  Healthy: ['https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=400&q=80'],
  Cafe: ['https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=400&q=80', 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=400&q=80'],
  'Fast Food': ['https://images.unsplash.com/photo-1571091718767-18b5b1457add?auto=format&fit=crop&w=400&q=80'],
};

const run = async () => {
  await connectDB();

  console.log('Clearing existing demo data...');
  await Promise.all([
    User.deleteMany({ email: /@biteflow\.demo$/ }),
    Category.deleteMany({}),
    Restaurant.deleteMany({}),
    MenuItem.deleteMany({}),
  ]);

  console.log('Creating categories...');
  const categoryDocs = await Category.insertMany(categories.map((name) => ({ name })));
  const categoryByName = Object.fromEntries(categoryDocs.map((c) => [c.name, c]));

  console.log('Creating demo owner and admin users...');
  const owner = await User.create({
    name: 'Demo Restaurant Owner',
    email: 'owner@biteflow.demo',
    password: 'password123',
    role: 'restaurant_owner',
  });
  await User.create({
    name: 'Demo Admin',
    email: 'admin@biteflow.demo',
    password: 'password123',
    role: 'admin',
  });

  console.log('Creating restaurants and menu items...');
  for (const r of restaurantsSeed) {
    const restaurant = await Restaurant.create({
      name: r.name,
      description: `${r.name} — great food, fast delivery.`,
      image: r.image,
      logo: r.image,
      address: '123 Demo Street, Karachi',
      categories: [categoryByName[r.category]._id],
      rating: r.rating,
      deliveryTime: r.deliveryTime,
      deliveryFee: r.deliveryFee,
      minimumOrder: r.minimumOrder,
      priceLevel: r.priceLevel,
      owner: owner._id,
      status: 'open',
      isOpen: true,
      featured: r.featured,
      verified: true,
    });

    const images = menuImagesByCategory[r.category] || [];
    await MenuItem.insertMany([
      {
        name: `${r.name} Signature Combo`,
        description: 'Chef\u2019s signature combo, made fresh to order.',
        price: 12.99,
        category: categoryByName[r.category]._id,
        restaurant: restaurant._id,
        image: images[0] || '',
        rating: r.rating,
        isAvailable: true,
      },
      {
        name: `${r.name} Classic`,
        description: 'A tried-and-true favorite.',
        price: 8.99,
        category: categoryByName[r.category]._id,
        restaurant: restaurant._id,
        image: images[1] || images[0] || '',
        rating: Math.max(3.8, r.rating - 0.2),
        isAvailable: true,
      },
    ]);
  }

  console.log('Seed complete.');
  console.log('Demo login: owner@biteflow.demo / admin@biteflow.demo, password: password123');
  process.exit(0);
};

run().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});