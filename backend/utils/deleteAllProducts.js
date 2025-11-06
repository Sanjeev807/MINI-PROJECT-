require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const { sequelize } = require('../config/database');
const Product = require('../models/Product');

async function deleteAllProducts() {
  try {
    await sequelize.authenticate();
    console.log('Database connected\n');

    // Get current count
    const countBefore = await Product.count();
    console.log(`Current products in database: ${countBefore}\n`);

    if (countBefore === 0) {
      console.log('No products to delete.');
      await sequelize.close();
      return;
    }

    // Delete all products
    const deleted = await Product.destroy({
      where: {},
      truncate: true
    });

    console.log(`✅ Successfully deleted all products!`);
    console.log(`Products removed: ${countBefore}\n`);

    // Verify deletion
    const countAfter = await Product.count();
    console.log(`Products remaining: ${countAfter}`);

    await sequelize.close();
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

deleteAllProducts();
