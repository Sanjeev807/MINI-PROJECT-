require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const { sequelize } = require('../config/database');
const Product = require('../models/Product');

const products = [
  // Electronics (10 products)
  {
    name: 'Samsung 55" 4K UHD Smart LED TV',
    description: 'Experience stunning picture quality with this Samsung 55-inch 4K UHD Smart TV. Features HDR support, built-in streaming apps, and voice control compatibility.',
    price: 54999,
    category: 'Electronics',
    stock: 15,
    image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=500&q=80'
  },
  {
    name: 'Dell XPS 15 Laptop',
    description: 'Powerful Dell XPS 15 laptop with Intel Core i7 processor, 16GB RAM, 512GB SSD. Perfect for work and entertainment with stunning InfinityEdge display.',
    price: 124999,
    category: 'Electronics',
    stock: 8,
    image: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=500&q=80'
  },
  {
    name: 'Apple iPhone 15 Pro Max',
    description: 'Latest Apple iPhone 15 Pro Max with 256GB storage, A17 Pro chip, titanium design, and advanced camera system with 5x optical zoom.',
    price: 159999,
    category: 'Electronics',
    stock: 20,
    image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500&q=80'
  },
  {
    name: 'Sony WH-1000XM5 Headphones',
    description: 'Premium wireless headphones with industry-leading noise cancellation, 30-hour battery life, and superior sound quality.',
    price: 29999,
    category: 'Electronics',
    stock: 25,
    image: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=500&q=80'
  },
  {
    name: 'Apple Watch Series 9',
    description: 'Advanced smartwatch with fitness tracking, heart rate monitoring, ECG, and seamless iPhone integration. Water resistant up to 50m.',
    price: 41999,
    category: 'Electronics',
    stock: 18,
    image: 'https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=500&q=80'
  },
  {
    name: 'JBL Flip 6 Speaker',
    description: 'Powerful portable speaker with rich JBL sound, 12 hours of playtime, and IP67 waterproof and dustproof rating.',
    price: 11999,
    category: 'Electronics',
    stock: 30,
    image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500&q=80'
  },
  {
    name: 'Anker PowerCore Power Bank',
    description: 'High-capacity 20000mAh power bank with fast charging technology. Charge your devices multiple times on the go.',
    price: 3499,
    category: 'Electronics',
    stock: 40,
    image: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=500&q=80'
  },
  {
    name: 'Canon EOS R50 Camera',
    description: 'Capture stunning photos and 4K video with this advanced mirrorless camera. Perfect for content creators and photography enthusiasts.',
    price: 64999,
    category: 'Electronics',
    stock: 12,
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=500&q=80'
  },
  {
    name: 'TP-Link WiFi Router',
    description: 'High-speed AC1750 dual-band WiFi router with excellent coverage and easy setup. Perfect for homes and small offices.',
    price: 4999,
    category: 'Electronics',
    stock: 22,
    image: 'https://images.unsplash.com/photo-1606904825846-647eb07f5be2?w=500&q=80'
  },
  {
    name: 'Sony PlayStation 5',
    description: 'Next-gen gaming console with ultra-fast SSD, ray tracing, and 4K gaming at 120fps. Includes DualSense wireless controller.',
    price: 49999,
    category: 'Electronics',
    stock: 10,
    image: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=500&q=80'
  },

  // Fashion (10 products)
  {
    name: 'Adidas Graphic T-Shirt',
    description: 'Comfortable cotton t-shirt with iconic Adidas graphics. Perfect for casual wear and sports activities.',
    price: 1499,
    category: 'Fashion',
    stock: 50,
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&q=80'
  },
  {
    name: 'Levi\'s 501 Jeans',
    description: 'Classic straight-fit denim jeans from Levi\'s. Timeless style and durable construction.',
    price: 3999,
    category: 'Fashion',
    stock: 35,
    image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=500&q=80'
  },
  {
    name: 'Nike Air Max 270 Sneakers',
    description: 'Stylish and comfortable sneakers with Air Max cushioning technology. Perfect for everyday wear.',
    price: 12999,
    category: 'Fashion',
    stock: 28,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&q=80'
  },
  {
    name: 'Puma Hoodie',
    description: 'Cozy hoodie with Puma branding. Made from soft cotton blend for all-day comfort.',
    price: 2999,
    category: 'Fashion',
    stock: 40,
    image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500&q=80'
  },
  {
    name: 'Michael Kors Handbag',
    description: 'Elegant leather crossbody handbag with adjustable strap and multiple compartments. Perfect for daily use.',
    price: 18999,
    category: 'Fashion',
    stock: 15,
    image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=500&q=80'
  },
  {
    name: 'Fossil Watch',
    description: 'Classic chronograph analog watch with leather strap. Sophisticated design for any occasion.',
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
    name: 'Tommy Hilfiger Shirt',
    description: 'Premium quality formal shirt with classic fit. Perfect for office and formal events.',
    price: 3499,
    category: 'Fashion',
    stock: 30,
    image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=500&q=80'
  },
  {
    name: 'Ray-Ban Sunglasses',
    description: 'Iconic aviator sunglasses with UV protection. Timeless style and superior eye protection.',
    price: 12999,
    category: 'Fashion',
    stock: 22,
    image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=500&q=80'
  },
  {
    name: 'Zara Winter Coat',
    description: 'Stylish winter coat with warm insulation. Perfect blend of fashion and functionality.',
    price: 7999,
    category: 'Fashion',
    stock: 18,
    image: 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=500&q=80'
  },

  // Home (10 products)
  {
    name: 'Egyptian Cotton Bed Sheets',
    description: 'Luxurious bed sheet set made from premium Egyptian cotton. 400 thread count, soft, breathable, and durable.',
    price: 4999,
    category: 'Home',
    stock: 25,
    image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=500&q=80'
  },
  {
    name: 'Ceramic Vase Set',
    description: 'Beautiful set of three ceramic decorative vases in different sizes. Perfect for home decoration.',
    price: 2499,
    category: 'Home',
    stock: 30,
    image: 'https://images.unsplash.com/photo-1578500494198-246f612d3b3d?w=500&q=80'
  },
  {
    name: 'Corelle Dinnerware Set',
    description: 'Durable and elegant 18-piece dinnerware set. Chip-resistant and dishwasher safe.',
    price: 5999,
    category: 'Home',
    stock: 20,
    image: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=500&q=80'
  },
  {
    name: 'Yankee Candles',
    description: 'Premium scented candles gift set with variety of fragrances. Creates a relaxing ambiance.',
    price: 3999,
    category: 'Home',
    stock: 35,
    image: 'https://images.unsplash.com/photo-1602874801006-33c3c2e5c0a1?w=500&q=80'
  },
  {
    name: 'Porcelain Coffee Mugs',
    description: 'Elegant porcelain coffee mug set of 6. Perfect for everyday use or special occasions.',
    price: 1999,
    category: 'Home',
    stock: 40,
    image: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=500&q=80'
  },
  {
    name: 'Blackout Curtains',
    description: 'Energy-efficient blackout thermal drapes that block light and reduce noise. Perfect for bedrooms.',
    price: 3499,
    category: 'Home',
    stock: 28,
    image: 'https://images.unsplash.com/photo-1562663474-6cbb3eaa4d14?w=500&q=80'
  },
  {
    name: 'Geometric Area Rug',
    description: 'Stylish area rug with modern geometric pattern. Adds warmth and style to any room.',
    price: 6999,
    category: 'Home',
    stock: 15,
    image: 'https://images.unsplash.com/photo-1600166898405-da9535204843?w=500&q=80'
  },
  {
    name: 'Velvet Throw Pillows',
    description: 'Luxurious velvet throw pillows with cushion covers set of 4. Adds comfort and elegance to your living space.',
    price: 2999,
    category: 'Home',
    stock: 32,
    image: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=500&q=80'
  },
  {
    name: 'Wooden Photo Frames',
    description: 'Set of wooden photo frames for wall decor. Create a beautiful gallery wall display.',
    price: 1999,
    category: 'Home',
    stock: 38,
    image: 'https://images.unsplash.com/photo-1582139329536-e7284fece509?w=500&q=80'
  },
  {
    name: 'Woven Storage Baskets',
    description: 'Natural woven baskets organizational set for organizing and storage. Functional and decorative.',
    price: 2499,
    category: 'Home',
    stock: 26,
    image: 'https://images.unsplash.com/photo-1617096200347-cb04ae810b1d?w=500&q=80'
  },

  // Books (10 products)
  {
    name: 'The Midnight Library',
    description: 'A dazzling fiction bestseller about all the choices that go into a life well lived. International bestseller by Matt Haig.',
    price: 499,
    category: 'Books',
    stock: 45,
    image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500&q=80'
  },
  {
    name: 'Atomic Habits',
    description: 'Transform your life with tiny changes that deliver remarkable results. Self-help book by James Clear.',
    price: 599,
    category: 'Books',
    stock: 50,
    image: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=500&q=80'
  },
  {
    name: 'Pride and Prejudice',
    description: 'Timeless classic literature by Jane Austen. A romantic novel of manners set in Georgian England.',
    price: 399,
    category: 'Books',
    stock: 35,
    image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=500&q=80'
  },
  {
    name: 'The Joy of Cooking',
    description: 'Comprehensive cookbook with thousands of recipes. Perfect for beginners and experienced cooks.',
    price: 899,
    category: 'Books',
    stock: 28,
    image: 'https://images.unsplash.com/photo-1466637574441-749b8f19452f?w=500&q=80'
  },
  {
    name: 'The Very Hungry Caterpillar',
    description: 'Classic children\'s picture book by Eric Carle. Beautiful illustrations and engaging story.',
    price: 299,
    category: 'Books',
    stock: 60,
    image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=500&q=80'
  },
  {
    name: 'Rich Dad Poor Dad',
    description: 'What the rich teach their kids about money. Business & finance classic by Robert Kiyosaki.',
    price: 549,
    category: 'Books',
    stock: 42,
    image: 'https://images.unsplash.com/photo-1592496431122-2349e0fbc666?w=500&q=80'
  },
  {
    name: 'Six of Crows',
    description: 'Thrilling YA fantasy novel by Leigh Bardugo. Perfect for young adult readers.',
    price: 649,
    category: 'Books',
    stock: 38,
    image: 'https://images.unsplash.com/photo-1621351183012-e2f9972dd9bf?w=500&q=80'
  },
  {
    name: 'Think and Grow Rich',
    description: 'The legendary motivational bestseller by Napoleon Hill. Timeless principles for success and wealth.',
    price: 499,
    category: 'Books',
    stock: 40,
    image: 'https://images.unsplash.com/photo-1553729459-efe14ef6055d?w=500&q=80'
  },
  {
    name: 'The Girl with the Dragon Tattoo',
    description: 'Gripping crime thriller by Stieg Larsson. International bestselling mystery novel.',
    price: 699,
    category: 'Books',
    stock: 32,
    image: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=500&q=80'
  },
  {
    name: 'Sapiens',
    description: 'Explore the history of humankind from the Stone Age to modern times. Science book by Yuval Noah Harari.',
    price: 799,
    category: 'Books',
    stock: 36,
    image: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=500&q=80'
  },

  // Sports (10 products)
  {
    name: 'Premium Yoga Mat',
    description: 'Non-slip NBR yoga mat 6mm with excellent cushioning. Perfect for yoga, pilates, and floor exercises.',
    price: 1499,
    category: 'Sports',
    stock: 35,
    image: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=500&q=80'
  },
  {
    name: 'Whey Protein',
    description: 'Optimum Nutrition Gold Standard whey protein powder 2lbs for muscle recovery and growth. 24g protein per serving.',
    price: 4999,
    category: 'Sports',
    stock: 40,
    image: 'https://images.unsplash.com/photo-1579722821273-0f6c7d44362f?w=500&q=80'
  },
  {
    name: 'Adjustable Dumbbells',
    description: 'Space-saving adjustable dumbbells set 20kg. Perfect for home gym workouts.',
    price: 8999,
    category: 'Sports',
    stock: 20,
    image: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=500&q=80'
  },
  {
    name: 'Hydro Flask Water Bottle',
    description: 'Insulated sports water bottle 32oz. Keep drinks cold for 24 hours or hot for 12 hours. BPA-free stainless steel.',
    price: 2999,
    category: 'Sports',
    stock: 45,
    image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500&q=80'
  },
  {
    name: 'Nike Running Shoes',
    description: 'Nike Air Zoom Pegasus running shoes with Zoom Air cushioning. Perfect for road running.',
    price: 10999,
    category: 'Sports',
    stock: 25,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&q=80'
  },
  {
    name: 'Fitbit Charge 5',
    description: 'Advanced fitness tracker with built-in GPS, heart rate monitoring, and stress management.',
    price: 14999,
    category: 'Sports',
    stock: 30,
    image: 'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=500&q=80'
  },
  {
    name: 'Jump Rope',
    description: 'Adjustable speed jump rope with ball bearings for smooth rotation. Professional quality.',
    price: 799,
    category: 'Sports',
    stock: 50,
    image: 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?w=500&q=80'
  },
  {
    name: 'Cricket Bat',
    description: 'SS Professional English Willow cricket bat. Professional-grade bat with excellent performance.',
    price: 12999,
    category: 'Sports',
    stock: 15,
    image: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=500&q=80'
  },
  {
    name: 'Gym Gloves',
    description: 'Pro workout gloves with wrist support. Durable padded palms perfect for weightlifting.',
    price: 1299,
    category: 'Sports',
    stock: 38,
    image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=500&q=80'
  },
  {
    name: 'Resistance Bands',
    description: 'Versatile resistance bands set of 5 with handles for full-body workouts. Includes 5 resistance levels.',
    price: 1999,
    category: 'Sports',
    stock: 42,
    image: 'https://images.unsplash.com/photo-1598289431512-b97b0917affc?w=500&q=80'
  }
];

async function addProducts() {
  try {
    await sequelize.authenticate();
    console.log('Database connected\n');

    console.log(`Adding ${products.length} products with product-specific images...\n`);

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
    console.log('\n✅ Database seeding completed successfully!');
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

addProducts();