import { SafeAreaView } from "react-native-safe-area-context";
import { Text, View, TouchableOpacity, Animated, Easing } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { getOneGame } from "../../../src/api/routes";

export default function ExerciseDetail() {
  const { id } = useLocalSearchParams();
  const [game, setGame] = useState<any>(null);

  const [phase, setPhase] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [cycleLeft, setCycleLeft] = useState<number>(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  const timerRef = useRef<any>(null);

  // Animation cercle
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const animateCircle = (to: number, duration: number) => {
    Animated.timing(scaleAnim, {
      toValue: to,
      duration: duration * 1000,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: true,
    }).start();
  };

  useEffect(() => {
    async function load() {
      const response = await getOneGame(id);
      setGame(response.data);
    }
    load();
  }, [id]);

  const stopExercise = () => {
    clearInterval(timerRef.current);
    setIsRunning(false);
    setPhase(null);
    setTimeLeft(0);
    setCycleLeft(0);
    setIsFinished(false);
    scaleAnim.setValue(1);
  };

  const startExercise = () => {
    if (!game) return;

    setIsRunning(true);
    setIsFinished(false);
    setCycleLeft(game.cycle);

    runCycle(game);
  };

  const runCycle = (game: any) => {
    // Inspiration
    setPhase("Inspiration");
    setTimeLeft(game.inhalationDuration);
    animateCircle(1.4, game.inhalationDuration);

    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current);

          if (game.holdDuration > 0) {
            runHold(game);
          } else {
            runExhale(game);
          }
        }
        return t - 1;
      });
    }, 1000);
  };

  const runHold = (game: any) => {
    setPhase("Blocage");
    setTimeLeft(game.holdDuration);
    animateCircle(1.4, game.holdDuration);

    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current);
          runExhale(game);
        }
        return t - 1;
      });
    }, 1000);
  };

  function handleCycleEnd(game: any) {
    setCycleLeft((c) => {
      if (c <= 1) {
        setPhase("Terminé");
        setIsRunning(false);
        setIsFinished(true);
        animateCircle(1, 1);
        return 0;
      }

      runCycle(game);
      return c - 1;
    });
  }

  const runExhale = (game: any) => {
    setPhase("Expiration");
    setTimeLeft(game.exhalationDuration);
    animateCircle(0.8, game.exhalationDuration);

    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current);

          handleCycleEnd(game);
        }
        return t - 1;
      });
    }, 1000);
  };

  if (!game) return null;

  // Gestion du texte du bouton pour lancer l'exo
  let mainButtonLabel;

  switch (true) {
    case isFinished:
      mainButtonLabel = "Recommencer";
      break;
    case isRunning:
      mainButtonLabel = "Arrêter";
      break;
    default:
      mainButtonLabel = "Commencer";
  }

  // Gestion de l'action du bouton
  let mainButtonAction;

  switch (true) {
    case isFinished:
      mainButtonAction = () => {
        stopExercise();
        startExercise();
      };
      break;

    case isRunning:
      mainButtonAction = stopExercise;
      break;

    default:
      mainButtonAction = startExercise;
  }

  return (
    <SafeAreaView style={{ flex: 1, padding: 20 }}>
      {/* Header */}
      <View style={{ padding: 10, flexDirection: "row", alignItems: "center" }}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={{ fontSize: 20, fontWeight: "bold" }}>← Retour</Text>
        </TouchableOpacity>
      </View>

      {/* Titre */}
      <Text style={{ fontSize: 30, fontWeight: "700", marginTop: 10 }}>
        {game.title}
      </Text>
      <Text style={{ marginTop: 10, color: "#666", fontSize: 16 }}>
        {game.description}
      </Text>

      {/* Bouton */}
      <TouchableOpacity
        onPress={mainButtonAction}
        style={{
          marginTop: 30,
          backgroundColor: isRunning ? "#E74C3C" : "#4A90E2",
          padding: 15,
          borderRadius: 10,
        }}
      >
        <Text style={{ color: "white", textAlign: "center", fontSize: 18 }}>
          {mainButtonLabel}
        </Text>
      </TouchableOpacity>

      {/* Zone exercice */}
      {!!phase && (
        <View style={{ marginTop: 40, alignItems: "center" }}>
          <Animated.View
            style={{
              width: 180,
              height: 180,
              borderRadius: 100,
              backgroundColor: "#4A90E220",
              justifyContent: "center",
              alignItems: "center",
              transform: [{ scale: scaleAnim }],
            }}
          >
            <Text style={{ fontSize: 26, fontWeight: "600" }}>{phase}</Text>
            <Text style={{ fontSize: 50, marginTop: 10 }}>{timeLeft}</Text>
          </Animated.View>

          <Text style={{ marginTop: 20, color: "#666", fontSize: 16 }}>
            Cycles restants : {cycleLeft}
          </Text>
          {/* 🔥 Bouton Terminé sous le cercle */}
          {isFinished && (
            <TouchableOpacity
              onPress={() => router.push(`/exercises/${id}/feeling`)}
              style={{
                marginTop: 25,
                backgroundColor: "#2ECC71",
                paddingVertical: 12,
                paddingHorizontal: 25,
                borderRadius: 10,
              }}
            >
              <Text style={{ color: "white", fontSize: 18, fontWeight: "600" }}>
                Terminé
              </Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </SafeAreaView>
  );
}
