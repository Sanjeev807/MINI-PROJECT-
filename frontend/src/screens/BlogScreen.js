import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const BlogScreen = ({ navigation }) => {
  const articles = [
    {
      title: 'Top 10 Tech Gadgets of 2025',
      date: 'October 25, 2025',
      preview: 'Discover the must-have tech gadgets that are revolutionizing the way we live and work in 2025. From smart home devices to cutting-edge wearables, we\'ve curated the ultimate list.',
    },
    {
      title: 'Fashion Trends for the Holiday Season',
      date: 'October 20, 2025',
      preview: 'Get ready for the festive season with our comprehensive guide to the hottest fashion trends. Learn what\'s in style and how to rock the perfect holiday look.',
    },
    {
      title: 'Home Organization Hacks You Need to Know',
      date: 'October 15, 2025',
      preview: 'Transform your living space with these clever organization tips and tricks. Maximize storage, reduce clutter, and create a home you\'ll love.',
    },
    {
      title: 'The Ultimate Gift Guide 2025',
      date: 'October 10, 2025',
      preview: 'Finding the perfect gift has never been easier! Browse our curated selection of thoughtful presents for everyone on your list, from tech enthusiasts to fashion lovers.',
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>E-Shop Blog</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Latest Articles</Text>
          {articles.map((article, index) => (
            <View key={index} style={styles.articleCard}>
              <Text style={styles.articleTitle}>{article.title}</Text>
              <Text style={styles.articleDate}>{article.date}</Text>
              <Text style={styles.articlePreview}>{article.preview}</Text>
            </View>
          ))}
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
    fontSize: 24,
    fontWeight: 'bold',
    color: '#6366f1',
    marginBottom: 20,
  },
  articleCard: {
    backgroundColor: '#F0F0FF',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  articleTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#212121',
    marginBottom: 8,
  },
  articleDate: {
    fontSize: 14,
    color: '#8b5cf6',
    fontWeight: '600',
    marginBottom: 8,
  },
  articlePreview: {
    fontSize: 15,
    color: '#555',
    lineHeight: 22,
  },
});

export default BlogScreen;
