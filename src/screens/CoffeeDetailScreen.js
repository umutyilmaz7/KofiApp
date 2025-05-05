import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  TextInput,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { customizationOptions } from '../data/coffeeData';
import LottieView from 'lottie-react-native';
import { useOrder } from '../context/OrderContext';
import { Ionicons } from '@expo/vector-icons';
import { useBalance } from '../context/BalanceContext';

const CoffeeDetailScreen = ({ coffee, onBack, onOrderCompleteBack }) => {
  const [customization, setCustomization] = useState({
    sugar: 'medium',
    extraShot: 'no',
    milk: 'normal',
    note: '',
  });
  const [showAnimation, setShowAnimation] = useState(false);
  const { addOrder } = useOrder();
  const [couponCode, setCouponCode] = useState('');
  const [couponUsed, setCouponUsed] = useState(false);
  const { balance, setBalance } = useBalance();
  const [quantity, setQuantity] = useState(1);

  const handleOrder = () => {
    let totalPrice = coffee.price * quantity;
    if (couponUsed) {
      if (quantity === 1) {
        totalPrice = 0;
      } else {
        totalPrice = coffee.price * (quantity - 1);
      }
    }
    if (balance < totalPrice) {
      Alert.alert('Yetersiz Bakiye', 'Lütfen bakiye yükleyin.');
      return;
    }
    setBalance(prev => Math.max(0, prev - totalPrice));
    setShowAnimation(true);
    addOrder({
      name: coffee.name,
      description: coffee.description,
      price: totalPrice,
      quantity,
      date: new Date().toLocaleString('tr-TR'),
      customization,
    });
  };

  const handleUseCoupon = () => {
    if (couponUsed) return;
    if (couponCode.trim() === 'KUPON123') {
      setCouponUsed(true);
    } else {
      Alert.alert('Geçersiz Kupon', 'Lütfen geçerli bir kupon kodu giriniz.');
    }
  };

  const renderOption = (title, options, selected, setSelected) => (
    <View style={styles.optionContainer}>
      <Text style={styles.optionTitle}>{title}</Text>
      <View style={styles.optionsRow}>
        {options.map((option) => (
          <TouchableOpacity
            key={option.id}
            style={[
              styles.optionButton,
              selected === option.id && styles.selectedOption,
            ]}
            onPress={() => setSelected(option.id)}
          >
            <Text
              style={[
                styles.optionText,
                selected === option.id && styles.selectedOptionText,
              ]}
            >
              {option.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 24}
    >
      <SafeAreaView style={styles.container}>
        {showAnimation ? (
          <View style={styles.animationContainer}>
            <LottieView
              source={require('../assets/animations/coffee-pour.json')}
              autoPlay
              loop={false}
              style={styles.animation}
              onAnimationFinish={onOrderCompleteBack}
            />
          </View>
        ) : (
          <ScrollView
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{ flexGrow: 1, paddingBottom: 40 }}
          >
            <TouchableOpacity style={styles.backButton} onPress={onBack}>
              <Ionicons name="arrow-back" size={28} color="#8B4513" />
            </TouchableOpacity>
            <View style={styles.header}>
              <Image source={coffee.image} style={styles.coffeeImage} />
            </View>
            <View style={styles.content}>
              <Text style={styles.coffeeName}>{coffee.name}</Text>
              <Text style={styles.coffeeDescription}>{coffee.description}</Text>
              <Text style={styles.coffeePrice}>{
                couponUsed
                  ? (quantity === 1
                      ? '0 TL'
                      : `${(coffee.price * (quantity - 1)).toLocaleString('tr-TR')} TL`)
                  : `${(coffee.price * quantity).toLocaleString('tr-TR')} TL`
              }</Text>

              {/* Adet seçici */}
              <View style={styles.quantityRow}>
                <TouchableOpacity
                  style={styles.quantityBtn}
                  onPress={() => setQuantity(q => Math.max(1, q - 1))}
                >
                  <Text style={styles.quantityBtnText}>-</Text>
                </TouchableOpacity>
                <Text style={styles.quantityValue}>{quantity}</Text>
                <TouchableOpacity
                  style={styles.quantityBtn}
                  onPress={() => setQuantity(q => q + 1)}
                >
                  <Text style={styles.quantityBtnText}>+</Text>
                </TouchableOpacity>
              </View>

              {/* Kupon kodu girme alanı */}
              <View style={styles.couponInputContainer}>
                <Ionicons name="ticket-outline" size={28} color="#222" style={{ marginRight: 8 }} />
                <TextInput
                  style={styles.couponInput}
                  placeholder="Kupon Kodu Giriniz / Seçiniz"
                  placeholderTextColor="#222"
                  value={couponCode}
                  onChangeText={setCouponCode}
                  editable={!couponUsed}
                />
                <TouchableOpacity
                  style={[styles.couponButton, couponUsed && styles.couponButtonUsed]}
                  onPress={handleUseCoupon}
                  disabled={couponUsed || couponCode.trim().length === 0}
                >
                  <Text style={[styles.couponButtonText, couponUsed && styles.couponButtonTextUsed]}>{couponUsed ? 'Kullanıldı' : 'Kullan'}</Text>
                </TouchableOpacity>
              </View>

              {renderOption(
                'Şeker Miktarı',
                customizationOptions.sugar,
                customization.sugar,
                (value) => setCustomization({ ...customization, sugar: value })
              )}

              {renderOption(
                'Ekstra Shot',
                customizationOptions.extraShot,
                customization.extraShot,
                (value) => setCustomization({ ...customization, extraShot: value })
              )}

              {renderOption(
                'Süt Tercihi',
                customizationOptions.milk,
                customization.milk,
                (value) => setCustomization({ ...customization, milk: value })
              )}

              <View style={[styles.noteContainer, { marginBottom: 32 }]}>
                <Text style={styles.optionTitle}>Not Ekle</Text>
                <TextInput
                  style={styles.noteInput}
                  placeholder="Özel isteklerinizi yazın..."
                  value={customization.note}
                  onChangeText={(text) =>
                    setCustomization({ ...customization, note: text })
                  }
                  multiline
                />
              </View>

              <TouchableOpacity
                style={styles.orderButton}
                onPress={handleOrder}
              >
                <Text style={styles.orderButtonText}>Sipariş Ver</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        )}
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    height: 300,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  coffeeImage: {
    width: 200,
    height: 200,
    borderRadius: 10,
    resizeMode: 'cover',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  coffeeName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 10,
  },
  coffeeDescription: {
    fontSize: 16,
    color: '#666666',
    marginBottom: 20,
  },
  coffeePrice: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#8B4513',
    marginBottom: 30,
  },
  optionContainer: {
    marginBottom: 20,
  },
  optionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 10,
  },
  optionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  optionButton: {
    padding: 10,
    margin: 5,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DDDDDD',
  },
  selectedOption: {
    backgroundColor: '#8B4513',
    borderColor: '#8B4513',
  },
  optionText: {
    fontSize: 14,
    color: '#333333',
  },
  selectedOptionText: {
    color: '#FFFFFF',
  },
  noteContainer: {
    marginBottom: 20,
  },
  noteInput: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 10,
    minHeight: 100,
    borderWidth: 1,
    borderColor: '#DDDDDD',
    textAlignVertical: 'top',
  },
  orderButton: {
    backgroundColor: '#8B4513',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  orderButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  animationContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  animation: {
    width: 300,
    height: 300,
  },
  backButton: {
    position: 'absolute',
    top: 16,
    left: 16,
    zIndex: 10,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 4,
    elevation: 2,
  },
  couponInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginTop: 8,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },
  couponInput: {
    flex: 1,
    fontSize: 16,
    color: '#222',
    fontWeight: 'bold',
    backgroundColor: 'transparent',
    borderWidth: 0,
    paddingVertical: 0,
  },
  couponButton: {
    backgroundColor: '#8B4513',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginLeft: 8,
  },
  couponButtonUsed: {
    backgroundColor: '#ccc',
  },
  couponButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
  },
  couponButtonTextUsed: {
    color: '#888',
  },
  quantityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginBottom: 18,
  },
  quantityBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#eee',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 8,
  },
  quantityBtnText: {
    fontSize: 22,
    color: '#8B4513',
    fontWeight: 'bold',
  },
  quantityValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#8B4513',
    minWidth: 24,
    textAlign: 'center',
  },
});

export default CoffeeDetailScreen; 