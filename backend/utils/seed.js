require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('../models/Product');
const connectDB = require('../config/db');

const sampleProducts = [
  // ELECTRONICS CATEGORY
  {
    name: 'Samsung Galaxy S23 Ultra',
    description: 'Latest flagship smartphone with 200MP camera, Snapdragon 8 Gen 2, and S Pen',
    price: 124999,
    originalPrice: 134999,
    discount: 7,
    category: 'Electronics',
    images: ['https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=500&h=500&fit=crop&q=80'],
    stock: 50,
    rating: 4.6,
    reviews: 2847,
    isFeatured: true,
    specifications: new Map([
      ['Brand', 'Samsung'],
      ['RAM', '12GB'],
      ['Storage', '256GB'],
      ['Display', '6.8" Dynamic AMOLED 2X']
    ])
  },
  {
    name: 'Apple MacBook Pro 14',
    description: 'M3 Pro chip, 18GB RAM, 512GB SSD, Liquid Retina XDR display',
    price: 199900,
    originalPrice: 219900,
    discount: 9,
    category: 'Electronics',
    images: ['https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&h=500&fit=crop&q=80'],
    stock: 25,
    rating: 4.9,
    reviews: 1823,
    isFeatured: true,
    specifications: new Map([
      ['Brand', 'Apple'],
      ['Processor', 'M3 Pro'],
      ['RAM', '18GB'],
      ['Display', '14.2" Liquid Retina XDR']
    ])
  },
  {
    name: 'Sony WH-1000XM5 Headphones',
    description: 'Industry-leading noise cancellation, 30-hour battery life, premium audio',
    price: 29990,
    originalPrice: 34990,
    discount: 14,
    category: 'Electronics',
    images: ['https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=500&h=500&fit=crop&q=80'],
    stock: 100,
    rating: 4.7,
    reviews: 1523,
    isFeatured: true
  },
  {
    name: 'Samsung 4K Smart TV 55 Inch',
    description: 'Crystal UHD 4K TV with Dynamic Crystal Color and Smart Hub',
    price: 44990,
    originalPrice: 64990,
    discount: 31,
    category: 'Electronics',
    images: ['https://images.unsplash.com/photo-1593784991095-a205069470b6?w=500&h=500&fit=crop&q=80'],
    stock: 40,
    rating: 4.5,
    reviews: 1234,
    isFeatured: false,
    specifications: new Map([
      ['Brand', 'Samsung'],
      ['Screen Size', '55 inches'],
      ['Resolution', '4K UHD'],
      ['Smart TV', 'Yes']
    ])
  },
  {
    name: 'Canon EOS M50 Mark II',
    description: 'Mirrorless camera with 24.1MP sensor, 4K video, WiFi',
    price: 54990,
    originalPrice: 64990,
    discount: 15,
    category: 'Electronics',
    images: ['https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=500&h=500&fit=crop&q=80'],
    stock: 30,
    rating: 4.7,
    reviews: 876,
    isFeatured: true,
    specifications: new Map([
      ['Brand', 'Canon'],
      ['Megapixels', '24.1MP'],
      ['Video', '4K UHD'],
      ['Type', 'Mirrorless']
    ])
  },

  // FASHION CATEGORY
  {
    name: 'Levi\'s Men\'s Slim Fit Jeans',
    description: 'Classic 511 Slim Fit jeans in dark blue wash, premium denim',
    price: 2499,
    originalPrice: 3999,
    discount: 37,
    category: 'Fashion',
    images: ['https://images.unsplash.com/photo-1542272454315-7f6fabf4b329?w=500&h=500&fit=crop&q=80'],
    stock: 200,
    rating: 4.3,
    reviews: 8945,
    specifications: new Map([
      ['Brand', 'Levi\'s'],
      ['Fit', 'Slim'],
      ['Material', 'Denim'],
      ['Color', 'Dark Blue']
    ])
  },
  {
    name: 'Nike Air Max 270 Running Shoes',
    description: 'Comfortable running shoes with Max Air unit, breathable mesh',
    price: 12995,
    originalPrice: 14995,
    discount: 13,
    category: 'Fashion',
    images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&h=500&fit=crop&q=80'],
    stock: 75,
    rating: 4.5,
    reviews: 567,
    isFeatured: true,
    specifications: new Map([
      ['Brand', 'Nike'],
      ['Type', 'Running Shoes'],
      ['Technology', 'Max Air'],
      ['Material', 'Mesh']
    ])
  },
  {
    name: 'Adidas Men\'s T-Shirt',
    description: 'Premium cotton sports t-shirt with moisture-wicking technology',
    price: 999,
    originalPrice: 1599,
    discount: 38,
    category: 'Fashion',
    images: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&h=500&fit=crop&q=80'],
    stock: 300,
    rating: 4.2,
    reviews: 2345,
    specifications: new Map([
      ['Brand', 'Adidas'],
      ['Material', 'Cotton'],
      ['Fit', 'Regular'],
      ['Feature', 'Moisture-wicking']
    ])
  },
  {
    name: 'Puma Women\'s Sports Jacket',
    description: 'Stylish sports jacket with zip closure and side pockets',
    price: 2999,
    originalPrice: 4999,
    discount: 40,
    category: 'Fashion',
    images: ['https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500&h=500&fit=crop&q=80'],
    stock: 120,
    rating: 4.4,
    reviews: 987,
    isFeatured: false,
    specifications: new Map([
      ['Brand', 'Puma'],
      ['Type', 'Sports Jacket'],
      ['Material', 'Polyester'],
      ['Gender', 'Women']
    ])
  },

  // HOME CATEGORY
  {
    name: 'Philips Air Fryer HD9252/90',
    description: 'Healthier cooking with Rapid Air Technology, 4.1L capacity',
    price: 7999,
    originalPrice: 12995,
    discount: 38,
    category: 'Home',
    images: ['https://images.unsplash.com/photo-1585515320310-259814833e62?w=500&h=500&fit=crop&q=80'],
    stock: 60,
    rating: 4.4,
    reviews: 3456,
    isFeatured: true,
    specifications: new Map([
      ['Brand', 'Philips'],
      ['Capacity', '4.1L'],
      ['Technology', 'Rapid Air'],
      ['Power', '1400W']
    ])
  },
  {
    name: 'Prestige Induction Cooktop',
    description: 'Energy efficient 2000W induction cooktop with auto shut-off',
    price: 2199,
    originalPrice: 3499,
    discount: 37,
    category: 'Home',
    images: ['https://images.unsplash.com/photo-1556911220-bff31c812dba?w=500&h=500&fit=crop&q=80'],
    stock: 90,
    rating: 4.1,
    reviews: 1876,
    specifications: new Map([
      ['Brand', 'Prestige'],
      ['Power', '2000W'],
      ['Feature', 'Auto Shut-off'],
      ['Type', 'Induction']
    ])
  },
  {
    name: 'Usha Ceiling Fan',
    description: 'Energy-efficient 1200mm ceiling fan with decorative design',
    price: 1699,
    originalPrice: 2499,
    discount: 32,
    category: 'Home',
    images: ['https://images.unsplash.com/photo-1581858125209-81c2e2f5e9c7?w=500&h=500&fit=crop&q=80'],
    stock: 150,
    rating: 4.3,
    reviews: 1234,
    specifications: new Map([
      ['Brand', 'Usha'],
      ['Size', '1200mm'],
      ['Blades', '3'],
      ['Speed', '1200 RPM']
    ])
  },

  // BOOKS CATEGORY
  {
    name: 'The Alchemist by Paulo Coelho',
    description: 'International bestseller about following your dreams',
    price: 299,
    originalPrice: 399,
    discount: 25,
    category: 'Books',
    images: ['https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500&h=500&fit=crop&q=80'],
    stock: 1000,
    rating: 4.8,
    reviews: 25678,
    specifications: new Map([
      ['Author', 'Paulo Coelho'],
      ['Pages', '197'],
      ['Language', 'English'],
      ['Publisher', 'HarperCollins']
    ])
  },
  {
    name: 'Atomic Habits by James Clear',
    description: 'Tiny changes, remarkable results - life-changing habits guide',
    price: 399,
    originalPrice: 599,
    discount: 33,
    category: 'Books',
    images: ['https://images.unsplash.com/photo-1512820790803-83ca734da794?w=500&h=500&fit=crop&q=80'],
    stock: 800,
    rating: 4.9,
    reviews: 18976,
    isFeatured: true,
    specifications: new Map([
      ['Author', 'James Clear'],
      ['Pages', '320'],
      ['Language', 'English'],
      ['Category', 'Self-Help']
    ])
  },
  {
    name: 'Harry Potter Box Set',
    description: 'Complete 7-book collection of the magical Harry Potter series',
    price: 2999,
    originalPrice: 4999,
    discount: 40,
    category: 'Books',
    images: ['https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=500&h=500&fit=crop&q=80'],
    stock: 200,
    rating: 4.9,
    reviews: 12345,
    isFeatured: true,
    specifications: new Map([
      ['Author', 'J.K. Rowling'],
      ['Books', '7 volumes'],
      ['Language', 'English'],
      ['Genre', 'Fantasy']
    ])
  },

  // SPORTS CATEGORY
  {
    name: 'Adidas Football Size 5',
    description: 'Professional quality football with thermally bonded panels',
    price: 1499,
    originalPrice: 2499,
    discount: 40,
    category: 'Sports',
    images: ['https://images.unsplash.com/photo-1614632537423-1e6c2e7e0aae?w=500&h=500&fit=crop&q=80'],
    stock: 150,
    rating: 4.2,
    reviews: 892,
    specifications: new Map([
      ['Brand', 'Adidas'],
      ['Size', '5'],
      ['Material', 'Synthetic Leather'],
      ['Type', 'Match Ball']
    ])
  },
  {
    name: 'Yonex Badminton Racket',
    description: 'Lightweight carbon fiber racket for professional play',
    price: 3499,
    originalPrice: 5999,
    discount: 42,
    category: 'Sports',
    images: ['https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=500&h=500&fit=crop&q=80'],
    stock: 80,
    rating: 4.6,
    reviews: 567,
    isFeatured: false,
    specifications: new Map([
      ['Brand', 'Yonex'],
      ['Weight', '85g'],
      ['Material', 'Carbon Fiber'],
      ['Grip Size', 'G4']
    ])
  },
  {
    name: 'Nike Gym Dumbbell Set',
    description: 'Adjustable dumbbell set 2-20kg with comfortable grip',
    price: 4999,
    originalPrice: 7999,
    discount: 38,
    category: 'Sports',
    images: ['https://images.unsplash.com/photo-1638805982-e0442b3cacb4?w=500&h=500&fit=crop&q=80'],
    stock: 100,
    rating: 4.5,
    reviews: 1456,
    isFeatured: true,
    specifications: new Map([
      ['Brand', 'Nike'],
      ['Weight Range', '2-20kg'],
      ['Material', 'Iron + Rubber'],
      ['Type', 'Adjustable']
    ])
  },
  {
    name: 'Puma Gym Bag',
    description: 'Spacious sports duffle bag with multiple compartments',
    price: 1299,
    originalPrice: 2499,
    discount: 48,
    category: 'Sports',
    images: ['https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&h=500&fit=crop&q=80'],
    stock: 120,
    rating: 4.1,
    reviews: 234,
    specifications: new Map([
      ['Brand', 'Puma'],
      ['Capacity', '40L'],
      ['Material', 'Polyester'],
      ['Compartments', 'Multiple']
    ])
  }
];

const seedDatabase = async () => {
  try {
    await connectDB();

    // Clear existing products
    await Product.deleteMany({});
    console.log('Existing products cleared');

    // Insert sample products
    await Product.insertMany(sampleProducts);
    console.log('✅ Sample products seeded successfully!');
    console.log(`📦 Added ${sampleProducts.length} products`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
