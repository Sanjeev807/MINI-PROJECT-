import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const ReturnPolicyScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Return Policy</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.text}>
            We want you to be completely satisfied with your purchase. If you're not happy with your order, we're here to help!
          </Text>

          <Text style={styles.sectionTitle}>10-Day Return Policy</Text>
          <Text style={styles.text}>
            You have 10 days from the date of delivery to return most items. The item must be unused and in the same condition that you received it, in original packaging.
          </Text>

          <Text style={styles.subTitle}>Items Eligible for Return:</Text>
          <Text style={styles.listItem}>• Defective or damaged items</Text>
          <Text style={styles.listItem}>• Items that don't match the description</Text>
          <Text style={styles.listItem}>• Wrong items delivered</Text>
          <Text style={styles.listItem}>• Unwanted items (in original condition)</Text>

          <Text style={styles.subTitle}>Non-Returnable Items:</Text>
          <Text style={styles.listItem}>• Personal care and hygiene products</Text>
          <Text style={styles.listItem}>• Intimate apparel and swimwear</Text>
          <Text style={styles.listItem}>• Perishable goods</Text>
          <Text style={styles.listItem}>• Custom or personalized items</Text>
          <Text style={styles.listItem}>• Gift cards</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>How to Return an Item</Text>
          <View style={styles.stepCard}>
            <Text style={styles.stepTitle}>Step 1:</Text>
            <Text style={styles.stepText}>Log in to your account and go to "My Orders"</Text>
          </View>
          <View style={styles.stepCard}>
            <Text style={styles.stepTitle}>Step 2:</Text>
            <Text style={styles.stepText}>Select the order containing the item you want to return</Text>
          </View>
          <View style={styles.stepCard}>
            <Text style={styles.stepTitle}>Step 3:</Text>
            <Text style={styles.stepText}>Click "Return Item" and select the reason</Text>
          </View>
          <View style={styles.stepCard}>
            <Text style={styles.stepTitle}>Step 4:</Text>
            <Text style={styles.stepText}>Schedule a pickup or drop off at nearest collection point</Text>
          </View>
          <View style={styles.stepCard}>
            <Text style={styles.stepTitle}>Step 5:</Text>
            <Text style={styles.stepText}>Once we receive and inspect the item, we'll process your refund</Text>
          </View>

          <Text style={styles.subTitle}>Refund Processing</Text>
          <Text style={styles.text}>
            Refunds will be credited to your original payment method within 5-7 business days after we receive the returned item. You'll receive an email confirmation once the refund is processed.
          </Text>

          <View style={styles.infoBox}>
            <Icon name="help-outline" size={20} color="#6366f1" />
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.infoTitle}>Need Help?</Text>
              <Text style={styles.infoText}>
                If you have questions about returns, please contact our customer service team at support@eshop.com or call +91 1800-123-4567.
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
  listItem: {
    fontSize: 15,
    color: '#555',
    lineHeight: 24,
    marginLeft: 8,
  },
  stepCard: {
    backgroundColor: '#F0F0FF',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212121',
    marginBottom: 4,
  },
  stepText: {
    fontSize: 15,
    color: '#555',
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

export default ReturnPolicyScreen;
