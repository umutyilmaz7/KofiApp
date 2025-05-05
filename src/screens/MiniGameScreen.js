import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Image, Dimensions, TouchableOpacity, PanResponder, Animated } from 'react-native';

const { width, height } = Dimensions.get('window');

// iPhone 16 Pro Max Dynamic Island: 118x38 px (screen width: 430)
const DI_SCALE = 1.1; // %10 büyüt
const DYNAMIC_ISLAND_WIDTH = width * (110 / 430) * DI_SCALE;
const DYNAMIC_ISLAND_HEIGHT = 32 * DI_SCALE;
const PADDLE_WIDTH = width * 0.32;
const PADDLE_HEIGHT = 32; // platformu daha kalın yap
const BALL_SIZE = 64;
const BALL_SPEED = 6;
const BALL_SPEED_INCREASE = 1.08; // Her skor sonrası hız çarpanı
const BALL_SPEED_MAX = 18;
const PADDLE_Y = height - 120;
const TOP_MARGIN = 14; // Biraz daha aşağıda konumlandır

// Animasyon için değerler
const DI_SHAKE_DURATION = 40; // Daha hızlı titreşim

const MiniGameScreen = () => {
  const [started, setStarted] = useState(false);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [showStart, setShowStart] = useState(true);

  // Ball state
  const [ball, setBall] = useState({
    x: width / 2 - BALL_SIZE / 2,
    y: height / 2,
    vx: BALL_SPEED * (Math.random() > 0.5 ? 1 : -1),
    vy: -BALL_SPEED,
  });
  // Paddle state
  const [paddleX, setPaddleX] = useState(width / 2 - PADDLE_WIDTH / 2);

  // Animation
  const animation = useRef();

  // Dinamik ada animasyonu
  const diScale = useRef(new Animated.Value(1)).current;
  const diShake = useRef(new Animated.Value(0)).current;

  // PanResponder for paddle
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (e, gesture) => {
        let newX = gesture.moveX - PADDLE_WIDTH / 2;
        newX = Math.max(0, Math.min(width - PADDLE_WIDTH, newX));
        setPaddleX(newX);
      },
    })
  ).current;

  // Oyun döngüsü
  useEffect(() => {
    if (!started || gameOver) return;
    animation.current = requestAnimationFrame(gameLoop);
    return () => cancelAnimationFrame(animation.current);
  });

  // Oyun başlat
  const startGame = () => {
    setScore(0);
    setGameOver(false);
    setShowStart(false);
    setBall({
      x: width / 2 - BALL_SIZE / 2,
      y: height / 2,
      vx: BALL_SPEED * (Math.random() > 0.5 ? 1 : -1),
      vy: -BALL_SPEED,
    });
    setPaddleX(width / 2 - PADDLE_WIDTH / 2);
    setStarted(true);
  };

  // Oyun döngüsü fonksiyonu
  const gameLoop = () => {
    setBall(prev => {
      let { x, y, vx, vy } = prev;
      x += vx;
      y += vy;
      // Duvarlara çarpma
      if (x <= 0 || x + BALL_SIZE >= width) vx = -vx;
      if (y <= 0) vy = -vy;
      // Dinamik ada engeli (üstte, ortada)
      const diX = width / 2 - DYNAMIC_ISLAND_WIDTH / 2;
      const diY = TOP_MARGIN;
      if (
        y <= diY + DYNAMIC_ISLAND_HEIGHT &&
        y + BALL_SIZE >= diY &&
        x + BALL_SIZE >= diX &&
        x <= diX + DYNAMIC_ISLAND_WIDTH &&
        vy < 0
      ) {
        vy = -vy;
        setScore(s => s + 1);
        // Hızı artır
        const speed = Math.min(Math.sqrt(vx * vx + vy * vy) * BALL_SPEED_INCREASE, BALL_SPEED_MAX);
        // Yönü koruyarak yeni hızları hesapla
        const angle = Math.atan2(vy, vx);
        vx = Math.cos(angle) * speed;
        vy = Math.sin(angle) * speed;
        // Daha hızlı ve belirgin shake animasyonu (5 kez)
        const shakes = [];
        for (let i = 0; i < 5; i++) {
          shakes.push(
            Animated.timing(diShake, {
              toValue: i % 2 === 0 ? 1 : -1,
              duration: DI_SHAKE_DURATION,
              useNativeDriver: true,
            })
          );
        }
        shakes.push(
          Animated.timing(diShake, {
            toValue: 0,
            duration: DI_SHAKE_DURATION,
            useNativeDriver: true,
          })
        );
        Animated.sequence(shakes).start();
      }
      // Paddle çarpışma
      if (
        y + BALL_SIZE >= PADDLE_Y &&
        y + BALL_SIZE <= PADDLE_Y + PADDLE_HEIGHT &&
        x + BALL_SIZE >= paddleX &&
        x <= paddleX + PADDLE_WIDTH &&
        vy > 0
      ) {
        vy = -vy;
        // Rastgele biraz x yönü ekle
        vx += (Math.random() - 0.5) * 2;
      }
      // Oyun bitti mi?
      if (y > height) {
        setGameOver(true);
        setStarted(false);
      }
      return { x, y, vx, vy };
    });
    if (!gameOver && started) animation.current = requestAnimationFrame(gameLoop);
  };

  // Oyun bittiğinde skor göster
  if (gameOver) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Oyun Bitti!</Text>
        <Text style={styles.desc}>Skorun: {score}</Text>
        <TouchableOpacity style={styles.button} onPress={startGame}>
          <Text style={styles.buttonText}>Tekrar Oyna</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Oyun başlamadan önceki ekran
  if (showStart) {
    return (
      <View style={styles.container}>
        <Image
          source={require('../assets/images/logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.title}>Mini Oyun</Text>
        <Text style={styles.desc}>Kahveni beklerken mini bir oyun oynamaya ne dersin? :)</Text>
        <TouchableOpacity style={styles.button} onPress={startGame}>
          <Text style={styles.buttonText}>Başlat</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Oyun ekranı
  return (
    <View style={styles.gameContainer}>
      {/* Dinamik ada engeli */}
      <Animated.View
        style={[
          styles.dynamicIsland,
          {
            transform: [
              { scaleX: diScale },
              { translateX: diShake.interpolate({
                  inputRange: [-1, 1],
                  outputRange: [-8, 8],
                }) },
            ],
          },
        ]}
      />
      {/* Top yerine kahve bardağı */}
      <Image
        source={require('../assets/images/coffee-cup.png')}
        style={[
          styles.ball,
          { left: ball.x, top: ball.y, resizeMode: 'contain' },
        ]}
      />
      {/* Paddle */}
      <View
        style={[styles.paddle, { left: paddleX, top: PADDLE_Y }]}
        {...panResponder.panHandlers}
      />
      {/* Skor */}
      <Text style={styles.score}>{score}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  gameContainer: {
    flex: 1,
    backgroundColor: '#e6f6fd',
  },
  logo: {
    width: width * 0.5,
    height: width * 0.5,
    marginTop: 40,
    marginBottom: 4,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#8B4513',
    zIndex: 1,
    marginTop: 0,
    paddingVertical: 8,
  },
  desc: {
    fontSize: 18,
    color: '#8B4513',
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
    letterSpacing: 0.2,
  },
  button: {
    backgroundColor: '#8B4513',
    borderRadius: 16,
    paddingHorizontal: 48,
    paddingVertical: 18,
    marginBottom: 0,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
  dynamicIsland: {
    position: 'absolute',
    top: TOP_MARGIN,
    left: width / 2 - DYNAMIC_ISLAND_WIDTH / 2,
    width: DYNAMIC_ISLAND_WIDTH,
    height: DYNAMIC_ISLAND_HEIGHT,
    borderRadius: DYNAMIC_ISLAND_HEIGHT / 2,
    backgroundColor: '#222',
    zIndex: 2,
  },
  ball: {
    position: 'absolute',
    width: BALL_SIZE,
    height: BALL_SIZE,
    zIndex: 3,
  },
  paddle: {
    position: 'absolute',
    width: PADDLE_WIDTH,
    height: PADDLE_HEIGHT,
    borderRadius: PADDLE_HEIGHT / 2,
    backgroundColor: '#111',
    zIndex: 3,
  },
  score: {
    position: 'absolute',
    top: height / 2 - 60,
    alignSelf: 'center',
    fontSize: 64,
    color: '#111',
    fontWeight: 'bold',
    zIndex: 10,
    textAlign: 'center',
    textShadowColor: '#fff',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 8,
  },
});

export default MiniGameScreen; 