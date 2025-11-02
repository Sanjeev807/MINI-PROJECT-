require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('../models/Product');
const connectDB = require('../config/db');

const sampleProducts = [
  {
    name: 'Samsung Galaxy S23 Ultra',
    description: 'Latest flagship smartphone with 200MP camera, Snapdragon 8 Gen 2, and S Pen',
    price: 124999,
    originalPrice: 134999,
    discount: 7,
    category: 'Electronics',
    images: ['https://rukminim2.flixcart.com/image/416/416/xif0q/mobile/b/u/f/-original-imagth5xf4shxcuv.jpeg'],
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
    name: 'Apple iPhone 15 Pro',
    description: 'Titanium design, A17 Pro chip, 48MP camera with ProRAW',
    price: 134900,
    originalPrice: 139900,
    discount: 4,
    category: 'Electronics',
    images: ['https://rukminim2.flixcart.com/image/416/416/xif0q/mobile/k/l/l/-original-imagtc5fz9spysyk.jpeg'],
    stock: 30,
    rating: 4.8,
    reviews: 3621,
    isFeatured: true,
    specifications: new Map([
      ['Brand', 'Apple'],
      ['Storage', '256GB'],
      ['Display', '6.1" Super Retina XDR']
    ])
  },
  {
    name: 'Sony WH-1000XM5 Headphones',
    description: 'Industry-leading noise cancellation, 30-hour battery life',
    price: 29990,
    originalPrice: 34990,
    discount: 14,
    category: 'Electronics',
    images: ['https://rukminim2.flixcart.com/image/416/416/xif0q/headphone/r/h/w/-original-imagpq6gzr2z7g6t.jpeg'],
    stock: 100,
    rating: 4.7,
    reviews: 1523,
    isFeatured: true
  },
  {
    name: 'Levi\'s Men\'s Slim Fit Jeans',
    description: 'Classic 511 Slim Fit jeans in dark blue wash',
    price: 2499,
    originalPrice: 3999,
    discount: 37,
    category: 'Fashion',
    images: ['https://rukminim2.flixcart.com/image/832/832/xif0q/jean/h/y/g/32-23954-5021-levi-s-original-imagkyzgsrpatwww.jpeg'],
    stock: 200,
    rating: 4.3,
    reviews: 8945
  },
  {
    name: 'Nike Air Max 270 Running Shoes',
    description: 'Comfortable running shoes with Max Air unit',
    price: 12995,
    originalPrice: 14995,
    discount: 13,
    category: 'Fashion',
    images: ['https://rukminim2.flixcart.com/image/832/832/xif0q/shoe/v/n/h/-original-imagpg8yvh4zh5zx.jpeg'],
    stock: 75,
    rating: 4.5,
    reviews: 567,
    isFeatured: true
  },
  {
    name: 'Dell XPS 13 Laptop',
    description: '13th Gen Intel Core i7, 16GB RAM, 512GB SSD, FHD+ Display',
    price: 119990,
    originalPrice: 139990,
    discount: 14,
    category: 'Electronics',
    images: ['https://rukminim2.flixcart.com/image/416/416/xif0q/computer/v/x/i/-original-imagpxgr6ztzhzfg.jpeg'],
    stock: 25,
    rating: 4.6,
    reviews: 423,
    isFeatured: true
  },
  {
    name: 'Boat Airdopes 131 TWS Earbuds',
    description: 'Wireless earbuds with 60H playback, ENx technology',
    price: 1299,
    originalPrice: 2990,
    discount: 57,
    category: 'Electronics',
    images: ['https://rukminim2.flixcart.com/image/416/416/xif0q/headphone/6/p/z/-original-imah2n9mfcfmgbuh.jpeg'],
    stock: 500,
    rating: 4.1,
    reviews: 15678
  },
  {
    name: 'The Alchemist by Paulo Coelho',
    description: 'International bestseller about following your dreams',
    price: 299,
    originalPrice: 399,
    discount: 25,
    category: 'Books',
    images: ['https://rukminim2.flixcart.com/image/416/416/kph8h3k0/book/s/4/2/the-alchemist-original-imag3ph48wyufehy.jpeg'],
    stock: 1000,
    rating: 4.8,
    reviews: 25678
  },
  {
    name: 'Philips Air Fryer HD9252/90',
    description: 'Healthier cooking with Rapid Air Technology, 4.1L capacity',
    price: 7999,
    originalPrice: 12995,
    discount: 38,
    category: 'Home',
    images: ['https://rukminim2.flixcart.com/image/416/416/xif0q/air-fryer/o/h/m/-original-imagqqn2bcvgggaf.jpeg'],
    stock: 60,
    rating: 4.4,
    reviews: 3456,
    isFeatured: true
  },
  {
    name: 'Adidas Football Size 5',
    description: 'Professional quality football with thermally bonded panels',
    price: 1499,
    originalPrice: 2499,
    discount: 40,
    category: 'Sports',
    images: ['https://rukminim2.flixcart.com/image/416/416/xif0q/ball/m/l/m/450-5-23-fifa-quality-pro-ucl-competition-pyrostorm-football-original-imagvtgkhvkbqbxp.jpeg'],
    stock: 150,
    rating: 4.2,
    reviews: 892
  },
  {
    name: 'Maybelline New York Lipstick',
    description: 'SuperStay Matte Ink Liquid Lipstick - Long Lasting',
    price: 499,
    originalPrice: 699,
    discount: 29,
    category: 'Beauty',
    images: ['https://rukminim2.flixcart.com/image/416/416/xif0q/lipstick/v/w/h/-original-imagnzfygzmgvsgw.jpeg'],
    stock: 300,
    rating: 4.3,
    reviews: 5678
  },
  {
    name: 'LEGO Classic Creative Building Set',
    description: '1500 pieces creative building blocks for kids',
    price: 3999,
    originalPrice: 5999,
    discount: 33,
    category: 'Toys',
    images: ['https://rukminim2.flixcart.com/image/416/416/xif0q/block-construction/b/c/4/large-creative-brick-box-11013-lego-original-imagh6ywjhqhgzsw.jpeg'],
    stock: 80,
    rating: 4.7,
    reviews: 1234
  },
  {
    name: 'Tata Tea Premium',
    description: 'Premium black tea - 1kg pack',
    price: 475,
    originalPrice: 520,
    discount: 9,
    category: 'Grocery',
    images: ['https://rukminim2.flixcart.com/image/416/416/xif0q/tea/f/l/a/1-premium-black-tea-vacuum-pack-tata-tea-original-imagpggz7fyznzfw.jpeg'],
    stock: 500,
    rating: 4.5,
    reviews: 8923
  },
  {
    name: 'Havells Air Purifier',
    description: 'HEPA filter, 3-stage purification, covers 300 sq ft',
    price: 8999,
    originalPrice: 14999,
    discount: 40,
    category: 'Home',
    images: ['https://rukminim2.flixcart.com/image/416/416/xif0q/air-purifier/y/v/r/-original-imagrghybbhvbzut.jpeg'],
    stock: 45,
    rating: 4.3,
    reviews: 678
  },
  {
    name: 'Puma Gym Bag',
    description: 'Spacious sports duffle bag with multiple compartments',
    price: 1299,
    originalPrice: 2499,
    discount: 48,
    category: 'Sports',
    images: ['https://rukminim2.flixcart.com/image/416/416/xif0q/duffel-bag/y/q/f/fundamentals-sports-bag-m-25-gym-bag-puma-original-imagz6ubghhhvswa.jpeg'],
    stock: 120,
    rating: 4.1,
    reviews: 234
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
