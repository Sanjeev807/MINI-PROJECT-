require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const { sequelize } = require('../config/database');
const Product = require('../models/Product');

// High-quality product images mapped to product names
const productImages = {
  // Electronics
  'Samsung 55" Smart LED TV': 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=600&q=80',
  'Dell XPS 15 Notebook Computer': 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&q=80',
  'iPhone 15 Pro Max Smartphone': 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=600&q=80',
  'Sony Wireless Noise-Cancelling Headphones': 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=600&q=80',
  'Apple Watch Series 9 Smartwatch': 'https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=600&q=80',
  'JBL Flip 6 Bluetooth Speaker': 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600&q=80',
  'Anker 20000mAh Portable Power Bank': 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=600&q=80',
  'Canon EOS R50 Mirrorless Digital Camera': 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&q=80',
  'TP-Link AC1750 Wi-Fi Router': 'https://images.unsplash.com/photo-1606904825846-647eb07f5be2?w=600&q=80',
  'Sony PlayStation 5 Gaming Console': 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=600&q=80',

  // Fashion
  'Adidas Originals Graphic Tee': 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80',
  'Levi\'s 501 Original Denim Jeans': 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=600&q=80',
  'Nike Air Max 270 Casual Sneakers': 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80',
  'Puma Essential Logo Hoodie': 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600&q=80',
  'Michael Kors Leather Crossbody Handbag': 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&q=80',
  'Fossil Grant Chronograph Analog Watch': 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=600&q=80',
  'Sterling Silver Jewelry Set': 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600&q=80',
  'Tommy Hilfiger Formal Shirt': 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=600&q=80',
  'Ray-Ban Classic Aviator Sunglasses': 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=600&q=80',
  'Zara Women\'s Winter Coat': 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=600&q=80',

  // Home
  'Egyptian Cotton 400TC Bed Sheets': 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&q=80',
  'Ceramic Decorative Vases Set': 'https://images.unsplash.com/photo-1578500494198-246f612d3b3d?w=600&q=80',
  'Corelle 18-Piece Dinnerware Set': 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=600&q=80',
  'Yankee Candle Scented Candles Gift Set': 'https://images.unsplash.com/photo-1602874801006-33c3c2e5c0a1?w=600&q=80',
  'Porcelain Coffee Mug Set': 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=600&q=80',
  'Blackout Thermal Window Curtains': 'https://images.unsplash.com/photo-1562663474-6cbb3eaa4d14?w=600&q=80',
  'Modern Geometric Pattern Area Rug': 'https://images.unsplash.com/photo-1600166898405-da9535204843?w=600&q=80',
  'Velvet Throw Pillows with Covers': 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=600&q=80',
  'Wooden Photo Frame Wall Decor Set': 'https://images.unsplash.com/photo-1582139329536-e7284fece509?w=600&q=80',
  'Woven Storage Baskets Set': 'https://images.unsplash.com/photo-1617096200347-cb04ae810b1d?w=600&q=80',

  // Books
  'The Midnight Library - Bestselling Fiction Novel': 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600&q=80',
  'Atomic Habits - Self-Help Book': 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=600&q=80',
  'Pride and Prejudice - Classic Literature': 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&q=80',
  'The Joy of Cooking - Complete Recipe Book': 'https://images.unsplash.com/photo-1466637574441-749b8f19452f?w=600&q=80',
  'The Very Hungry Caterpillar - Children\'s Picture Book': 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&q=80',
  'Rich Dad Poor Dad - Business & Finance': 'https://images.unsplash.com/photo-1592496431122-2349e0fbc666?w=600&q=80',
  'Six of Crows - Young Adult Fantasy Novel': 'https://images.unsplash.com/photo-1621351183012-e2f9972dd9bf?w=600&q=80',
  'Think and Grow Rich - Motivational Book': 'https://images.unsplash.com/photo-1553729459-efe14ef6055d?w=600&q=80',
  'The Girl with the Dragon Tattoo - Crime Thriller': 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=600&q=80',
  'Sapiens: A Brief History of Humankind - Science Book': 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=600&q=80',

  // Sports
  'Premium NBR Yoga Mat 6mm': 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=600&q=80',
  'Optimum Nutrition Gold Standard Whey Protein': 'https://images.unsplash.com/photo-1579722821273-0f6c7d44362f?w=600&q=80',
  'Adjustable Dumbbells Set 20kg': 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=600&q=80',
  'Hydro Flask Insulated Sports Water Bottle': 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600&q=80',
  'Nike Air Zoom Pegasus Running Shoes': 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80',
  'Fitbit Charge 5 Advanced Fitness Tracker': 'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=600&q=80',
  'Adjustable Speed Jumping Rope': 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?w=600&q=80',
  'SS Professional English Willow Cricket Bat': 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=600&q=80',
  'Pro Workout Gloves with Wrist Support': 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=600&q=80',
  'Resistance Bands Set with Handles': 'https://images.unsplash.com/photo-1598289431512-b97b0917affc?w=600&q=80'
};

async function updateProductImages() {
  try {
    await sequelize.authenticate();
    console.log('Database connected\n');

    console.log('Updating product images...\n');

    let updatedCount = 0;
    
    // Get all products first
    const allProducts = await Product.findAll();
    console.log(`Found ${allProducts.length} products in database\n`);
    
    for (const product of allProducts) {
      const imageUrl = productImages[product.name];
      if (imageUrl) {
        await Product.update(
          { images: [imageUrl] },
          { where: { id: product.id } }
        );
        console.log(`✓ Updated image for: ${product.name}`);
        updatedCount++;
      } else {
        console.log(`⚠ No image mapping found for: ${product.name}`);
      }
    }

    console.log(`\n=== Summary ===`);
    console.log(`Products with updated images: ${updatedCount}`);
    
    // Verify all products have images
    const productsWithoutImages = await Product.findAll({
      where: {
        images: []
      }
    });

    if (productsWithoutImages.length > 0) {
      console.log(`\n⚠ Products without images: ${productsWithoutImages.length}`);
      productsWithoutImages.forEach(product => {
        console.log(`  - ${product.name}`);
      });
    } else {
      console.log('\n✅ All products have images!');
    }

    await sequelize.close();
    console.log('\n✅ Image update completed successfully!');
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

updateProductImages();