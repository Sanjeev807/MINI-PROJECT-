import React, {createContext, useState, useContext, useEffect} from 'react';
import {storage} from '../utils/storage';
import {cartAPI} from '../services/api';

const CartContext = createContext();

export const CartProvider = ({children}) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    loadCartFromStorage();
    loadWishlistFromStorage();
  }, []);

  const loadCartFromStorage = async () => {
    try {
      const savedCart = await storage.getCartData();
      setCartItems(savedCart);
    } catch (error) {
      console.error('Error loading cart:', error);
    }
  };

  const loadWishlistFromStorage = async () => {
    try {
      const savedWishlist = await storage.getWishlistData();
      setWishlist(savedWishlist);
    } catch (error) {
      console.error('Error loading wishlist:', error);
    }
  };

  const addToCart = async product => {
    try {
      const existingItem = cartItems.find(item => item._id === product._id);

      let updatedCart;
      if (existingItem) {
        updatedCart = cartItems.map(item =>
          item._id === product._id
            ? {...item, quantity: item.quantity + 1}
            : item,
        );
      } else {
        updatedCart = [...cartItems, {...product, quantity: 1}];
      }

      setCartItems(updatedCart);
      await storage.saveCartData(updatedCart);

      // Sync with backend if user is logged in
      try {
        await cartAPI.addToCart({
          productId: product._id,
          quantity: 1,
        });
      } catch (error) {
        console.log('Backend sync failed, using local cart');
      }

      return {success: true, message: 'Added to cart'};
    } catch (error) {
      console.error('Error adding to cart:', error);
      return {success: false, message: 'Failed to add to cart'};
    }
  };

  const updateQuantity = async (productId, quantity) => {
    try {
      if (quantity <= 0) {
        return removeFromCart(productId);
      }

      const updatedCart = cartItems.map(item =>
        item._id === productId ? {...item, quantity} : item,
      );

      setCartItems(updatedCart);
      await storage.saveCartData(updatedCart);

      // Sync with backend
      try {
        await cartAPI.updateCartItem(productId, quantity);
      } catch (error) {
        console.log('Backend sync failed, using local cart');
      }

      return {success: true};
    } catch (error) {
      console.error('Error updating quantity:', error);
      return {success: false};
    }
  };

  const removeFromCart = async productId => {
    try {
      const updatedCart = cartItems.filter(item => item._id !== productId);
      setCartItems(updatedCart);
      await storage.saveCartData(updatedCart);

      // Sync with backend
      try {
        await cartAPI.removeFromCart(productId);
      } catch (error) {
        console.log('Backend sync failed, using local cart');
      }

      return {success: true, message: 'Removed from cart'};
    } catch (error) {
      console.error('Error removing from cart:', error);
      return {success: false, message: 'Failed to remove from cart'};
    }
  };

  const clearCart = async () => {
    try {
      setCartItems([]);
      await storage.removeCartData();

      // Sync with backend
      try {
        await cartAPI.clearCart();
      } catch (error) {
        console.log('Backend sync failed, using local cart');
      }

      return {success: true};
    } catch (error) {
      console.error('Error clearing cart:', error);
      return {success: false};
    }
  };

  const addToWishlist = async product => {
    try {
      const existingItem = wishlist.find(item => item._id === product._id);
      
      if (existingItem) {
        return {success: false, message: 'Already in wishlist'};
      }

      const updatedWishlist = [...wishlist, product];
      setWishlist(updatedWishlist);
      await storage.saveWishlistData(updatedWishlist);

      return {success: true, message: 'Added to wishlist'};
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      return {success: false, message: 'Failed to add to wishlist'};
    }
  };

  const removeFromWishlist = async productId => {
    try {
      const updatedWishlist = wishlist.filter(item => item._id !== productId);
      setWishlist(updatedWishlist);
      await storage.saveWishlistData(updatedWishlist);

      return {success: true, message: 'Removed from wishlist'};
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      return {success: false, message: 'Failed to remove from wishlist'};
    }
  };

  const isInWishlist = productId => {
    return wishlist.some(item => item._id === productId);
  };

  const getCartTotal = () => {
    return cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0,
    );
  };

  const getCartCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };

  const value = {
    cartItems,
    wishlist,
    loading,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    getCartTotal,
    getCartCount,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
