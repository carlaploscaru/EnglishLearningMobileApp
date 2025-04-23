import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableWithoutFeedback, Animated, TouchableOpacity } from 'react-native';
import FlashcardsPage from './FlashCards';

const wordPairs = [
  { id: '1', english: 'trebe din baza de date', romanian: 'Măr' },
  { id: '2', english: 'House', romanian: 'Casă' },
  { id: '3', english: 'Book', romanian: 'Carte' },
  { id: '4', english: 'Sun', romanian: 'Ssare' },
  { id: '5', english: 'mun', romanian: 'Saare' },
  { id: '6', english: 'fun', romanian: 'Sosre' },
];

const FlipCard = ({ english, romanian }) => {
  const flipAnim = useRef(new Animated.Value(0)).current;
  const [flipped, setFlipped] = useState(false);

  const frontInterpolate = flipAnim.interpolate({
    inputRange: [0, 180],
    outputRange: ['0deg', '180deg'],
  });

  const backInterpolate = flipAnim.interpolate({
    inputRange: [0, 180],
    outputRange: ['180deg', '360deg'],
  });

  const flipCard = () => {
    if (flipped) {
      Animated.spring(flipAnim, {
        toValue: 0,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.spring(flipAnim, {
        toValue: 180,
        useNativeDriver: true,
      }).start();
    }
    setFlipped(!flipped);
  };

  return (
    <TouchableWithoutFeedback onPress={flipCard}>
      <View style={styles.cardContainer}>
        <Animated.View style={[styles.card, { transform: [{ rotateY: frontInterpolate }] }]}>
          <Text style={styles.cardText}>{english}</Text>
        </Animated.View>
        <Animated.View
          style={[
            styles.card,
            styles.cardBack,
            { transform: [{ rotateY: backInterpolate }] },
          ]}
        >
          <Text style={styles.cardText}>{romanian}</Text>
        </Animated.View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const UnlockedCardsPage = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Unlocked Cards</Text>

      <FlatList
        data={wordPairs}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <FlipCard english={item.english} romanian={item.romanian} />
        )}
        contentContainerStyle={styles.list}
      />

      <TouchableOpacity style={styles.backButton} onPress={() =>  navigation.navigate("Flashcards")}>
        <Text style={styles.backButtonText}>← Back to Flashcards</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 40,
  },
  list: {
    alignItems: 'center',
    paddingBottom: 100,
  },
  cardContainer: {
    marginBottom: 20,
    width: 250,
    height: 130,
  },
  card: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: '#C8C8C8',
    justifyContent: 'center',
    alignItems: 'center',
    backfaceVisibility: 'hidden',
    borderRadius: 10,
  },
  cardBack: {
    backgroundColor: '#2196F3',
  },
  cardText: {
    fontSize: 22,
    color: '#404040',
    fontWeight: 'bold',
  },
  backButton: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#1a1440',
    borderRadius: 8,
    position: 'absolute',
    bottom: 40,
  },
  backButtonText: {
    fontSize: 16,
    color: '#fff',
  },
});

export default UnlockedCardsPage;
