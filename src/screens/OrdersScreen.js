import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { useOrder } from '../context/OrderContext';
import LottieView from 'lottie-react-native';

const OrdersScreen = ({ orderComplete, onOrderCompleteShown }) => {
  const { orders, setOrderStatus } = useOrder();
  const [showOrderComplete, setShowOrderComplete] = useState(false);
  const timersRef = useRef({});

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

  useEffect(() => {
    orders.forEach((order) => {
      if (order.status === 'preparing' && !timersRef.current[order.siraNo]) {
        timersRef.current[order.siraNo] = setTimeout(() => {
          setOrderStatus(order.siraNo, 'ready');
        }, 10000);
      }
    });
    return () => {
      Object.values(timersRef.current).forEach(clearTimeout);
      timersRef.current = {};
    };
  }, [orders, setOrderStatus]);

  const renderOrder = ({ item }) => (
    <View style={styles.receipt}>
      <Text style={styles.siraNo}>Sipariş No: {item.siraNo}</Text>
      <View style={styles.receiptHeader}>
        <Text style={styles.receiptTitle}>{item.name}</Text>
        <Text style={styles.receiptPrice}>{item.price} TL</Text>
      </View>
      <Text style={styles.receiptDate}>{item.date}</Text>
      <Text style={styles.receiptDesc}>{item.description}</Text>
      {item.customization && (
        <View style={styles.customizationBox}>
          <View style={styles.customizationHeader}>
            <Text style={styles.customizationLabel}>Detaylar:</Text>
            <View style={styles.statusBox}>
              <Text style={[styles.statusText, item.status === 'preparing' ? styles.statusPreparing : styles.statusReady]}>
                {item.status === 'preparing' ? 'Hazırlanıyor' : 'Hazır'}
              </Text>
            </View>
          </View>
          <View style={styles.customizationRow}>
            <Text style={styles.customizationItem}>Şeker: <Text style={styles.customizationValue}>{
              item.customization.sugar === 'no' ? 'Şekersiz'
              : item.customization.sugar === 'less' ? 'Az Şekerli'
              : item.customization.sugar === 'medium' ? 'Orta'
              : item.customization.sugar === 'more' ? 'Çok Şekerli'
              : item.customization.sugar
            }</Text></Text>
            <Text style={styles.customizationItem}>Süt: <Text style={styles.customizationValue}>{
              item.customization.milk === 'normal' ? 'Normal Süt'
              : item.customization.milk === 'lactose-free' ? 'Laktozsuz Süt'
              : item.customization.milk === 'almond' ? 'Badem Sütü'
              : item.customization.milk === 'oat' ? 'Yulaf Sütü'
              : item.customization.milk === 'none' ? 'Sütsüz'
              : item.customization.milk
            }</Text></Text>
          </View>
          <View style={styles.customizationRow}>
            <Text style={styles.customizationItem}>Ekstra Shot: <Text style={styles.customizationValue}>{item.customization.extraShot === 'yes' ? 'Evet' : 'Hayır'}</Text></Text>
          </View>
          {item.customization.note ? (
            <View style={styles.customizationRow}>
              <Text style={styles.customizationItem}>Not: <Text style={styles.customizationValue}>{item.customization.note}</Text></Text>
            </View>
          ) : null}
        </View>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
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
      <Text style={styles.header}>Siparişlerim</Text>
      {orders.length === 0 ? (
        <Text style={styles.empty}>Henüz siparişiniz yok.</Text>
      ) : (
        <FlatList
          data={orders}
          renderItem={renderOrder}
          keyExtractor={(_, i) => i.toString()}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    padding: 16,
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
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 56,
    marginBottom: 16,
    color: '#8B4513',
    textAlign: 'center',
  },
  empty: {
    textAlign: 'center',
    color: '#999',
    marginTop: 40,
    fontSize: 16,
  },
  receipt: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
    position: 'relative',
  },
  receiptHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  receiptTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#8B4513',
  },
  receiptPrice: {
    fontSize: 16,
    color: '#8B4513',
    fontWeight: 'bold',
  },
  receiptDate: {
    fontSize: 12,
    color: '#aaa',
    textAlign: 'right',
    marginBottom: 8,
  },
  receiptDesc: {
    fontSize: 14,
    color: '#555',
    marginBottom: 10,
  },
  customizationBox: {
    backgroundColor: '#f9f6f2',
    borderRadius: 10,
    padding: 12,
    marginTop: 6,
    borderWidth: 1,
    borderColor: '#f0e6dd',
  },
  customizationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  customizationLabel: {
    fontSize: 13,
    color: '#8B4513',
    fontWeight: 'bold',
    marginBottom: 4,
  },
  customizationRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginBottom: 2,
  },
  customizationItem: {
    fontSize: 13,
    color: '#333',
    marginRight: 16,
  },
  customizationValue: {
    fontWeight: 'bold',
    color: '#8B4513',
  },
  siraNo: {
    fontSize: 13,
    color: '#b08b2d',
    fontWeight: 'bold',
    marginBottom: 2,
  },
  statusBox: {
    marginLeft: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusText: {
    fontWeight: 'bold',
    fontSize: 14,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusPreparing: {
    backgroundColor: '#fffbe6',
    color: '#b08b2d',
    borderWidth: 1,
    borderColor: '#ffe082',
  },
  statusReady: {
    backgroundColor: '#e6ffed',
    color: '#2ecc40',
    borderWidth: 1,
    borderColor: '#2ecc40',
  },
});

export default OrdersScreen; 