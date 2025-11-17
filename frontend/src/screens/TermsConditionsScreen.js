import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const TermsConditionsScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Terms & Conditions</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.date}>Last updated: November 2, 2025</Text>
          <Text style={styles.text}>
            Please read these Terms and Conditions carefully before using E-Shop. By accessing or using our service, you agree to be bound by these terms.
          </Text>

          <Text style={styles.sectionTitle}>Use of Our Service</Text>

          <Text style={styles.subTitle}>Account Registration</Text>
          <Text style={styles.text}>
            To use certain features, you must register for an account. You agree to:
          </Text>
          <Text style={styles.listItem}>• Provide accurate and complete information</Text>
          <Text style={styles.listItem}>• Maintain the security of your password</Text>
          <Text style={styles.listItem}>• Accept responsibility for all activities under your account</Text>
          <Text style={styles.listItem}>• Notify us immediately of any unauthorized use</Text>

          <Text style={styles.subTitle}>User Conduct</Text>
          <Text style={styles.text}>You agree not to:</Text>
          <Text style={styles.listItem}>• Use the service for any illegal purpose</Text>
          <Text style={styles.listItem}>• Attempt to gain unauthorized access</Text>
          <Text style={styles.listItem}>• Interfere with the proper working of the service</Text>
          <Text style={styles.listItem}>• Upload malicious code or viruses</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Orders and Pricing</Text>

          <Text style={styles.subTitle}>Product Information</Text>
          <Text style={styles.text}>
            We strive to provide accurate product descriptions and pricing. However, we do not warrant that product descriptions or other content is accurate, complete, or error-free.
          </Text>

          <Text style={styles.subTitle}>Order Acceptance</Text>
          <Text style={styles.text}>
            We reserve the right to refuse or cancel any order for any reason, including:
          </Text>
          <Text style={styles.listItem}>• Product availability</Text>
          <Text style={styles.listItem}>• Errors in pricing or product information</Text>
          <Text style={styles.listItem}>• Suspected fraudulent activity</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Intellectual Property</Text>
          <Text style={styles.text}>
            All content on this website, including text, graphics, logos, and images, is the property of E-Shop and protected by intellectual property laws. You may not use, reproduce, or distribute any content without our written permission.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Limitation of Liability</Text>
          <Text style={styles.text}>
            E-Shop shall not be liable for any indirect, incidental, special, or consequential damages arising out of or in connection with your use of our service.
          </Text>

          <Text style={styles.subTitle}>Governing Law</Text>
          <Text style={styles.text}>
            These terms are governed by the laws of India. Any disputes shall be resolved in the courts of Mumbai, Maharashtra.
          </Text>

          <Text style={styles.subTitle}>Changes to Terms</Text>
          <Text style={styles.text}>
            We may update these terms at any time. Continued use of our website constitutes acceptance of modified terms.
          </Text>

          <View style={styles.infoBox}>
            <Icon name="gavel" size={20} color="#6366f1" />
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.infoTitle}>Contact</Text>
              <Text style={styles.infoText}>
                For questions about these terms, contact legal@eshop.com
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

export default TermsConditionsScreen;
