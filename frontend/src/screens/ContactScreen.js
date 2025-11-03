import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Linking,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const ContactScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = () => {
    if (!name || !email || !subject || !message) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    Alert.alert('Success', 'Thank you! Your message has been sent successfully. We\'ll get back to you soon!');
    setName('');
    setEmail('');
    setSubject('');
    setMessage('');
  };

  const handleCall = () => {
    Linking.openURL('tel:+918001234567');
  };

  const handleEmail = () => {
    Linking.openURL('mailto:support@eshop.com');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Contact Us</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.text}>
            We'd love to hear from you! Get in touch with us for any questions, concerns, or feedback.
          </Text>

          <Text style={styles.sectionTitle}>Send us a Message</Text>
          <TextInput
            style={styles.input}
            placeholder="Your Name"
            value={name}
            onChangeText={setName}
          />
          <TextInput
            style={styles.input}
            placeholder="Your Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <TextInput
            style={styles.input}
            placeholder="Subject"
            value={subject}
            onChangeText={setSubject}
          />
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Your Message"
            value={message}
            onChangeText={setMessage}
            multiline
            numberOfLines={6}
            textAlignVertical="top"
          />
          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Icon name="send" size={20} color="#FFF" />
            <Text style={styles.submitButtonText}>Send Message</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact Information</Text>
          <View style={styles.infoBox}>
            <View style={styles.infoRow}>
              <Icon name="location-on" size={20} color="#6366f1" />
              <Text style={styles.infoText}>123 Shopping Street, Mumbai, Maharashtra 400001</Text>
            </View>
            <TouchableOpacity style={styles.infoRow} onPress={handleCall}>
              <Icon name="phone" size={20} color="#6366f1" />
              <Text style={[styles.infoText, styles.link]}>+91 1800-123-4567</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.infoRow} onPress={handleEmail}>
              <Icon name="email" size={20} color="#6366f1" />
              <Text style={[styles.infoText, styles.link]}>support@eshop.com</Text>
            </TouchableOpacity>
            <View style={styles.infoRow}>
              <Icon name="access-time" size={20} color="#6366f1" />
              <Text style={styles.infoText}>Mon-Sat: 9AM - 6PM</Text>
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
    marginTop: 16,
    marginBottom: 16,
  },
  text: {
    fontSize: 16,
    lineHeight: 24,
    color: '#555',
    marginBottom: 12,
  },
  input: {
    borderWidth: 2,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 16,
  },
  textArea: {
    minHeight: 120,
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
  infoBox: {
    backgroundColor: '#F0F0FF',
    padding: 16,
    borderRadius: 8,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  infoText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 12,
    flex: 1,
  },
  link: {
    color: '#6366f1',
    textDecorationLine: 'underline',
  },
});

export default ContactScreen;
