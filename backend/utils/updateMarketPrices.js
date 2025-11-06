require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const { sequelize } = require('../config/database');
const Product = require('../models/Product');

// Realistic market prices for products (in INR)
const marketPrices = {
  // Electronics - More realistic prices
  'Samsung 55" Smart LED TV': 45999,
  'Dell XPS 15 Notebook Computer': 89999,
  'iPhone 15 Pro Max Smartphone': 139999,
  'Sony Wireless Noise-Cancelling Headphones': 24999,
  'Apple Watch Series 9 Smartwatch': 39999,
  'JBL Flip 6 Bluetooth Speaker': 8999,
  'Anker 20000mAh Portable Power Bank': 2499,
  'Canon EOS R50 Mirrorless Digital Camera': 54999,
  'TP-Link AC1750 Wi-Fi Router': 3499,
  'Sony PlayStation 5 Gaming Console': 44999,

  // Fashion - Realistic Indian market prices
  'Adidas Originals Graphic Tee': 1299,
  'Levi\'s 501 Original Denim Jeans': 3499,
  'Nike Air Max 270 Casual Sneakers': 8999,
  'Puma Essential Logo Hoodie': 2499,
  'Michael Kors Leather Crossbody Handbag': 12999,
  'Fossil Grant Chronograph Analog Watch': 6999,
  'Sterling Silver Jewelry Set': 3999,
  'Tommy Hilfiger Formal Shirt': 2999,
  'Ray-Ban Classic Aviator Sunglasses': 8999,
  'Zara Women\'s Winter Coat': 5999,

  // Home - Affordable home products
  'Egyptian Cotton 400TC Bed Sheets': 2999,
  'Ceramic Decorative Vases Set': 1499,
  'Corelle 18-Piece Dinnerware Set': 3999,
  'Yankee Candle Scented Candles Gift Set': 2499,
  'Porcelain Coffee Mug Set': 999,
  'Blackout Thermal Window Curtains': 1999,
  'Modern Geometric Pattern Area Rug': 3999,
  'Velvet Throw Pillows with Covers': 1499,
  'Wooden Photo Frame Wall Decor Set': 899,
  'Woven Storage Baskets Set': 1299,

  // Books - Standard book prices in India
  'The Midnight Library - Bestselling Fiction Novel': 399,
  'Atomic Habits - Self-Help Book': 399,
  'Pride and Prejudice - Classic Literature': 199,
  'The Joy of Cooking - Complete Recipe Book': 599,
  'The Very Hungry Caterpillar - Children\'s Picture Book': 299,
  'Rich Dad Poor Dad - Business & Finance': 299,
  'Six of Crows - Young Adult Fantasy Novel': 449,
  'Think and Grow Rich - Motivational Book': 249,
  'The Girl with the Dragon Tattoo - Crime Thriller': 399,
  'Sapiens: A Brief History of Humankind - Science Book': 499,

  // Sports - Competitive sports equipment prices
  'Premium NBR Yoga Mat 6mm': 899,
  'Optimum Nutrition Gold Standard Whey Protein': 3999,
  'Adjustable Dumbbells Set 20kg': 5999,
  'Hydro Flask Insulated Sports Water Bottle': 1999,
  'Nike Air Zoom Pegasus Running Shoes': 7999,
  'Fitbit Charge 5 Advanced Fitness Tracker': 12999,
  'Adjustable Speed Jumping Rope': 499,
  'SS Professional English Willow Cricket Bat': 8999,
  'Pro Workout Gloves with Wrist Support': 799,
  'Resistance Bands Set with Handles': 999
};

async function updateMarketPrices() {
  try {
    await sequelize.authenticate();
    console.log('Database connected\n');

    console.log('Current prices vs Market prices comparison:\n');
    
    let updatedCount = 0;
    
    for (const [productName, newPrice] of Object.entries(marketPrices)) {
      const product = await Product.findOne({ where: { name: productName } });
      
      if (product) {
        const oldPrice = parseFloat(product.price);
        const savings = oldPrice - newPrice;
        const discountPercent = Math.round(((oldPrice - newPrice) / oldPrice) * 100);
        
        await Product.update(
          { price: newPrice },
          { where: { id: product.id } }
        );
        
        console.log(`✓ ${productName}`);
        console.log(`  Old: ₹${oldPrice.toLocaleString()} → New: ₹${newPrice.toLocaleString()}`);
        console.log(`  Savings: ₹${savings.toLocaleString()} (${discountPercent}% reduction)\n`);
        
        updatedCount++;
      } else {
        console.log(`⚠ Product not found: ${productName}`);
      }
    }

    console.log(`\n=== Summary ===`);
    console.log(`Products updated: ${updatedCount}`);
    
    // Show category-wise price ranges
    console.log('\n=== Price Ranges by Category ===');
    const categories = ['Electronics', 'Fashion', 'Home', 'Books', 'Sports'];
    
    for (const category of categories) {
      const products = await Product.findAll({ 
        where: { category },
        order: [['price', 'ASC']]
      });
      
      if (products.length > 0) {
        const minPrice = parseFloat(products[0].price);
        const maxPrice = parseFloat(products[products.length - 1].price);
        console.log(`${category}: ₹${minPrice.toLocaleString()} - ₹${maxPrice.toLocaleString()}`);
      }
    }

    await sequelize.close();
    console.log('\n✅ Market prices updated successfully!');
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

updateMarketPrices();