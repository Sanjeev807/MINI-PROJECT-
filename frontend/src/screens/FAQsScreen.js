import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const FAQsScreen = ({ navigation }) => {
  const faqs = [
    {
      category: 'General Questions',
      questions: [
        {
          q: 'How do I create an account?',
          a: 'Click on the "Login" button in the top right corner and select "Register here". Fill in your details and you\'re ready to shop!',
        },
        {
          q: 'What payment methods do you accept?',
          a: 'We accept all major credit/debit cards, UPI, net banking, and Cash on Delivery (COD) for eligible orders.',
        },
        {
          q: 'How long does shipping take?',
          a: 'Standard shipping typically takes 3-7 business days. Express shipping is available for faster delivery.',
        },
      ],
    },
    {
      category: 'Shipping & Delivery',
      questions: [
        {
          q: 'Is free shipping available?',
          a: 'Yes! We offer free shipping on all orders above ₹500.',
        },
        {
          q: 'Can I track my order?',
          a: 'Absolutely! Once your order ships, you\'ll receive a tracking number via email and SMS.',
        },
      ],
    },
    {
      category: 'Returns & Refunds',
      questions: [
        {
          q: 'What is your return policy?',
          a: 'We offer a hassle-free 10-day return policy. Items must be unused and in original packaging.',
        },
        {
          q: 'How do I initiate a return?',
          a: 'Go to "My Orders", select the item you want to return, and click "Return Item". Our team will guide you through the process.',
        },
        {
          q: 'When will I get my refund?',
          a: 'Refunds are processed within 5-7 business days after we receive your returned item.',
        },
      ],
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>FAQs</Text>
      </View>

      <ScrollView style={styles.content}>
        {faqs.map((category, categoryIndex) => (
          <View key={categoryIndex} style={styles.section}>
            <Text style={styles.categoryTitle}>{category.category}</Text>
            {category.questions.map((faq, index) => (
              <View key={index} style={styles.faqItem}>
                <Text style={styles.question}>Q: {faq.q}</Text>
                <Text style={styles.answer}>{faq.a}</Text>
              </View>
            ))}
          </View>
        ))}
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
  categoryTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#6366f1',
    marginBottom: 16,
  },
  faqItem: {
    marginBottom: 20,
  },
  question: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212121',
    marginBottom: 8,
  },
  answer: {
    fontSize: 15,
    color: '#555',
    lineHeight: 22,
  },
});

export default FAQsScreen;
