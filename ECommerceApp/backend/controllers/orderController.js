const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const User = require('../models/User');
const { sendNotificationToUser } = require('../services/notificationService');
const fcmService = require('../services/fcmService');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
exports.createOrder = async (req, res) => {
  try {
    const { items, shippingAddress, paymentMethod } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'No order items' });
    }

    // Calculate total and verify stock
    let totalAmount = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await Product.findById(item.product);
      
      if (!product) {
        return res.status(404).json({ message: `Product not found: ${item.product}` });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({ 
          message: `Insufficient stock for ${product.name}` 
        });
      }

      orderItems.push({
        product: product._id,
        name: product.name,
        quantity: item.quantity,
        price: product.price
      });

      totalAmount += product.price * item.quantity;

      // Update stock
      product.stock -= item.quantity;
      await product.save();
    }

    const order = await Order.create({
      user: req.user._id,
      items: orderItems,
      shippingAddress,
      paymentMethod,
      totalAmount,
      paymentStatus: paymentMethod === 'cod' ? 'pending' : 'completed'
    });

    // Clear cart after order
    await Cart.findOneAndUpdate(
      { user: req.user._id },
      { items: [] }
    );

    // Send push notification
    await sendNotificationToUser(
      req.user._id,
      '🟢 Order Placed Successfully!',
      `Your order #${order._id.toString().slice(-6)} of ₹${totalAmount.toFixed(2)} has been placed and will be delivered soon.`,
      { type: 'order_placed', orderId: order._id.toString(), amount: totalAmount },
      'order_placed'
    );

    // Send FCM push notification
    const user = await User.findById(req.user._id);
    if (user && user.fcmToken) {
      try {
        // Order confirmation notification
        await fcmService.sendNotification(
          user.fcmToken,
          'Order Placed Successfully',
          `Your order #${order._id.toString().slice(-6)} has been placed. Total: ₹${totalAmount.toFixed(2)}`,
          { 
            type: 'order_placed', 
            orderId: order._id.toString(),
            amount: totalAmount.toString()
          }
        );

        // Send promotional notification for ordered products after a short delay
        setTimeout(async () => {
          try {
            // Get product names from the order
            const productNames = orderItems.map(item => item.name).join(', ');
            const firstProduct = orderItems[0].name;
            
            // Random promotional messages for ordered products
            const promoMessages = [
              {
                title: '🎉 Special Offer on Your Recent Purchase!',
                body: `Get 20% OFF on ${firstProduct} and similar products! Limited time offer.`
              },
              {
                title: '🔥 Exclusive Deal for You!',
                body: `Love ${firstProduct}? Get 20% discount on your next purchase of similar items!`
              },
              {
                title: '💰 Save More on Related Products!',
                body: `Since you bought ${firstProduct}, enjoy 20% OFF on related products. Shop now!`
              },
              {
                title: '⚡ Flash Sale Alert!',
                body: `20% OFF on products similar to ${firstProduct}. Don't miss out!`
              },
              {
                title: '🎁 Thank You Offer!',
                body: `As a thank you for your purchase, get 20% OFF on ${firstProduct} category items!`
              }
            ];

            const randomPromo = promoMessages[Math.floor(Math.random() * promoMessages.length)];

            await fcmService.sendNotification(
              user.fcmToken,
              randomPromo.title,
              randomPromo.body,
              { 
                type: 'product_promotion',
                products: orderItems.map(item => item.product.toString()),
                discount: '20'
              }
            );

            // Also send to notification database
            await sendNotificationToUser(
              req.user._id,
              randomPromo.title,
              randomPromo.body,
              { 
                type: 'product_promotion',
                products: orderItems.map(item => item.product.toString()),
                discount: '20'
              },
              'product_promotion'
            );
          } catch (promoError) {
            // Silent fail for promotional notification errors
          }
        }, 3000); // 3 second delay after order placement

      } catch (fcmError) {
        // Silent fail for FCM errors
      }
    }

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user orders
// @route   GET /api/orders
// @access  Private
exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate('items.product')
      .sort({ orderDate: -1 });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('items.product');

    if (order && order.user.toString() === req.user._id.toString()) {
      res.json(order);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);

    if (order) {
      order.status = status;
      
      if (status === 'delivered') {
        order.deliveryDate = Date.now();
      }

      const updatedOrder = await order.save();

      // Send push notification about status update
      const statusMessages = {
        confirmed: {
          title: '✅ Order Confirmed',
          body: `Your order #${order._id.toString().slice(-6)} has been confirmed and is being prepared.`,
          type: 'order_confirmed'
        },
        processing: {
          title: '🔄 Order Processing',
          body: `Your order #${order._id.toString().slice(-6)} is being processed.`,
          type: 'order_processing'
        },
        shipped: {
          title: '🟡 Order Shipped!',
          body: `Great news! Your order #${order._id.toString().slice(-6)} has been shipped and is on its way.`,
          type: 'order_shipped'
        },
        delivered: {
          title: '🟢 Order Delivered!',
          body: `Your order #${order._id.toString().slice(-6)} has been delivered successfully. Thank you for shopping with E-Shop!`,
          type: 'order_delivered'
        },
        cancelled: {
          title: '🔴 Order Cancelled',
          body: `Your order #${order._id.toString().slice(-6)} has been cancelled. Amount will be refunded within 3-5 business days.`,
          type: 'order_cancelled'
        }
      };

      const notification = statusMessages[status] || {
        title: 'Order Status Updated',
        body: `Order #${order._id.toString().slice(-6)} status: ${status}`,
        type: 'order_update'
      };

      await sendNotificationToUser(
        order.user,
        notification.title,
        notification.body,
        { type: notification.type, orderId: order._id.toString(), status },
        notification.type
      );

      // Send FCM push notification
      const user = await User.findById(order.user);
      if (user && user.fcmToken) {
        try {
          await fcmService.sendNotification(
            user.fcmToken,
            notification.title.replace(/[🟢🟡🔴✅🔄]/g, '').trim(),
            notification.body.replace(/[🟢🟡🔴✅🔄]/g, '').trim(),
            { 
              type: notification.type,
              orderId: order._id.toString(),
              status
            }
          );
        } catch (fcmError) {
          // Silent fail for FCM errors
        }
      }

      res.json(updatedOrder);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Cancel order
// @route   PUT /api/orders/:id/cancel
// @access  Private
exports.cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    if (['shipped', 'delivered'].includes(order.status)) {
      return res.status(400).json({ 
        message: 'Cannot cancel order that has been shipped or delivered' 
      });
    }

    order.status = 'cancelled';
    await order.save();

    // Restore stock
    for (const item of order.items) {
      await Product.findByIdAndUpdate(
        item.product,
        { $inc: { stock: item.quantity } }
      );
    }

    // Send cancellation notification
    await sendNotificationToUser(
      req.user._id,
      '🔴 Order Cancelled',
      `Your order #${order._id.toString().slice(-6)} has been cancelled successfully. Amount will be refunded within 3-5 business days.`,
      { type: 'order_cancelled', orderId: order._id.toString() },
      'order_cancelled'
    );

    res.json({ message: 'Order cancelled successfully', order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
