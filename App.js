import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import MenuScreen from './src/screens/MenuScreen';
import OrdersScreen from './src/screens/OrdersScreen';
import CoffeeDetailScreen from './src/screens/CoffeeDetailScreen';
import BottomNavBar from './src/components/BottomNavBar';
import { OrderProvider } from './src/context/OrderContext';
import HomeScreen from './src/screens/HomeScreen';
import { BalanceProvider } from './src/context/BalanceContext';
import MiniGameScreen from './src/screens/MiniGameScreen';

export default function App() {
  const [currentTab, setCurrentTab] = useState('Home');
  const [selectedCoffee, setSelectedCoffee] = useState(null);
  const [orderComplete, setOrderComplete] = useState(false);
  const [kofiBalance, setKofiBalance] = useState(13);

  const handleCoffeePress = (coffee) => {
    setSelectedCoffee(coffee);
  };

  const handleOrderCompleteBack = () => {
    setSelectedCoffee(null);
    setOrderComplete(true);
    setCurrentTab('Orders');
    setKofiBalance(prev => (prev < 15 ? prev + 1 : 15));
  };

  const handleCouponModalClose = () => {
    setKofiBalance(0);
  };

  const handleBackToMenu = () => {
    setSelectedCoffee(null);
  };

  const handleOrderCompleteShown = () => {
    setOrderComplete(false);
  };

  return (
    <BalanceProvider>
      <OrderProvider>
        <View style={styles.container}>
          {selectedCoffee ? (
            <CoffeeDetailScreen coffee={selectedCoffee} onBack={handleBackToMenu} onOrderCompleteBack={handleOrderCompleteBack} />
          ) : currentTab === 'Home' ? (
            <HomeScreen kofiBalance={kofiBalance} onCouponModalClose={handleCouponModalClose} onCoffeePress={handleCoffeePress} />
          ) : currentTab === 'Menu' ? (
            <MenuScreen onCoffeePress={handleCoffeePress} />
          ) : currentTab === 'MiniGame' ? (
            <MiniGameScreen />
          ) : (
            <OrdersScreen orderComplete={orderComplete} onOrderCompleteShown={handleOrderCompleteShown} />
          )}
          <BottomNavBar current={currentTab} onTabPress={tab => { setCurrentTab(tab); setSelectedCoffee(null); }} />
        </View>
      </OrderProvider>
    </BalanceProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
}); 