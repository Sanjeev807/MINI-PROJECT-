import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const PrivacyPolicyScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Privacy Policy</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.date}>Last updated: November 2, 2025</Text>
          <Text style={styles.text}>
            At E-Shop, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website.
          </Text>

          <Text style={styles.sectionTitle}>Information We Collect</Text>

          <Text style={styles.subTitle}>Personal Information</Text>
          <Text style={styles.text}>
            We may collect personal information that you provide to us such as:
          </Text>
          <Text style={styles.listItem}>• Name, email address, and contact information</Text>
          <Text style={styles.listItem}>• Billing and shipping addresses</Text>
          <Text style={styles.listItem}>• Payment information (securely processed)</Text>
          <Text style={styles.listItem}>• Order history and preferences</Text>

          <Text style={styles.subTitle}>Automatically Collected Information</Text>
          <Text style={styles.text}>
            When you visit our website, we may automatically collect:
          </Text>
          <Text style={styles.listItem}>• IP address and browser type</Text>
          <Text style={styles.listItem}>• Device information</Text>
          <Text style={styles.listItem}>• Pages visited and time spent</Text>
          <Text style={styles.listItem}>• Referring website addresses</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>How We Use Your Information</Text>
          <Text style={styles.text}>
            We use the information we collect to:
          </Text>
          <Text style={styles.listItem}>• Process and fulfill your orders</Text>
          <Text style={styles.listItem}>• Send order confirmations and updates</Text>
          <Text style={styles.listItem}>• Improve our website and services</Text>
          <Text style={styles.listItem}>• Send promotional emails (with your consent)</Text>
          <Text style={styles.listItem}>• Prevent fraud and enhance security</Text>
          <Text style={styles.listItem}>• Respond to customer service requests</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Data Security</Text>
          <Text style={styles.text}>
            We implement appropriate security measures to protect your personal information. However, no method of transmission over the Internet is 100% secure, and we cannot guarantee absolute security.
          </Text>

          <Text style={styles.subTitle}>Cookies</Text>
          <Text style={styles.text}>
            We use cookies to enhance your browsing experience. You can choose to disable cookies through your browser settings, but this may limit some features of our website.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Rights</Text>
          <Text style={styles.text}>You have the right to:</Text>
          <Text style={styles.listItem}>• Access your personal data</Text>
          <Text style={styles.listItem}>• Correct inaccurate information</Text>
          <Text style={styles.listItem}>• Request deletion of your data</Text>
          <Text style={styles.listItem}>• Opt-out of marketing communications</Text>
          <Text style={styles.listItem}>• Lodge a complaint with a supervisory authority</Text>

          <View style={styles.infoBox}>
            <Icon name="email" size={20} color="#6366f1" />
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.infoTitle}>Contact Us</Text>
              <Text style={styles.infoText}>
                For privacy-related questions, contact us at privacy@eshop.com
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
  date: {
    fontSize: 14,
    color: '#888',
    marginBottom: 12,
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

export default PrivacyPolicyScreen;
