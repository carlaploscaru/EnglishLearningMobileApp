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
import ConfettiCannon from 'react-native-confetti-cannon';
import LevelCompleteModal from "../components/LevelCompleteModal";
import { getCurrentUser } from 'aws-amplify/auth';
import LinearGradient from "react-native-linear-gradient";

const screen = Dimensions.get("window");

const GamePage = ({ route, navigation }) => {
  const { categoryKey, levelId } = route.params || {};
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [showQuestion, setShowQuestion] = useState(false);
  const [starPosition, setStarPosition] = useState({ top: 0, left: 0 });
  const [lives, setLives] = useState(3);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [answerStatus, setAnswerStatus] = useState(null); // 'correct' | 'wrong' | null
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const explosionAnim = useRef(new Animated.Value(0)).current;
  const starScale = useRef(new Animated.Value(0)).current;
  const starOpacity = useRef(new Animated.Value(0)).current;
  const [showConfetti, setShowConfetti] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [levelName, setLevelName] = useState(0);
  

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
        (lvl) => lvl.level === levelId && lvl.category === categoryKey,
       
      );
      setLevelName(levelId);

      if (!level || !level.questions) {
        console.warn("No level or questions found.");
        return;
      }

      if (categoryKey==="verbs" || categoryKey==="vocabulary"){
      const parsedQuestions = level.questions.map((q) => {
        const qData = q.M;
        return {
          romanianWord: qData.romanianWord.S,
          answers: qData.answers.L.map((a) => a.S),
          correctAnswer: qData.correctAnswer.S,
          type: qData.type.S
        };
      });
      setQuestions(parsedQuestions);
     } else 
      if(categoryKey==="sentences") {
       const parsedQuestions = level.questions.map((q) => {
        const qData = q.M;
        return {
          sentence: qData.sentence.S,
          answerSentence: qData.answerSentence.S,
          type: qData.type.S
        };
      });
      setQuestions(parsedQuestions);
     }

      
      spawnStar();
    } catch (error) {
      console.error("Error fetching questions:", error);
    }
  };

  const spawnStar = () => {
    setShowQuestion(false);
    setSelectedAnswer(null);
    setAnswerStatus(null);
    const top = Math.random() * (screen.height - 400);
    const left = Math.random() * (screen.width - 200);
    setStarPosition({ top, left });

    starScale.setValue(0);
    starOpacity.setValue(0);
    Animated.parallel([
      Animated.timing(starScale, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(starOpacity, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      })
    ]).start();
  };

  const handleAnswer = (answer) => {
    const currentQuestion = questions[current];
    if (!currentQuestion || selectedAnswer !== null) return;

    setSelectedAnswer(answer);
    const isCorrect = answer === currentQuestion.correctAnswer;
    setAnswerStatus(isCorrect ? 'correct' : 'wrong');

    if (isCorrect) {
      setShowConfetti(true);
      animateExplosion("#fdd835");

      setTimeout(() => setShowConfetti(false), 1000);

      setTimeout(() => {
        const next = current + 1;
        if (next >= questions.length) {
          setModalVisible(true);
          ////////////////////////////////////////////////////////////////////////////////////
      const sendProgressUpdate = async () => {
        try {
          const user = await getCurrentUser();
          const userId = user.username;

          const res = await fetch(`${API_URL}?user_id=${userId}&category=${categoryKey}&new_level=${levelId + 1}&xp_gain=20`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json'
            },
          });
          const data = await res.json();
          console.log("Lambda response:", data); // ✅ Add this too
        } catch (error) {
          console.error('Failed to update user progress:', error);
        }
      };
    
      sendProgressUpdate();

////////////////////////////////////////////////////////////////////////////
        } else {
          setCurrent(next);
          spawnStar();
        }
      }, 2000);
    } else {
      animateExplosion("#ef5350");
      setLives((prev) => prev - 1);
      setTimeout(() => {
        setSelectedAnswer(null);
        setAnswerStatus(null);
        if (lives - 1 <= 0) {
          Alert.alert("Oh no!", "You lost all hearts :(", [
            { text: "Back to Levels", onPress: () => navigation.goBack() }
          ]);
        }
      }, 2000);
    }
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

  return (
    <NavigationBar>
      <SafeAreaView style={styles.container}>
      <LinearGradient
          colors={["white", "transparent"]}
          style={{ position: "absolute", top: 0, left: 0, right: 0, height: 60 }}
        />
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

        <Text style={styles.LevelNameText}>Level{levelName} </Text>

        <Animated.View
          style={[styles.starContainer, starPosition, {
            transform: [{ scale: starScale }],
            opacity: starOpacity,
          }]}
        >
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => setShowQuestion(true)}
            style={styles.bigStarTouchable}
          >
            <Ionicons name="star" size={240} color="#0000FF" style={styles.bigStar} />

          
            {showQuestion && questions[current] && questions[current].type=="fill-in" && (
              <View style={styles.questionWrapper}>
                <Text style={styles.wordInsideStar}>{questions[current].sentence}</Text>
                {questions[current].answerSentence==1 &&(
                  <TouchableOpacity
                    key={i}
                    onPress={() => handleAnswer(a)}
                  >
                  </TouchableOpacity>
                )}
              </View>
            )}

            {showQuestion && questions[current] && questions[current].type=="multiple-choice" && (
              <View style={styles.questionWrapper}>
                <Text style={styles.wordInsideStar}>{questions[current].romanianWord}</Text>
                {questions[current].answers.map((a, i) => (
                  <TouchableOpacity
                    key={i}
                    onPress={() => handleAnswer(a)}
                    style={[styles.answerButtonInside, {
                      borderColor: a === selectedAnswer ? (answerStatus === 'correct' ? 'green' : 'red') : 'black',
                      backgroundColor: a === selectedAnswer ? (answerStatus === 'correct' ? '#c8e6c9' : '#ffcdd2') : 'white'
                    }]}
                  >
                    <Text style={styles.answerText}>{a}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}


          </TouchableOpacity>
        </Animated.View>
        <LevelCompleteModal
        visible={modalVisible}
        onClose={() => {
          setModalVisible(false);
          navigation.goBack({ categoryKey }); 
        }}
      />

        {showConfetti && (
          <ConfettiCannon
            count={100}
            origin={{ x: screen.width / 2, y: screen.height / 1 }}
            fadeOut
            explosionSpeed={700}
          />
        )}
      </SafeAreaView>
    </NavigationBar>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#966fd6",
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
  LevelNameText: {
    flexDirection: "row",
    position: "absolute",
    top: 10,
    left: 170,
    fontSize:25
  },
  starContainer: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
  },
  bigStarTouchable: {
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  bigStar: {
    shadowColor: "black",
    shadowOpacity: 1,
    shadowRadius: 50,
    elevation: 10,
  },
  questionWrapper: {
    position: "absolute",
    top: 40,
    width: 200,
    alignItems: "center",
  },
  wordInsideStar: {
    fontSize: 20,
    color: "white",
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  answerButtonInside: {
    borderWidth: 2,
    padding: 10,
    marginVertical: 5,
    borderRadius: 10,
    width: "100%",
    alignItems: "center",
  },
  answerText: {
    fontSize: 16,
    color: "#333",
  },
});

export default GamePage;