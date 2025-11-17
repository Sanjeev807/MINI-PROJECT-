import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { productAPI } from '../services/api';
import { useCart } from '../context/CartContext';

const ProductDetailScreen = ({ route, navigation }) => {
  const { productId } = route.params;
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const { addToCart } = useCart();

  useEffect(() => {
    fetchProduct();
  }, [productId]);

  const fetchProduct = async () => {
    try {
      const response = await productAPI.getProductById(productId);
      setProduct(response.data);
    } catch (error) {
      console.error('Error fetching product:', error);
      Alert.alert('Error', 'Failed to load product details');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (product.stock > 0) {
      addToCart(product, 1);
      Alert.alert('Added to Cart', `${product.name} has been added to your cart!`);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2874f0" />
      </View>
    );
  }

  if (!product) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Product not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.imageSection}>
          <Image
            source={{ uri: product.images[selectedImage] }}
            style={styles.mainImage}
          />
          {product.discount > 0 && (
            <View style={styles.discountBadge}>
              <Text style={styles.discountText}>{product.discount}% OFF</Text>
            </View>
          )}
        </View>

        <View style={styles.contentSection}>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{product.category}</Text>
          </View>

          <Text style={styles.productName}>{product.name}</Text>

          <View style={styles.ratingContainer}>
            <View style={styles.ratingBadge}>
              <Icon name="star" size={16} color="#fff" />
              <Text style={styles.ratingText}>{product.rating}</Text>
            </View>
            <Text style={styles.reviewsText}>
              {product.reviews.toLocaleString()} Reviews
            </Text>
          </View>

          <View style={styles.priceContainer}>
            <Text style={styles.currentPrice}>
              ₹{product.price.toLocaleString()}
            </Text>
            {product.originalPrice && (
              <>
                <Text style={styles.originalPrice}>
                  ₹{product.originalPrice.toLocaleString()}
                </Text>
                <Text style={styles.discountPercent}>
                  {product.discount}% off
                </Text>
              </>
            )}
          </View>

          <View style={styles.stockContainer}>
            <Icon
              name={product.stock > 0 ? 'check-circle' : 'cancel'}
              size={20}
              color={product.stock > 0 ? '#388e3c' : '#ff5722'}
            />
            <Text
              style={[
                styles.stockText,
                { color: product.stock > 0 ? '#388e3c' : '#ff5722' },
              ]}
            >
              {product.stock > 0
                ? `In Stock (${product.stock} available)`
                : 'Out of Stock'}
            </Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Product Description</Text>
            <Text style={styles.description}>{product.description}</Text>
          </View>

          {product.specifications && (
            <>
              <View style={styles.divider} />
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Specifications</Text>
                {Object.entries(product.specifications).map(([key, value]) => (
                  <View key={key} style={styles.specRow}>
                    <Text style={styles.specKey}>{key}:</Text>
                    <Text style={styles.specValue}>{value}</Text>
                  </View>
                ))}
              </View>
            </>
          )}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.cartButton} onPress={handleAddToCart}disabled={product.stock === 0}>
          <Icon name="shopping-cart" size={24} color="#fff" />
          <Text style={styles.cartButtonText}>
            {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1f3f6',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#666',
  },
  imageSection: {
    backgroundColor: '#fff',
    padding: 16,
    alignItems: 'center',
  },
  mainImage: {
    width: '100%',
    height: 300,
    resizeMode: 'contain',
  },
  discountBadge: {
    position: 'absolute',
    top: 16,
    left: 16,
    backgroundColor: '#ff5722',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
  },
  discountText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  contentSection: {
    backgroundColor: '#fff',
    marginTop: 8,
    padding: 16,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#e3f2fd',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
    marginBottom: 12,
  },
  categoryText: {
    color: '#2874f0',
    fontSize: 12,
    fontWeight: '600',
  },
  productName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#212121',
    marginBottom: 12,
    lineHeight: 28,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#388e3c',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginRight: 8,
  },
  ratingText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  reviewsText: {
    fontSize: 14,
    color: '#666',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },
  currentPrice: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#212121',
  },
  originalPrice: {
    fontSize: 18,
    color: '#888',
    textDecorationLine: 'line-through',
  },
  discountPercent: {
    fontSize: 16,
    color: '#388e3c',
    fontWeight: 'bold',
  },
  stockContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  stockText: {
    fontSize: 14,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: 16,
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#212121',
    marginBottom: 12,
  },
  description: {
    fontSize: 15,
    color: '#666',
    lineHeight: 24,
  },
  specRow: {
    flexDirection: 'row',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  specKey: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
    width: 120,
  },
  specValue: {
    flex: 1,
    fontSize: 14,
    color: '#212121',
  },
  footer: {
    backgroundColor: '#fff',
    padding: 16,
    elevation: 8,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  cartButton: {
    flexDirection: 'row',
    backgroundColor: '#ff9f00',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
    borderRadius: 8,
    gap: 12,
  },
  cartButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default ProductDetailScreen;
