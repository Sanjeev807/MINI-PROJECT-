require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const { sequelize } = require('../config/database');
const Product = require('../models/Product');

async function fixImageIssues() {
  try {
    await sequelize.authenticate();
    console.log('Database connected\n');

    // Fix the Yankee Candles image (image 1 not loading)
    console.log('Fixing Yankee Candles image...');
    await Product.update(
      { images: ['https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=600&q=80'] },
      { where: { name: 'Yankee Candle Scented Candles Gift Set' } }
    );
    console.log('✓ Updated Yankee Candles with new image');

    // Fix Nike Air Max 270 (different from running shoes)
    console.log('Fixing Nike Air Max 270 Casual Sneakers image...');
    await Product.update(
      { images: ['https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600&q=80'] },
      { where: { name: 'Nike Air Max 270 Casual Sneakers' } }
    );
    console.log('✓ Updated Nike Air Max 270 with different image');

    // Update Nike Running Shoes to ensure it's different
    console.log('Updating Nike Air Zoom Pegasus Running Shoes image...');
    await Product.update(
      { images: ['https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=600&q=80'] },
      { where: { name: 'Nike Air Zoom Pegasus Running Shoes' } }
    );
    console.log('✓ Updated Nike Running Shoes with running-specific image');

    // Let's also add some backup images for other products that might have issues
    console.log('\nUpdating other potentially problematic images...');
    
    // Update candles with a better image
    await Product.update(
      { images: ['https://images.unsplash.com/photo-1544866503-7e33c7c9e83c?w=600&q=80'] },
      { where: { name: 'Yankee Candle Scented Candles Gift Set' } }
    );
    console.log('✓ Updated Yankee Candles with better candle image');

    console.log('\n=== Verification ===');
    
    // Check the updated products
    const yankeeCandleProduct = await Product.findOne({ 
      where: { name: 'Yankee Candle Scented Candles Gift Set' } 
    });
    console.log(`Yankee Candles image: ${yankeeCandleProduct.images[0]}`);

    const nikeRunningProduct = await Product.findOne({ 
      where: { name: 'Nike Air Zoom Pegasus Running Shoes' } 
    });
    console.log(`Nike Running Shoes image: ${nikeRunningProduct.images[0]}`);

    const nikeCasualProduct = await Product.findOne({ 
      where: { name: 'Nike Air Max 270 Casual Sneakers' } 
    });
    console.log(`Nike Casual Sneakers image: ${nikeCasualProduct.images[0]}`);

    await sequelize.close();
    console.log('\n✅ Image issues fixed successfully!');
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

fixImageIssues();