import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Animated,
  SafeAreaView,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import NavigationBar from "../components/NavigationBar";

const screen = Dimensions.get("window");

const GamePage = ({ route, navigation }) => {
  const { categoryKey, levelId } = route.params || {};
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [showQuestion, setShowQuestion] = useState(false);
  const [starPosition, setStarPosition] = useState({ top: 0, left: 0 });
  const [lives, setLives] = useState(3);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const explosionAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    fetchQuestions();
  }, []);

  const API_URL = 'https://6cuc3m1qz4.execute-api.eu-central-1.amazonaws.com/getLevels/';

  const fetchQuestions = async () => {
    try {
      const response = await fetch(`${API_URL}?categoryKey=${categoryKey}&levelId=${levelId}`);
      const data = await response.json();
      const parsedBody = JSON.parse(data.body); 
      const level = parsedBody.levels.find(
        (lvl) => lvl.level === levelId && lvl.category === categoryKey
      );

      if (!level || !level.questions) {
        console.warn("No level or questions found.");
        return;
      }

      const parsedQuestions = level.questions.map((q) => {
        const qData = q.M;
        return {
          romanianWord: qData.romanianWord.S,
          answers: qData.answers.L.map((a) => a.S),
          correctAnswer: qData.correctAnswer.S,
        };
      });

      setQuestions(parsedQuestions);
      spawnStar();
    } catch (error) {
      console.error("Error fetching questions:", error);
    }
  };

  const spawnStar = () => {
    setShowQuestion(false);
    const top = Math.random() * (screen.height - 200);
    const left = Math.random() * (screen.width - 100);
    setStarPosition({ top, left });
  };

  const handleAnswer = (answer) => {
    const currentQuestion = questions[current];
    if (!currentQuestion) return;
    const correct = currentQuestion.correctAnswer;

    if (answer === correct) {
      animateExplosion("#fdd835"); // yellow glitter
    } else {
      animateExplosion("#ef5350"); // red glitter
      setLives((prev) => prev - 1);
    }

    setTimeout(() => {
      const next = current + 1;
      const updatedLives = lives - (answer !== correct ? 1 : 0);

      if (updatedLives <= 0) {
        Alert.alert("Oh no!", "You lost all your hearts :(", [
          { text: "Back to Levels", onPress: () => navigation.goBack() }
        ]);
      } else if (next >= questions.length) {
        Alert.alert("Congrats!", "You unlocked the next level!", [
          { text: "Back to Levels", onPress: () => navigation.goBack() }
        ]);
      } else {
        setCurrent(next);
        spawnStar();
      }
    }, 800);
  };

  const animateExplosion = (color) => {
    explosionAnim.setValue(0);
    Animated.timing(explosionAnim, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start(() => {
      explosionAnim.setValue(0);
      fadeAnim.setValue(1);
    });
  };

  const glitterStyle = explosionAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 2]
  });

  return (
    <NavigationBar>
      <SafeAreaView style={styles.container}>
        <View style={styles.livesContainer}>
          {[...Array(3)].map((_, i) => (
            <Ionicons
              key={i}
              name="heart"
              size={24}
              color={i < lives ? "red" : "gray"}
              style={styles.heartIcon}
            />
          ))}
        </View>

        {!showQuestion ? (
          <Animated.View
            style={[styles.star, starPosition, { transform: [{ scale: glitterStyle }] }]}
          >
            <TouchableOpacity onPress={() => setShowQuestion(true)}>
              <Ionicons name="star" size={60} color="#ba68c8" style={styles.glitterStar} />
            </TouchableOpacity>
          </Animated.View>
        ) : (
          <Animated.View style={{ opacity: fadeAnim }}>
            <Text style={styles.word}>{questions[current]?.romanianWord || "Loading..."}</Text>
            {questions[current]?.answers?.map((a, i) => (
              <TouchableOpacity key={i} style={styles.answerButton} onPress={() => handleAnswer(a)}>
                <Text style={styles.answerText}>{a}</Text>
              </TouchableOpacity>
            ))}
          </Animated.View>
        )}
      </SafeAreaView>
    </NavigationBar>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#a566c2",
    paddingTop: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  livesContainer: {
    flexDirection: "row",
    position: "absolute",
    top: 20,
    left: 20,
  },
  heartIcon: {
    marginRight: 5,
  },
  star: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
  },
  glitterStar: {
    shadowColor: "#fff",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 10,
    elevation: 10,
  },
  word: {
    fontSize: 28,
    color: "white",
    marginBottom: 20,
    textAlign: "center",
  },
  answerButton: {
    backgroundColor: "#fbe9e7",
    padding: 15,
    marginVertical: 10,
    borderRadius: 8,
    width: 300,
    alignItems: "center",
  },
  answerText: {
    fontSize: 18,
    color: "#333",
  },
});

export default GamePage;
