import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useAuth } from '../context/AuthContext';

const ProfileScreen = ({ navigation }) => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: logout,
      },
    ]);
  };

  const MenuItem = ({ icon, title, onPress, color = '#212121' }) => (
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
      <View style={styles.menuItemLeft}>
        <Icon name={icon} size={24} color={color} />
        <Text style={[styles.menuItemText, { color }]}>{title}</Text>
      </View>
      <Icon name="chevron-right" size={24} color="#888" />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Notifications')}>
          <Icon name="notifications" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            <Icon name="account-circle" size={80} color="#2874f0" />
          </View>
          <Text style={styles.userName}>{user?.name || 'User'}</Text>
          <Text style={styles.userEmail}>{user?.email || ''}</Text>
          {user?.phone && (
            <Text style={styles.userPhone}>📱 {user.phone}</Text>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Orders</Text>
          <MenuItem
            icon="shopping-bag"
            title="My Orders"
            onPress={() => navigation.navigate('Orders')}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account Settings</Text>
          <MenuItem icon="person" title="Edit Profile" onPress={() => {}} />
          <MenuItem
            icon="location-on"
            title="Manage Addresses"
            onPress={() => {}}
          />
          <MenuItem icon="payment" title="Payment Methods" onPress={() => {}} />
          <MenuItem
            icon="notifications"
            title="Notification Settings"
            onPress={() => {}}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support & Information</Text>
          <MenuItem 
            icon="info" 
            title="About Us" 
            onPress={() => navigation.navigate('About')} 
          />
          <MenuItem 
            icon="contact-mail" 
            title="Contact Us" 
            onPress={() => navigation.navigate('Contact')} 
          />
          <MenuItem 
            icon="track-changes" 
            title="Track Order" 
            onPress={() => navigation.navigate('TrackOrder')} 
          />
          <MenuItem 
            icon="help" 
            title="FAQs" 
            onPress={() => navigation.navigate('FAQs')} 
          />
          <MenuItem 
            icon="article" 
            title="Blog" 
            onPress={() => navigation.navigate('Blog')} 
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Policies</Text>
          <MenuItem 
            icon="local-shipping" 
            title="Shipping Policy" 
            onPress={() => navigation.navigate('ShippingPolicy')} 
          />
          <MenuItem 
            icon="assignment-return" 
            title="Return Policy" 
            onPress={() => navigation.navigate('ReturnPolicy')} 
          />
          <MenuItem 
            icon="privacy-tip" 
            title="Privacy Policy" 
            onPress={() => navigation.navigate('PrivacyPolicy')} 
          />
          <MenuItem
            icon="description"
            title="Terms & Conditions"
            onPress={() => navigation.navigate('TermsConditions')}
          />
        </View>

        <View style={styles.section}>
          <MenuItem
            icon="logout"
            title="Logout"
            onPress={handleLogout}
            color="#ff5722"
          />
        </View>

        <View style={styles.versionContainer}>
          <Text style={styles.versionText}>Version 1.0.0</Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1f3f6',
  },
  header: {
    backgroundColor: '#2874f0',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  content: {
    flex: 1,
  },
  profileSection: {
    backgroundColor: '#fff',
    alignItems: 'center',
    paddingVertical: 32,
    marginBottom: 8,
  },
  avatarContainer: {
    marginBottom: 16,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#212121',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  userPhone: {
    fontSize: 14,
    color: '#666',
  },
  section: {
    backgroundColor: '#fff',
    marginBottom: 8,
    paddingVertical: 8,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#888',
    paddingHorizontal: 16,
    paddingVertical: 12,
    textTransform: 'uppercase',
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  menuItemText: {
    fontSize: 16,
    color: '#212121',
  },
  versionContainer: {
    padding: 32,
    alignItems: 'center',
  },
  versionText: {
    fontSize: 12,
    color: '#888',
  },
});

export default ProfileScreen;
