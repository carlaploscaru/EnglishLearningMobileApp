import React, { useRef, useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, FlatList,
  TouchableWithoutFeedback, Animated, TouchableOpacity, ScrollView
} from 'react-native';
import { getCurrentUser, fetchAuthSession } from 'aws-amplify/auth';

const API_URL = 'https://6cuc3m1qz4.execute-api.eu-central-1.amazonaws.com/getLevels/';

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
    Animated.spring(flipAnim, {
      toValue: flipped ? 0 : 180,
      useNativeDriver: true,
    }).start();
    setFlipped(!flipped);
  };

  return (
    <TouchableWithoutFeedback onPress={flipCard}>
      <View style={styles.cardContainer}>
        <Animated.View style={[styles.card, { transform: [{ rotateY: frontInterpolate }] }]}>
          <Text style={styles.cardText}>{english}</Text>
        </Animated.View>
        <Animated.View style={[styles.card, styles.cardBack, { transform: [{ rotateY: backInterpolate }] }]}>
          <Text style={styles.cardText}>{romanian}</Text>
        </Animated.View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const UnlockedCardsPage = ({ navigation }) => {
  const [vocabularyLevels, setVocabularyLevels] = useState([]);
  const [verbLevels, setVerbLevels] = useState([]);
  const scrollRef = useRef(null);
  const [scrollY, setScrollY] = useState(0);
  const [verbSectionY, setVerbSectionY] = useState(0);
  const [jumpTarget, setJumpTarget] = useState('verbs'); 

  const verbSectionRef = useRef(null);
  const vocabSectionRef = useRef(null);

  const fetchCards = async () => {
    try {
      const fetchCategory = async (categoryKey) => {
        const response = await fetch(`${API_URL}?categoryKey=${categoryKey}`);
        const data = await response.json();
        const parsedBody = JSON.parse(data.body);

        const allLevels = parsedBody.levels.filter(lvl => lvl.category === categoryKey);

        return allLevels.map((level) => ({
          levelTitle: level.level,
          cards: (level.questions || []).map(q => {
            const qData = q.M;
            return {
              english: qData.correctAnswer.S,
              romanian: qData.romanianWord.S,
            };
          }),
        }));
      };

      const [vocab, verbs] = await Promise.all([
        fetchCategory('vocabulary'),
        fetchCategory('verbs')
      ]);

      setVocabularyLevels(vocab);
      setVerbLevels(verbs);
    } catch (error) {
      console.error("Error fetching cards:", error);
    }
  };

  useEffect(() => {
    fetchCards();
    setTimeout(() => {
      verbSectionRef.current?.measure((x, y, width, height, pageX, pageY) => {
        setVerbSectionY(pageY);
      });
    }, 500); 
  }, []);

  const fetchUserProgress = async () => {
    try {
      // const user = await getCurrentUser();
      // const userId = user.username;
      const { userId } = await getCurrentUser();
      const session = await fetchAuthSession();
      const idToken = session.tokens?.idToken?.toString();

      const response = await fetch(`https://xbq4gmvb0e.execute-api.eu-central-1.amazonaws.com/UserDetails/settings?user_id=${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'AuthorizationPusDeMine': `Bearer ${idToken}`,
        },
      });

        const raw = await response.json();
        const data = typeof raw.body === 'string' ? JSON.parse(raw.body) : raw;

        console.log("cevaaaaaaa",data)
        setUserProgress(data); 
    } catch (err) {
      console.error("Failed to fetch user progress:", err);
    }finally {
      setLoading(false);
    }
  };



  return (
    <>
    <ScrollView ref={scrollRef} contentContainerStyle={styles.container}
      onScroll={e => {
         const y = e.nativeEvent.contentOffset.y;
         setScrollY(y);
          if (verbSectionY && y >= verbSectionY - 100) {
            setJumpTarget('vocabulary');
          } else {
            setJumpTarget('verbs');
        }
      }}
      scrollEventThrottle={16}>
      <Text style={styles.title}>Study Cards</Text>

      <Text style={styles.sectionTitle} ref={vocabSectionRef}>Vocabulary</Text>
      {vocabularyLevels.map((level, i) => (
        <View key={`vocab-${i}`}>
          <Text style={styles.levelTitle}>Level {level.levelTitle}</Text>
          {level.cards.map((card, j) => (
            <FlipCard key={`vocab-${i}-${j}`} english={card.english} romanian={card.romanian} />
          ))}
        </View>
      ))}

      <Text style={styles.sectionTitle} ref={verbSectionRef}>Verbs</Text>
      {verbLevels.map((level, i) => (
        <View key={`verb-${i}`}>
          <Text style={styles.levelTitle}>Level {level.levelTitle}</Text>
          {level.cards.map((card, j) => (
            <FlipCard key={`verb-${i}-${j}`} english={card.english} romanian={card.romanian} />
          ))}
        </View>
      ))}

      <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate("Flashcards")}>
        <Text style={styles.backButtonText}>← Back to Flashcards</Text>
      </TouchableOpacity>
    </ScrollView>
    
    <View style={styles.floatingButtonContainer}>
      <TouchableOpacity
        style={styles.arrowButton}
        onPress={() => {
          const ref = jumpTarget === 'verbs' ? verbSectionRef : vocabSectionRef;
          ref.current?.measure((x, y, width, height, pageX, pageY) => {
            scrollRef.current?.scrollTo({ y: pageY, animated: true });
          });
        }}
      >
        <Text style={styles.arrowText}>
          {jumpTarget === 'verbs' ? 'To Verbs' : 'To Vocabulary'}
        </Text>
      </TouchableOpacity>
    </View>
</>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 60,
    paddingBottom: 80,
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    marginTop: 30,
    marginBottom: 15,
    backgroundColor: '#f5f5f5',
  },
  levelTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    marginTop: 10,
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
    marginTop: 30,
    padding: 15,
    backgroundColor: '#1a1440',
    borderRadius: 8,
  },
  backButtonText: {
    fontSize: 16,
    color: '#fff',
  },
  arrowButton: {
    marginVertical: 10,
    padding: 10,
    backgroundColor: '#3b3b98',
    borderRadius: 5,
  },
  arrowText: {
    color: '#fff',
    fontSize: 16,
  },
  floatingButtonContainer: {
    position: 'absolute',
    right: 10,
    top: 100,
    zIndex: 100,
  },
});

export default UnlockedCardsPage;