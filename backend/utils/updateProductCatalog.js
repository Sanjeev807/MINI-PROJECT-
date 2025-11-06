require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const { sequelize } = require('../config/database');
const Product = require('../models/Product');

const products = [
  // Electronics (10 products)
  {
    name: 'Samsung 55" Smart LED TV',
    description: 'Ultra HD 4K Smart LED Television with HDR support, built-in streaming apps, and voice control. Perfect for home entertainment.',
    price: 54999,
    category: 'Electronics',
    stock: 15,
    image: 'https://images.unsplash.com/photo-1593784991095-a205069470b6?w=500&q=80'
  },
  {
    name: 'Dell XPS 15 Notebook Computer',
    description: 'High-performance laptop with Intel Core i7 processor, 16GB RAM, 512GB SSD. Ideal for work and gaming.',
    price: 124999,
    category: 'Electronics',
    stock: 8,
    image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500&q=80'
  },
  {
    name: 'iPhone 15 Pro Max Smartphone',
    description: 'Latest Apple iPhone with A17 Pro chip, advanced camera system, and titanium design. Premium smartphone experience.',
    price: 159999,
    category: 'Electronics',
    stock: 20,
    image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500&q=80'
  },
  {
    name: 'Sony Wireless Noise-Cancelling Headphones',
    description: 'Premium wireless headphones with industry-leading noise cancellation and 30-hour battery life.',
    price: 29999,
    category: 'Electronics',
    stock: 25,
    image: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=500&q=80'
  },
  {
    name: 'Apple Watch Series 9 Smartwatch',
    description: 'Advanced fitness tracking, health monitoring, and seamless connectivity with iPhone. Water resistant design.',
    price: 41999,
    category: 'Electronics',
    stock: 18,
    image: 'https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=500&q=80'
  },
  {
    name: 'JBL Flip 6 Bluetooth Speaker',
    description: 'Portable waterproof speaker with powerful JBL sound and 12-hour playtime. Perfect for outdoor adventures.',
    price: 11999,
    category: 'Electronics',
    stock: 30,
    image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500&q=80'
  },
  {
    name: 'Anker 20000mAh Portable Power Bank',
    description: 'High-capacity power bank with fast charging technology. Keep your devices powered on the go.',
    price: 3499,
    category: 'Electronics',
    stock: 40,
    image: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=500&q=80'
  },
  {
    name: 'Canon EOS R50 Mirrorless Digital Camera',
    description: 'Professional mirrorless camera with 4K video recording and advanced autofocus system.',
    price: 64999,
    category: 'Electronics',
    stock: 12,
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=500&q=80'
  },
  {
    name: 'TP-Link AC1750 Wi-Fi Router',
    description: 'Dual-band wireless router with high-speed connectivity and excellent coverage for homes and offices.',
    price: 4999,
    category: 'Electronics',
    stock: 22,
    image: 'https://images.unsplash.com/photo-1606904825846-647eb07f5be2?w=500&q=80'
  },
  {
    name: 'Sony PlayStation 5 Gaming Console',
    description: 'Next-generation gaming console with ultra-fast SSD, ray tracing, and immersive 3D audio.',
    price: 49999,
    category: 'Electronics',
    stock: 10,
    image: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=500&q=80'
  },

  // Fashion (10 products)
  {
    name: 'Adidas Originals Graphic Tee',
    description: 'Comfortable cotton t-shirt with iconic Adidas branding. Perfect for casual wear and sports activities.',
    price: 1499,
    category: 'Fashion',
    stock: 50,
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&q=80'
  },
  {
    name: 'Levi\'s 501 Original Denim Jeans',
    description: 'Classic straight-fit denim jeans with timeless style and premium denim construction.',
    price: 3999,
    category: 'Fashion',
    stock: 35,
    image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=500&q=80'
  },
  {
    name: 'Nike Air Max 270 Casual Sneakers',
    description: 'Stylish athletic shoes with Air Max cushioning technology. Perfect for sports and everyday wear.',
    price: 12999,
    category: 'Fashion',
    stock: 28,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&q=80'
  },
  {
    name: 'Puma Essential Logo Hoodie',
    description: 'Cozy cotton blend hoodie with Puma branding. Ideal for casual wear and light workouts.',
    price: 2999,
    category: 'Fashion',
    stock: 40,
    image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500&q=80'
  },
  {
    name: 'Michael Kors Leather Crossbody Handbag',
    description: 'Elegant leather handbag with adjustable strap and multiple compartments. Perfect for daily use.',
    price: 18999,
    category: 'Fashion',
    stock: 15,
    image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=500&q=80'
  },
  {
    name: 'Fossil Grant Chronograph Analog Watch',
    description: 'Classic chronograph watch with leather strap and sophisticated design for any occasion.',
    price: 8999,
    category: 'Fashion',
    stock: 20,
    image: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=500&q=80'
  },
  {
    name: 'Sterling Silver Jewelry Set',
    description: 'Beautiful sterling silver necklace and earrings set. Perfect gift for special occasions.',
    price: 5999,
    category: 'Fashion',
    stock: 25,
    image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=500&q=80'
  },
  {
    name: 'Tommy Hilfiger Formal Shirt',
    description: 'Premium quality formal shirt with classic fit and elegant design. Perfect for office wear.',
    price: 3499,
    category: 'Fashion',
    stock: 30,
    image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=500&q=80'
  },
  {
    name: 'Ray-Ban Classic Aviator Sunglasses',
    description: 'Iconic aviator sunglasses with UV protection and timeless style. Essential fashion accessory.',
    price: 12999,
    category: 'Fashion',
    stock: 22,
    image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=500&q=80'
  },
  {
    name: 'Zara Women\'s Winter Coat',
    description: 'Stylish winter coat with warm insulation and elegant design. Perfect for cold weather fashion.',
    price: 7999,
    category: 'Fashion',
    stock: 18,
    image: 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=500&q=80'
  },

  // Home (10 products)
  {
    name: 'Egyptian Cotton 400TC Bed Sheets',
    description: 'Luxurious bedding set made from premium Egyptian cotton with 400 thread count for ultimate comfort.',
    price: 4999,
    category: 'Home',
    stock: 25,
    image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=500&q=80'
  },
  {
    name: 'Ceramic Decorative Vases Set',
    description: 'Beautiful set of three ceramic vases in different sizes. Perfect for home decoration and flowers.',
    price: 2499,
    category: 'Home',
    stock: 30,
    image: 'https://images.unsplash.com/photo-1578500494198-246f612d3b3d?w=500&q=80'
  },
  {
    name: 'Corelle 18-Piece Dinnerware Set',
    description: 'Durable and elegant dinnerware set with plates and bowls. Chip-resistant and dishwasher safe.',
    price: 5999,
    category: 'Home',
    stock: 20,
    image: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=500&q=80'
  },
  {
    name: 'Yankee Candle Scented Candles Gift Set',
    description: 'Premium scented candles with variety of fragrances. Creates relaxing ambiance for your home.',
    price: 3999,
    category: 'Home',
    stock: 35,
    image: 'https://images.unsplash.com/photo-1602874801006-33c3c2e5c0a1?w=500&q=80'
  },
  {
    name: 'Porcelain Coffee Mug Set',
    description: 'Elegant set of 6 porcelain coffee mugs. Perfect for everyday use or special occasions.',
    price: 1999,
    category: 'Home',
    stock: 40,
    image: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=500&q=80'
  },
  {
    name: 'Blackout Thermal Window Curtains',
    description: 'Energy-efficient blackout curtains that block light and reduce noise. Perfect for bedrooms.',
    price: 3499,
    category: 'Home',
    stock: 28,
    image: 'https://images.unsplash.com/photo-1562663474-6cbb3eaa4d14?w=500&q=80'
  },
  {
    name: 'Modern Geometric Pattern Area Rug',
    description: 'Stylish area rug with contemporary geometric design. Adds warmth and style to any room.',
    price: 6999,
    category: 'Home',
    stock: 15,
    image: 'https://images.unsplash.com/photo-1600166898405-da9535204843?w=500&q=80'
  },
  {
    name: 'Velvet Throw Pillows with Covers',
    description: 'Luxurious set of 4 velvet throw pillows with cushion covers. Adds comfort and elegance to living spaces.',
    price: 2999,
    category: 'Home',
    stock: 32,
    image: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=500&q=80'
  },
  {
    name: 'Wooden Photo Frame Wall Decor Set',
    description: 'Set of wooden photo frames for creating beautiful gallery walls and displaying memories.',
    price: 1999,
    category: 'Home',
    stock: 38,
    image: 'https://images.unsplash.com/photo-1582139329536-e7284fece509?w=500&q=80'
  },
  {
    name: 'Woven Storage Baskets Set',
    description: 'Natural woven baskets for organization and storage. Functional and decorative home accessories.',
    price: 2499,
    category: 'Home',
    stock: 26,
    image: 'https://images.unsplash.com/photo-1617096200347-cb04ae810b1d?w=500&q=80'
  },

  // Books (10 products)
  {
    name: 'The Midnight Library - Bestselling Fiction Novel',
    description: 'A captivating novel about life choices and infinite possibilities. International bestseller by Matt Haig.',
    price: 499,
    category: 'Books',
    stock: 45,
    image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500&q=80'
  },
  {
    name: 'Atomic Habits - Self-Help Book',
    description: 'Transform your life with small changes that deliver remarkable results. Life-changing non-fiction by James Clear.',
    price: 599,
    category: 'Books',
    stock: 50,
    image: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=500&q=80'
  },
  {
    name: 'Pride and Prejudice - Classic Literature',
    description: 'Timeless romantic novel by Jane Austen. A must-read classic of English literature.',
    price: 399,
    category: 'Books',
    stock: 35,
    image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=500&q=80'
  },
  {
    name: 'The Joy of Cooking - Complete Recipe Book',
    description: 'Comprehensive cookbook with thousands of recipes for beginners and experienced cooks alike.',
    price: 899,
    category: 'Books',
    stock: 28,
    image: 'https://images.unsplash.com/photo-1466637574441-749b8f19452f?w=500&q=80'
  },
  {
    name: 'The Very Hungry Caterpillar - Children\'s Picture Book',
    description: 'Classic children\'s book by Eric Carle with beautiful illustrations and engaging story.',
    price: 299,
    category: 'Books',
    stock: 60,
    image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=500&q=80'
  },
  {
    name: 'Rich Dad Poor Dad - Business & Finance',
    description: 'Learn what the rich teach their kids about money. Essential personal finance book by Robert Kiyosaki.',
    price: 549,
    category: 'Books',
    stock: 42,
    image: 'https://images.unsplash.com/photo-1592496431122-2349e0fbc666?w=500&q=80'
  },
  {
    name: 'Six of Crows - Young Adult Fantasy Novel',
    description: 'Thrilling fantasy adventure perfect for young adult readers. Captivating story by Leigh Bardugo.',
    price: 649,
    category: 'Books',
    stock: 38,
    image: 'https://images.unsplash.com/photo-1621351183012-e2f9972dd9bf?w=500&q=80'
  },
  {
    name: 'Think and Grow Rich - Motivational Book',
    description: 'The legendary motivational bestseller with timeless principles for success and wealth by Napoleon Hill.',
    price: 499,
    category: 'Books',
    stock: 40,
    image: 'https://images.unsplash.com/photo-1553729459-efe14ef6055d?w=500&q=80'
  },
  {
    name: 'The Girl with the Dragon Tattoo - Crime Thriller',
    description: 'Gripping crime thriller and international bestselling mystery novel by Stieg Larsson.',
    price: 699,
    category: 'Books',
    stock: 32,
    image: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=500&q=80'
  },
  {
    name: 'Sapiens: A Brief History of Humankind - Science Book',
    description: 'Explore human history from Stone Age to modern times. Fascinating science book by Yuval Noah Harari.',
    price: 799,
    category: 'Books',
    stock: 36,
    image: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=500&q=80'
  },

  // Sports (10 products)
  {
    name: 'Premium NBR Yoga Mat 6mm',
    description: 'Non-slip yoga mat with excellent cushioning. Perfect for yoga, pilates, and floor exercises.',
    price: 1499,
    category: 'Sports',
    stock: 35,
    image: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=500&q=80'
  },
  {
    name: 'Optimum Nutrition Gold Standard Whey Protein',
    description: 'Premium whey protein powder for muscle recovery and growth. 24g protein per serving, 2lbs container.',
    price: 4999,
    category: 'Sports',
    stock: 40,
    image: 'https://images.unsplash.com/photo-1579722821273-0f6c7d44362f?w=500&q=80'
  },
  {
    name: 'Adjustable Dumbbells Set 20kg',
    description: 'Space-saving adjustable dumbbells perfect for home gym workouts and strength training.',
    price: 8999,
    category: 'Sports',
    stock: 20,
    image: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=500&q=80'
  },
  {
    name: 'Hydro Flask Insulated Sports Water Bottle',
    description: 'Keep drinks cold for 24 hours or hot for 12 hours. BPA-free stainless steel construction, 32oz capacity.',
    price: 2999,
    category: 'Sports',
    stock: 45,
    image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500&q=80'
  },
  {
    name: 'Nike Air Zoom Pegasus Running Shoes',
    description: 'Professional running shoes with Zoom Air cushioning technology. Perfect for road running and training.',
    price: 10999,
    category: 'Sports',
    stock: 25,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&q=80'
  },
  {
    name: 'Fitbit Charge 5 Advanced Fitness Tracker',
    description: 'Track your health and fitness with built-in GPS, heart rate monitoring, and stress management features.',
    price: 14999,
    category: 'Sports',
    stock: 30,
    image: 'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=500&q=80'
  },
  {
    name: 'Adjustable Speed Jumping Rope',
    description: 'Professional jump rope with adjustable length and ball bearings for smooth rotation and cardio workouts.',
    price: 799,
    category: 'Sports',
    stock: 50,
    image: 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?w=500&q=80'
  },
  {
    name: 'SS Professional English Willow Cricket Bat',
    description: 'Professional-grade cricket bat made from premium English willow for excellent performance.',
    price: 12999,
    category: 'Sports',
    stock: 15,
    image: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=500&q=80'
  },
  {
    name: 'Pro Workout Gloves with Wrist Support',
    description: 'Durable gym gloves with padded palms and wrist support. Perfect for weightlifting and fitness training.',
    price: 1299,
    category: 'Sports',
    stock: 38,
    image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=500&q=80'
  },
  {
    name: 'Resistance Bands Set with Handles',
    description: 'Versatile resistance bands set of 5 with handles for full-body workouts. Includes multiple resistance levels.',
    price: 1999,
    category: 'Sports',
    stock: 42,
    image: 'https://images.unsplash.com/photo-1598289431512-b97b0917affc?w=500&q=80'
  }
];

async function addNewProducts() {
  try {
    await sequelize.authenticate();
    console.log('Database connected\n');

    // First, delete existing products
    await Product.destroy({ where: {}, truncate: true });
    console.log('Existing products cleared\n');

    console.log(`Adding ${products.length} new products with matching images...\n`);

    for (const product of products) {
      await Product.create(product);
      console.log(`✓ Added: ${product.name}`);
    }

    console.log('\n=== Summary ===');
    console.log(`Total products added: ${products.length}\n`);

    // Count by category
    const categories = ['Electronics', 'Fashion', 'Home', 'Books', 'Sports'];
    for (const category of categories) {
      const count = await Product.count({ where: { category } });
      console.log(`${category}: ${count} products`);
    }

    const total = await Product.count();
    console.log(`\nTotal products in database: ${total}`);

    await sequelize.close();
    console.log('\n✅ Product database updated successfully!');
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

addNewProducts();