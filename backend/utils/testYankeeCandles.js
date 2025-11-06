require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const { sequelize } = require('../config/database');
const Product = require('../models/Product');

async function testYankeeCandles() {
  try {
    await sequelize.authenticate();
    console.log('Database connected\n');

    // Get the Yankee Candles product
    const yankeeProduct = await Product.findOne({ 
      where: { name: { [require('sequelize').Op.iLike]: '%yankee%candle%' } }
    });

    if (yankeeProduct) {
      console.log('✅ Yankee Candles Product Found:');
      console.log('ID:', yankeeProduct.id);
      console.log('Name:', yankeeProduct.name);
      console.log('Price:', yankeeProduct.price);
      console.log('Category:', yankeeProduct.category);
      console.log('Stock:', yankeeProduct.stock);
      console.log('Images:', JSON.stringify(yankeeProduct.images, null, 2));
      
      // Test the image URL
      const imageUrl = yankeeProduct.images[0];
      console.log('\n🔗 Image URL:', imageUrl);
      
      // Let's try a simple, reliable image URL
      const newImageUrl = 'https://images.unsplash.com/photo-1602743008026-429e87c0bce5?w=400&h=400&fit=crop&auto=format';
      
      await Product.update(
        { images: [newImageUrl] },
        { where: { id: yankeeProduct.id } }
      );
      
      console.log('✅ Updated with simplified image URL:', newImageUrl);
      
    } else {
      console.log('❌ Yankee Candles product not found');
    }

    await sequelize.close();
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

testYankeeCandles();