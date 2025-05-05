import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  SafeAreaView,
  TextInput,
} from 'react-native';
import { coffeeData } from '../data/coffeeData';
import LottieView from 'lottie-react-native';
import { Ionicons } from '@expo/vector-icons';

const MenuScreen = ({ onCoffeePress, orderComplete, onOrderCompleteShown }) => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showOrderComplete, setShowOrderComplete] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const filteredCoffees = coffeeData.coffees.filter((coffee) => {
    const matchesSearch = coffee.name.toLowerCase().includes(searchQuery.toLowerCase());
    if (selectedCategory === 'all') {
      return matchesSearch;
    }
    const matchesCategory = coffee.category === selectedCategory;
    return matchesCategory && matchesSearch;
  });

  const uniqueCoffees = selectedCategory === 'all'
    ? filteredCoffees.filter((coffee, index, self) =>
        index === self.findIndex((c) => c.name === coffee.name)
      )
    : filteredCoffees;

  const renderCategory = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.categoryButton,
        selectedCategory === item.id && styles.selectedCategory,
      ]}
      onPress={() => setSelectedCategory(item.id)}
    >
      <Text style={styles.categoryIcon}>{item.icon}</Text>
      <Text
        style={[
          styles.categoryText,
          selectedCategory === item.id && styles.selectedCategoryText,
        ]}
        numberOfLines={1}
        ellipsizeMode="tail"
      >
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  const renderCoffeeItem = ({ item }) => (
    <TouchableOpacity
      style={styles.coffeeItem}
      onPress={() => onCoffeePress(item)}
    >
      <Image source={item.image} style={styles.coffeeImage} />
      <View style={styles.coffeeInfo}>
        <Text style={styles.coffeeName}>{item.name}</Text>
        <Text style={styles.coffeeDescription}>{item.description}</Text>
        <Text style={styles.coffeePrice}>{item.price} TL</Text>
      </View>
    </TouchableOpacity>
  );

  useEffect(() => {
    if (orderComplete) {
      setShowOrderComplete(true);
      const timer = setTimeout(() => {
        setShowOrderComplete(false);
        if (onOrderCompleteShown) onOrderCompleteShown();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [orderComplete]);

  return (
    <SafeAreaView style={styles.container}>
      {showOrderComplete && (
        <View style={styles.animationContainer}>
          <LottieView
            source={require('../assets/animations/order-complete-animation.json')}
            autoPlay
            loop={false}
            style={styles.animation}
          />
        </View>
      )}
      <View style={styles.header}>
        <Image 
          source={require('../assets/images/logo.png')} 
          style={styles.logo} 
        />
        <Text style={styles.headerTitle}>Kofi Menü</Text>
        <TouchableOpacity 
          style={styles.searchButton}
          onPress={() => setIsSearching(!isSearching)}
        >
          <Ionicons name="search" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
      {isSearching && (
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Kahve ara..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#999999"
          />
        </View>
      )}
      <FlatList
        data={coffeeData.categories}
        renderItem={renderCategory}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoriesList}
        scrollEnabled={true}
        bounces={false}
        alwaysBounceVertical={false}
        directionalLockEnabled={true}
      />
      <FlatList
        data={uniqueCoffees}
        renderItem={renderCoffeeItem}
        keyExtractor={(item) => item.id}
        style={styles.coffeeListContainer}
        contentContainerStyle={styles.coffeeList}
        alignItems="flex-start"
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    padding: 20,
    backgroundColor: '#8B4513',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logo: {
    width: 40,
    height: 40,
    marginRight: 15,
    resizeMode: 'contain',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  categoriesList: {
    paddingHorizontal: 10,
    paddingVertical: 0,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    height: 44,
    alignItems: 'center',
    marginBottom: 0,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 100,
    maxWidth: 160,
    height: 36,
    marginRight: 8,
    borderRadius: 14,
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 8,
    paddingVertical: 0,
  },
  selectedCategory: {
    backgroundColor: '#8B4513',
  },
  categoryIcon: {
    fontSize: 20,
    marginRight: 5,
  },
  categoryText: {
    fontSize: 13,
    color: '#333333',
    fontWeight: '400',
    flexShrink: 1,
    flexWrap: 'nowrap',
    textAlign: 'center',
  },
  selectedCategoryText: {
    color: '#FFFFFF',
    fontWeight: '500',
  },
  coffeeListContainer: {
    flex: 0,
    backgroundColor: '#F5F5F5',
    marginTop: -1,
  },
  coffeeList: {
    paddingHorizontal: 10,
    paddingTop: 5,
    paddingBottom: 10,
    alignItems: 'flex-start',
  },
  coffeeItem: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    marginBottom: 10,
    padding: 10,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  coffeeImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
    resizeMode: 'cover',
    overflow: 'hidden',
  },
  coffeeInfo: {
    flex: 1,
    marginLeft: 10,
    justifyContent: 'center',
  },
  coffeeName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
  },
  coffeeDescription: {
    fontSize: 14,
    color: '#666666',
    marginTop: 5,
  },
  coffeePrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#8B4513',
    marginTop: 5,
  },
  animationContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  animation: {
    width: 200,
    height: 200,
  },
  searchButton: {
    padding: 5,
  },
  searchContainer: {
    padding: 10,
    backgroundColor: '#FFFFFF',
  },
  searchInput: {
    height: 40,
    borderWidth: 1,
    borderColor: '#DDDDDD',
    borderRadius: 20,
    paddingHorizontal: 15,
    backgroundColor: '#F5F5F5',
  },
});

export default MenuScreen; 