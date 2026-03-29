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

  const timerRef = useRef<number | null>(null);
  const phaseIdRef = useRef(0);
  const endTimeRef = useRef<number | null>(null);

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
    let mounted = true;
    async function load() {
      const idValue = Array.isArray(id) ? id[0] : id;
      const numId = typeof idValue === 'string' ? Number.parseInt(idValue, 10) : idValue;
      const response = await getOneGame(numId);
      if (!mounted) return;
      setGame(response.data);
    }
    load();
    return () => {
      mounted = false;
    };
  }, [id]);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const clearTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    endTimeRef.current = null;
  };

  const stopExercise = () => {
    clearTimer();
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
    setCycleLeft(game.cycle ?? 0);

    runCycle(game);
  };

  function startPhase({
    label,
    duration,
    animationScale,
    next,
  }: {
    label: string;
    duration: number;
    animationScale: number;
    next: () => void;
  }) {
    // incrémente l'id de phase pour invalider les anciens timers
    phaseIdRef.current += 1;
    const currentPhaseId = phaseIdRef.current;

    clearTimer();

    setPhase(label);

    // si duration <= 0 on appelle next immédiatement
    if (!duration || duration <= 0) {
      setTimeLeft(0);
      animateCircle(animationScale, Math.max(0.5, 0.5));
      // petit délai pour laisser l'UI se mettre à jour
      setTimeout(() => {
        // si l'id a changé, on n'appelle pas next
        if (phaseIdRef.current !== currentPhaseId) return;
        next();
      }, 50);
      return;
    }

    setTimeLeft(duration);
    animateCircle(animationScale, duration);

    // calcule endTime et démarre un seul interval qui lit l'heure
    endTimeRef.current = Date.now() + duration * 1000;

    timerRef.current = setInterval(() => {
      // si la phase a changé, on stoppe ce timer
      if (phaseIdRef.current !== currentPhaseId) {
        clearTimer();
        return;
      }

      const now = Date.now();
      const remainingMs = (endTimeRef.current ?? now) - now;
      const remainingSec = Math.max(0, Math.ceil(remainingMs / 1000));
      setTimeLeft(remainingSec);

      if (remainingSec <= 0) {
        // verrouille et appelle next
        clearTimer();
        // protège contre double appel si next déclenche une nouvelle phase immédiatement
        if (phaseIdRef.current === currentPhaseId) {
          next();
        }
      }
    }, 200); // 200ms pour une UI réactive sans surcharger le CPU
  }

  const runCycle = (game: any) => {
    startPhase({
      label: "Inspiration",
      duration: game.inhalationDuration,
      animationScale: 1.4,
      next: () => {
        if (game.holdDuration > 0) {
          runHold(game);
        } else {
          runExhale(game);
        }
      },
    });
  };

  const runHold = (game: any) => {
    startPhase({
      label: "Blocage",
      duration: game.holdDuration,
      animationScale: 1.4,
      next: () => runExhale(game),
    });
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

      // lance le cycle suivant
      runCycle(game);
      return c - 1;
    });
  }

  const runExhale = (game: any) => {
    startPhase({
      label: "Expiration",
      duration: game.exhalationDuration,
      animationScale: 0.8,
      next: () => handleCycleEnd(game),
    });
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
          {/*  Bouton Terminé sous le cercle */}
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
