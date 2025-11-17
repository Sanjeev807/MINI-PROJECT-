import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const ShippingPolicyScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Shipping Policy</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.text}>
            At E-Shop, we strive to deliver your orders quickly and efficiently. Here's everything you need to know about our shipping process.
          </Text>

          <Text style={styles.sectionTitle}>Shipping Methods</Text>

          <View style={styles.methodCard}>
            <Text style={styles.methodTitle}>Standard Shipping (Free on orders above ₹500)</Text>
            <Text style={styles.methodDetail}>• Delivery Time: 3-7 business days</Text>
            <Text style={styles.methodDetail}>• Available across India</Text>
            <Text style={styles.methodDetail}>• Track your order online</Text>
          </View>

          <View style={styles.methodCard}>
            <Text style={styles.methodTitle}>Express Shipping (₹99)</Text>
            <Text style={styles.methodDetail}>• Delivery Time: 1-3 business days</Text>
            <Text style={styles.methodDetail}>• Available in major cities</Text>
            <Text style={styles.methodDetail}>• Priority processing</Text>
          </View>

          <View style={styles.methodCard}>
            <Text style={styles.methodTitle}>Same-Day Delivery (₹199)</Text>
            <Text style={styles.methodDetail}>• Delivery Time: Same day (orders before 12 PM)</Text>
            <Text style={styles.methodDetail}>• Available in select metro cities</Text>
            <Text style={styles.methodDetail}>• Perfect for urgent needs</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Shipping Coverage</Text>
          <Text style={styles.text}>
            We deliver to all serviceable pin codes across India. Enter your pin code at checkout to check if delivery is available in your area.
          </Text>

          <Text style={styles.subTitle}>Processing Time</Text>
          <Text style={styles.text}>
            Orders are typically processed within 24-48 hours. You'll receive a confirmation email once your order ships with tracking information.
          </Text>

          <Text style={styles.subTitle}>International Shipping</Text>
          <Text style={styles.text}>
            Currently, we only ship within India. International shipping will be available soon!
          </Text>
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
    marginTop: 8,
    marginBottom: 16,
  },
  subTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#212121',
    marginTop: 16,
    marginBottom: 8,
  },
  text: {
    fontSize: 16,
    lineHeight: 24,
    color: '#555',
    marginBottom: 12,
  },
  methodCard: {
    backgroundColor: '#F0F0FF',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  methodTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212121',
    marginBottom: 8,
  },
  methodDetail: {
    fontSize: 15,
    color: '#555',
    lineHeight: 22,
    marginLeft: 8,
  },
});

export default ShippingPolicyScreen;
