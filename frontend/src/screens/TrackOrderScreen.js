import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const TrackOrderScreen = ({ navigation }) => {
  const [orderId, setOrderId] = useState('');
  const [email, setEmail] = useState('');

  const handleTrackOrder = () => {
    if (!orderId || !email) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    Alert.alert('Coming Soon', 'Order tracking feature is coming soon! We\'re working on it.');
  };

  const statusGuide = [
    { status: 'Order Placed', description: 'Your order has been received and is being processed' },
    { status: 'Processing', description: 'We\'re preparing your items for shipment' },
    { status: 'Shipped', description: 'Your order is on the way!' },
    { status: 'Out for Delivery', description: 'Your order will be delivered today' },
    { status: 'Delivered', description: 'Your order has been successfully delivered' },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Track Your Order</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.text}>
            Track your order status in real-time. Enter your order details below:
          </Text>

          <TextInput
            style={styles.input}
            placeholder="Order ID (e.g., ORD123456)"
            value={orderId}
            onChangeText={setOrderId}
            autoCapitalize="characters"
          />
          <TextInput
            style={styles.input}
            placeholder="Email Address"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <TouchableOpacity style={styles.submitButton} onPress={handleTrackOrder}>
            <Icon name="search" size={20} color="#FFF" />
            <Text style={styles.submitButtonText}>Track Order</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Status Guide</Text>
          {statusGuide.map((item, index) => (
            <View key={index} style={styles.statusItem}>
              <View style={styles.statusDot} />
              <View style={styles.statusContent}>
                <Text style={styles.statusTitle}>{item.status}</Text>
                <Text style={styles.statusDescription}>{item.description}</Text>
              </View>
            </View>
          ))}

          <View style={styles.infoBox}>
            <Icon name="help-outline" size={20} color="#6366f1" />
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.infoTitle}>Need Help?</Text>
              <Text style={styles.infoText}>
                Contact our support team at support@eshop.com or call +91 1800-123-4567
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#6366f1',
    paddingTop: 40,
    paddingBottom: 16,
    paddingHorizontal: 16,
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF',
  },
  content: {
    flex: 1,
  },
  section: {
    backgroundColor: '#FFF',
    margin: 16,
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#6366f1',
    marginBottom: 16,
  },
  text: {
    fontSize: 16,
    lineHeight: 24,
    color: '#555',
    marginBottom: 16,
  },
  input: {
    borderWidth: 2,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 16,
  },
  submitButton: {
    backgroundColor: '#6366f1',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 8,
    marginTop: 8,
  },
  submitButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  statusItem: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#6366f1',
    marginTop: 4,
  },
  statusContent: {
    flex: 1,
    marginLeft: 12,
  },
  statusTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212121',
    marginBottom: 4,
  },
  statusDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  infoBox: {
    backgroundColor: '#F0F0FF',
    padding: 16,
    borderRadius: 8,
    flexDirection: 'row',
    marginTop: 16,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212121',
    marginBottom: 4,
  },
  infoText: {
    fontSize: 14,
    color: '#555',
    lineHeight: 20,
  },
});

export default TrackOrderScreen;
