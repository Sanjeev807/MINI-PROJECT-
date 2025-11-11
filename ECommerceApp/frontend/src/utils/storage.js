const STORAGE_KEYS = {
  AUTH_TOKEN: '@auth_token',
  USER_DATA: '@user_data',
  CART_DATA: '@cart_data',
  WISHLIST_DATA: '@wishlist_data',
};

export const storage = {
  // Auth Token
  async saveToken(token) {
    try {
      localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
    } catch (error) {
      console.error('Error saving token:', error);
    }
  },

  async getToken() {
    try {
      return localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
    } catch (error) {
      console.error('Error getting token:', error);
      return null;
    }
  },

  async removeToken() {
    try {
      localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    } catch (error) {
      console.error('Error removing token:', error);
    }
  },

  // User Data
  async saveUserData(userData) {
    try {
      localStorage.setItem(
        STORAGE_KEYS.USER_DATA,
        JSON.stringify(userData),
      );
    } catch (error) {
      console.error('Error saving user data:', error);
    }
  },

  async getUserData() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.USER_DATA);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error getting user data:', error);
      return null;
    }
  },

  async removeUserData() {
    try {
      localStorage.removeItem(STORAGE_KEYS.USER_DATA);
    } catch (error) {
      console.error('Error removing user data:', error);
    }
  },

  // Cart Data
  async saveCartData(cartData) {
    try {
      localStorage.setItem(
        STORAGE_KEYS.CART_DATA,
        JSON.stringify(cartData),
      );
    } catch (error) {
      console.error('Error saving cart data:', error);
    }
  },

  async getCartData() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CART_DATA);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error getting cart data:', error);
      return [];
    }
  },

  async removeCartData() {
    try {
      localStorage.removeItem(STORAGE_KEYS.CART_DATA);
    } catch (error) {
      console.error('Error removing cart data:', error);
    }
  },

  // Wishlist Data
  async saveWishlistData(wishlistData) {
    try {
      localStorage.setItem(
        STORAGE_KEYS.WISHLIST_DATA,
        JSON.stringify(wishlistData),
      );
    } catch (error) {
      console.error('Error saving wishlist data:', error);
    }
  },

  async getWishlistData() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.WISHLIST_DATA);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error getting wishlist data:', error);
      return [];
    }
  },

  async removeWishlistData() {
    try {
      localStorage.removeItem(STORAGE_KEYS.WISHLIST_DATA);
    } catch (error) {
      console.error('Error removing wishlist data:', error);
    }
  },

  // Clear all storage
  async clearAll() {
    try {
      localStorage.clear();
    } catch (error) {
      console.error('Error clearing storage:', error);
    }
  },
};
