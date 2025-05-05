import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';

const BottomNavBar = ({ current, onTabPress }) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.tab} onPress={() => onTabPress('Home')}>
        <Ionicons name="home" size={24} color={current === 'Home' ? '#8B4513' : '#aaa'} />
        <Text style={[styles.label, { color: current === 'Home' ? '#8B4513' : '#ccc', fontWeight: current === 'Home' ? 'bold' : 'normal' }]}>Anasayfa</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.tab} onPress={() => onTabPress('Menu')}>
        <Ionicons name="cafe" size={24} color={current === 'Menu' ? '#8B4513' : '#aaa'} />
        <Text style={[styles.label, current === 'Menu' && styles.activeLabel]}>Kahveler</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.tab} onPress={() => onTabPress('Orders')}>
        <Ionicons name="receipt" size={24} color={current === 'Orders' ? '#8B4513' : '#aaa'} />
        <Text style={[styles.label, current === 'Orders' && styles.activeLabel]}>Siparişlerim</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.tab} onPress={() => onTabPress('MiniGame')}>
        <FontAwesome5 name="gamepad" size={24} color={current === 'MiniGame' ? '#8B4513' : '#aaa'} />
        <Text style={[styles.label, current === 'MiniGame' && styles.activeLabel]}>Mini Oyun</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingVertical: 8,
    paddingBottom: 16,
  },
  tab: {
    alignItems: 'center',
  },
  label: {
    fontSize: 12,
    color: '#aaa',
    marginTop: 2,
  },
  activeLabel: {
    color: '#8B4513',
    fontWeight: 'bold',
  },
});

export default BottomNavBar; 