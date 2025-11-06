require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const { sequelize } = require('../config/database');
const Product = require('../models/Product');

async function checkAndFixYankeeCandles() {
  try {
    await sequelize.authenticate();
    console.log('Database connected\n');

    // Check the current Yankee Candles product
    const yankeeProduct = await Product.findOne({ 
      where: { name: { [require('sequelize').Op.iLike]: '%yankee%candle%' } }
    });

    if (yankeeProduct) {
      console.log('Found Yankee Candles product:');
      console.log('Name:', yankeeProduct.name);
      console.log('Current images:', yankeeProduct.images);
      console.log('Images array length:', yankeeProduct.images.length);
      
      // Try different working image URLs for candles
      const newImageUrls = [
        'https://images.unsplash.com/photo-1602743008026-429e87c0bce5?w=600&q=80',
        'https://images.unsplash.com/photo-1540979388789-6cee28a1cdc9?w=600&q=80',
        'https://images.unsplash.com/photo-1608181705269-5b7c9b31e36b?w=600&q=80'
      ];

      console.log('\nTrying to update with new image URLs...');
      
      for (let i = 0; i < newImageUrls.length; i++) {
        await Product.update(
          { images: [newImageUrls[i]] },
          { where: { id: yankeeProduct.id } }
        );
        
        console.log(`✓ Updated with image ${i + 1}: ${newImageUrls[i]}`);
        
        // Verify the update
        const updated = await Product.findByPk(yankeeProduct.id);
        console.log(`  Current images after update: ${updated.images}`);
      }
    } else {
      console.log('No Yankee Candles product found. Let me search for all candle products:');
      
      const candleProducts = await Product.findAll({
        where: { name: { [require('sequelize').Op.iLike]: '%candle%' } }
      });
      
      console.log(`Found ${candleProducts.length} candle products:`);
      candleProducts.forEach(product => {
        console.log(`- ${product.name} (ID: ${product.id})`);
        console.log(`  Images: ${product.images}`);
      });
    }

    await sequelize.close();
    console.log('\n✅ Check completed!');
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

checkAndFixYankeeCandles();