import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  RefreshControl,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { productAPI } from '../services/api';

const categories = [
  { name: 'Electronics', icon: 'phone-android', color: '#2196f3' },
  { name: 'Fashion', icon: 'checkroom', color: '#e91e63' },
  { name: 'Home', icon: 'home', color: '#ff9800' },
  { name: 'Books', icon: 'book', color: '#4caf50' },
  { name: 'Sports', icon: 'sports-soccer', color: '#f44336' },
  { name: 'Beauty', icon: 'spa', color: '#9c27b0' },
  { name: 'Toys', icon: 'toys', color: '#00bcd4' },
  { name: 'Grocery', icon: 'shopping-basket', color: '#8bc34a' },
];

const CategoriesScreen = ({ navigation }) => {
  const [productCounts, setProductCounts] = useState({});
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchProductCounts();
  }, []);

  const fetchProductCounts = async () => {
    try {
      const counts = {};
      for (const category of categories) {
        const response = await productAPI.getProducts({
          category: category.name,
          limit: 1,
        });
        counts[category.name] = response.data.total || 0;
      }
      setProductCounts(counts);
    } catch (error) {
      console.error('Error fetching product counts:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchProductCounts();
    setRefreshing(false);
  };

  const renderCategory = ({ item }) => (
    <TouchableOpacity
      style={[styles.categoryCard, { borderLeftColor: item.color }]}
      onPress={() =>
        navigation.navigate('CategoryProducts', { category: item.name })
      }
    >
      <View style={[styles.iconContainer, { backgroundColor: item.color + '20' }]}>
        <Icon name={item.icon} size={40} color={item.color} />
      </View>
      <View style={styles.categoryInfo}>
        <Text style={styles.categoryName}>{item.name}</Text>
        <Text style={styles.productCount}>
          {productCounts[item.name] || 0} Products
        </Text>
      </View>
      <Icon name="chevron-right" size={24} color="#666" />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>All Categories</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Search')}>
          <Icon name="search" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={categories}
        renderItem={renderCategory}
        keyExtractor={(item) => item.name}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
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
  listContent: {
    padding: 16,
  },
  categoryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    borderLeftWidth: 4,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  categoryInfo: {
    flex: 1,
  },
  categoryName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#212121',
    marginBottom: 4,
  },
  productCount: {
    fontSize: 14,
    color: '#666',
  },
});

export default CategoriesScreen;
