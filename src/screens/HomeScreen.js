import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, FlatList, TouchableOpacity, SafeAreaView, Platform, Modal, Pressable, TextInput } from 'react-native';
import { coffeeData } from '../data/coffeeData';
import { Clipboard, Alert } from 'react-native';
import { useBalance } from '../context/BalanceContext';

// İlk 5 farklı kahve (isim bazında)
const uniqueCoffees = coffeeData.coffees.filter((coffee, idx, arr) =>
  arr.findIndex(c => c.name === coffee.name) === idx
);

const HomeScreen = ({ kofiBalance, onCouponModalClose, onCoffeePress }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const { balance, setBalance } = useBalance();
  const [topupModalVisible, setTopupModalVisible] = useState(false);
  const [topupAmount, setTopupAmount] = useState('');
  const [selectedCard, setSelectedCard] = useState('mastercard');
  const [rewardCount, setRewardCount] = useState(69);
  const isFull = kofiBalance === 15;
  const [showAllSuggestions, setShowAllSuggestions] = useState(false);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 32 }}>
        <View style={styles.headerBg}>
          <Text style={styles.greeting}>Günaydın Umut ☀️</Text>
          <View style={styles.starRow}>
            <View style={styles.starBalanceBox}>
              <Text style={styles.starLabel}>Kofi Bakiyesi</Text>
              <View style={styles.starValueRow}>
                <Text style={styles.starValue}>{kofiBalance}</Text>
                <Text style={styles.starReward}>{rewardCount} ödül içecek</Text>
              </View>
            </View>
            <View style={styles.starProgressWrap}>
              {isFull && (
                <TouchableOpacity
                  style={styles.couponBtn}
                  onPress={() => {
                    setModalVisible(true);
                    setRewardCount(prev => prev + 1);
                    if (onCouponModalClose) onCouponModalClose();
                  }}
                >
                  <Text style={styles.couponBtnText}>Kupon Kodu Al</Text>
                </TouchableOpacity>
              )}
              <View style={styles.starProgressBox}>
                <Image source={require('../assets/images/logo.png')} style={styles.starCup} />
                <Text style={styles.starProgressText}>{kofiBalance}/15</Text>
              </View>
            </View>
          </View>
        </View>
        <View style={[styles.goldMemberBox, rewardCount >= 70 && styles.platinumBox]}>
          <Text style={[styles.goldMember, rewardCount >= 70 && styles.platinumText]}>{rewardCount >= 70 ? 'Platin Üye' : 'Gold Üye'}</Text>
          <Text style={styles.cardDesc}>Kredi/banka kartını tanımla, bakiyeni yükle.</Text>
          <View style={styles.cardRow}>
            <Image source={require('../assets/images/logo.png')} style={styles.cardImg} />
            <View>
              <Text style={styles.cardBalanceLabel}>Hesap Bakiyesi:</Text>
              <Text style={styles.cardBalance}>{balance.toFixed(2)} ₺</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.addMoneyBtn} onPress={() => setTopupModalVisible(true)}>
            <Text style={styles.addMoneyText}>BAKİYE YÜKLE</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.suggestionBox}>
          <View style={styles.suggestionHeader}>
            <Text style={styles.suggestionTitle}>Bunları denedin mi?</Text>
            <TouchableOpacity onPress={() => setShowAllSuggestions(s => !s)}>
              <Text style={styles.suggestionAll}>{showAllSuggestions ? 'Kapat' : 'Tümü →'}</Text>
            </TouchableOpacity>
          </View>
          {showAllSuggestions ? (
            <FlatList
              data={uniqueCoffees}
              numColumns={2}
              showsVerticalScrollIndicator={true}
              keyExtractor={item => item.id}
              key={'grid'}
              scrollEnabled={false}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => onCoffeePress && onCoffeePress(item)}>
                  <View style={styles.suggestionItem}>
                    <Image source={item.image} style={styles.suggestionImg} />
                    <View style={styles.suggestionTag}><Text style={styles.suggestionTagText}>Yeni</Text></View>
                    <Text style={styles.suggestionName}>{item.name}</Text>
                  </View>
                </TouchableOpacity>
              )}
              contentContainerStyle={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', paddingHorizontal: 12, paddingTop: 16, paddingBottom: 32 }}
            />
          ) : (
            <FlatList
              data={uniqueCoffees.slice(0, 5)}
              horizontal
              showsHorizontalScrollIndicator={true}
              keyExtractor={item => item.id}
              key={'row'}
              scrollEnabled={true}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => onCoffeePress && onCoffeePress(item)}>
                  <View style={styles.suggestionItem}>
                    <Image source={item.image} style={styles.suggestionImg} />
                    <View style={styles.suggestionTag}><Text style={styles.suggestionTagText}>Yeni</Text></View>
                    <Text style={styles.suggestionName}>{item.name}</Text>
                  </View>
                </TouchableOpacity>
              )}
            />
          )}
        </View>
        <View style={styles.campaignBox}>
          <Text style={styles.campaignTitle}>Kampanyalar</Text>
          <View style={styles.campaignCard}>
            <Text style={styles.campaignText}>Henüz Kampanya Yok! Burada kampanya veya duyuru kutusu olacak.</Text>
          </View>
        </View>
      </ScrollView>
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => {
          setModalVisible(false);
          if (onCouponModalClose) onCouponModalClose();
        }}
      >
        <View style={styles.modalBg}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Kupon Kodun</Text>
            <TouchableOpacity onPress={() => {
              Clipboard.setString('KUPON123');
              Alert.alert('Kopyalandı!', 'Kupon kodu panoya kopyalandı.');
            }}>
              <Text selectable style={styles.modalCode}>KUPON123</Text>
            </TouchableOpacity>
            <Pressable style={styles.modalCloseBtn} onPress={() => {
              setModalVisible(false);
              if (onCouponModalClose) onCouponModalClose();
            }}>
              <Text style={styles.modalCloseText}>Kapat</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
      {/* Bakiye Yükle Modalı */}
      <Modal
        visible={topupModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setTopupModalVisible(false)}
      >
        <View style={styles.topupModalBg}>
          <View style={styles.topupModalContent}>
            <Text style={styles.topupTitle}>Bakiye Yükle</Text>
            <TextInput
              style={styles.topupInput}
              placeholder="Yüklenecek Tutar"
              placeholderTextColor="#888"
              keyboardType="numeric"
              value={topupAmount}
              onChangeText={setTopupAmount}
              maxLength={8}
            />
            <Text style={styles.topupLabel}>Kart Seçimi</Text>
            <View style={styles.cardSelectRow}>
              <TouchableOpacity
                style={[styles.cardSelectBtn, selectedCard === 'mastercard' && styles.cardSelectBtnActive]}
                onPress={() => setSelectedCard('mastercard')}
              >
                <Image source={require('../assets/images/mastercard.png')} style={styles.cardLogo} />
                <Text style={styles.cardSelectText}>Mastercard\n•••• 9026</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.cardSelectBtn, selectedCard === 'visa' && styles.cardSelectBtnActive]}
                onPress={() => setSelectedCard('visa')}
              >
                <Image source={require('../assets/images/visa.png')} style={styles.cardLogo} />
                <Text style={styles.cardSelectText}>Visa\n•••• 1234</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={styles.topupBtn}
              onPress={() => {
                const amount = parseFloat(topupAmount.replace(',', '.'));
                if (!amount || amount <= 0) {
                  Alert.alert('Geçersiz Tutar', 'Lütfen geçerli bir tutar giriniz.');
                  return;
                }
                setBalance(prev => prev + amount);
                setTopupAmount('');
                setTopupModalVisible(false);
              }}
            >
              <Text style={styles.topupBtnText}>Bakiye Yükle</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setTopupModalVisible(false)}>
              <Text style={styles.topupCancel}>İptal</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f5ede3',
    paddingTop: Platform.OS === 'ios' ? 32 : 0,
  },
  container: {
    flex: 1,
    backgroundColor: '#f5ede3',
  },
  headerBg: {
    backgroundColor: '#8B4513',
    padding: 24,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    marginBottom: 16,
  },
  greeting: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  starRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  starBalanceBox: {
    flex: 1,
  },
  starLabel: {
    color: '#e0c68b',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  starValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  starValue: {
    color: '#fff',
    fontSize: 32,
    fontWeight: 'bold',
    marginRight: 12,
  },
  starReward: {
    color: '#fff',
    fontSize: 14,
  },
  starProgressWrap: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  starProgressBox: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderRadius: 40,
    width: 64,
    height: 64,
    marginLeft: 16,
    overflow: 'hidden',
  },
  starCup: {
    width: 70,
    height: 70,
    resizeMode: 'cover',
    alignSelf: 'center',
    marginTop: -8,
  },
  starProgressText: {
    color: '#8B4513',
    fontWeight: 'bold',
    fontSize: 13,
    position: 'absolute',
    bottom: 2,
    left: 0,
    right: 0,
    textAlign: 'center',
    backgroundColor: 'transparent',
  },
  goldMemberBox: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 18,
    marginBottom: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  goldMember: {
    backgroundColor: '#ffe082',
    color: '#b08b2d',
    fontWeight: 'bold',
    alignSelf: 'flex-start',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 2,
    fontSize: 13,
    marginBottom: 6,
  },
  cardBox: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 18,
    marginBottom: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  cardDesc: {
    color: '#333',
    fontSize: 14,
    marginBottom: 8,
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardImg: {
    width: 48,
    height: 32,
    resizeMode: 'contain',
    marginRight: 12,
  },
  cardBalanceLabel: {
    color: '#888',
    fontSize: 13,
  },
  cardBalance: {
    color: '#8B4513',
    fontWeight: 'bold',
    fontSize: 18,
  },
  addMoneyBtn: {
    backgroundColor: '#8B4513',
    borderRadius: 20,
    paddingVertical: 10,
    alignItems: 'center',
    marginTop: 6,
  },
  addMoneyText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
  },
  suggestionBox: {
    marginBottom: 18,
  },
  suggestionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
    paddingHorizontal: 16,
  },
  suggestionTitle: {
    color: '#b08b2d',
    fontWeight: 'bold',
    fontSize: 16,
  },
  suggestionAll: {
    color: '#8B4513',
    fontWeight: 'bold',
    fontSize: 14,
  },
  suggestionItem: {
    backgroundColor: '#222',
    borderRadius: 40,
    width: 90,
    height: 130,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    paddingTop: 16,
    marginTop: 8,
    marginBottom: 8,
  },
  suggestionImg: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginBottom: 4,
  },
  suggestionTag: {
    backgroundColor: '#e0c68b',
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 1,
    marginBottom: 2,
  },
  suggestionTagText: {
    color: '#8B4513',
    fontWeight: 'bold',
    fontSize: 11,
  },
  suggestionName: {
    color: '#fff',
    fontSize: 10,
    textAlign: 'center',
    fontWeight: 'bold',
    maxWidth: 78,
    numberOfLines: 1,
    ellipsizeMode: 'tail',
    overflow: 'hidden',
    paddingHorizontal: 2,
  },
  campaignBox: {
    marginBottom: 18,
    paddingHorizontal: 16,
  },
  campaignTitle: {
    color: '#b08b2d',
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 8,
  },
  campaignCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  campaignText: {
    color: '#333',
    fontSize: 14,
  },
  couponBtn: {
    backgroundColor: '#ffe082',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#b08b2d',
  },
  couponBtnText: {
    color: '#b08b2d',
    fontWeight: 'bold',
    fontSize: 13,
  },
  modalBg: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 28,
    alignItems: 'center',
    minWidth: 220,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#8B4513',
    marginBottom: 12,
  },
  modalCode: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#b08b2d',
    letterSpacing: 2,
    marginBottom: 18,
  },
  modalCloseBtn: {
    backgroundColor: '#8B4513',
    borderRadius: 12,
    paddingHorizontal: 18,
    paddingVertical: 8,
  },
  modalCloseText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
  },
  topupModalBg: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  topupModalContent: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 28,
    alignItems: 'center',
    minWidth: 300,
  },
  topupTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#8B4513',
    marginBottom: 18,
  },
  topupInput: {
    width: 180,
    borderWidth: 1,
    borderColor: '#e0c68b',
    borderRadius: 10,
    padding: 10,
    fontSize: 20,
    color: '#222',
    textAlign: 'center',
    marginBottom: 18,
  },
  topupLabel: {
    fontSize: 15,
    color: '#8B4513',
    fontWeight: 'bold',
    marginBottom: 8,
  },
  cardSelectRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 18,
  },
  cardSelectBtn: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 12,
    padding: 10,
    marginHorizontal: 8,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  cardSelectBtnActive: {
    borderColor: '#8B4513',
    backgroundColor: '#ffe082',
  },
  cardLogo: {
    width: 36,
    height: 24,
    marginBottom: 4,
    resizeMode: 'contain',
  },
  cardSelectText: {
    fontSize: 13,
    color: '#222',
    textAlign: 'center',
  },
  topupBtn: {
    backgroundColor: '#8B4513',
    borderRadius: 12,
    paddingHorizontal: 32,
    paddingVertical: 12,
    marginBottom: 8,
  },
  topupBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  topupCancel: {
    color: '#8B4513',
    fontWeight: 'bold',
    fontSize: 15,
    marginTop: 8,
  },
  platinumBox: {
    backgroundColor: '#e5e4e2',
    borderColor: '#b3b3b3',
  },
  platinumText: {
    backgroundColor: '#b3b3b3',
    color: '#fff',
  },
});

export default HomeScreen; 