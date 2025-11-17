import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { orderAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const OrderDetailScreen = ({ route, navigation }) => {
  const { orderId } = route.params;
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();

  useEffect(() => {
    fetchOrder();
  }, []);

  const fetchOrder = async () => {
    try {
      const response = await orderAPI.getOrderById(orderId, token);
      setOrder(response.data);
    } catch (error) {
      console.error('Error fetching order:', error);
      Alert.alert('Error', 'Failed to load order details');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async () => {
    Alert.alert(
      'Cancel Order',
      'Are you sure you want to cancel this order?',
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Yes, Cancel',
          style: 'destructive',
          onPress: async () => {
            try {
              await orderAPI.cancelOrder(orderId, token);
              Alert.alert('Success', 'Order cancelled successfully');
              fetchOrder();
            } catch (error) {
              Alert.alert('Error', 'Failed to cancel order');
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2874f0" />
      </View>
    );
  }

  if (!order) return null;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Order Status</Text>
        <View style={styles.statusCard}>
          <Text style={styles.status}>{order.status.toUpperCase()}</Text>
          <Text style={styles.orderId}>Order #{order._id.slice(-8)}</Text>
          <Text style={styles.orderDate}>
            Placed on {new Date(order.orderDate).toLocaleDateString()}
          </Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Items ({order.items.length})</Text>
        {order.items.map((item) => (
          <View key={item._id} style={styles.itemCard}>
            <Text style={styles.itemName}>{item.name}</Text>
            <Text style={styles.itemDetails}>
              Qty: {item.quantity} × ₹{item.price.toLocaleString()}
            </Text>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Delivery Address</Text>
        <Text style={styles.addressText}>
          {order.shippingAddress.street}
        </Text>
        <Text style={styles.addressText}>
          {order.shippingAddress.city}, {order.shippingAddress.state}
        </Text>
        <Text style={styles.addressText}>
          {order.shippingAddress.zipCode}, {order.shippingAddress.country}
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Payment</Text>
        <View style={styles.paymentRow}>
          <Text>Method:</Text>
          <Text style={styles.paymentMethod}>{order.paymentMethod.toUpperCase()}</Text>
        </View>
        <View style={styles.paymentRow}>
          <Text style={styles.totalLabel}>Total Amount:</Text>
          <Text style={styles.totalAmount}>
            ₹{order.totalAmount.toLocaleString()}
          </Text>
        </View>
      </View>

      {['pending', 'confirmed'].includes(order.status) && (
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={handleCancelOrder}
        >
          <Text style={styles.cancelButtonText}>Cancel Order</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
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
  section: {
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#212121',
    marginBottom: 12,
  },
  statusCard: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  status: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2874f0',
    marginBottom: 8,
  },
  orderId: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  orderDate: {
    fontSize: 13,
    color: '#888',
  },
  itemCard: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  itemName: {
    fontSize: 15,
    color: '#212121',
    marginBottom: 4,
  },
  itemDetails: {
    fontSize: 13,
    color: '#666',
  },
  addressText: {
    fontSize: 14,
    color: '#212121',
    marginBottom: 4,
  },
  paymentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  paymentMethod: {
    fontWeight: '600',
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2874f0',
  },
  cancelButton: {
    backgroundColor: '#ff5722',
    margin: 16,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default OrderDetailScreen;
