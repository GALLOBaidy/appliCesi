export type UserExercice = {
  id: number;
  userId: number | null;
  exerciceId: number;
  exerciceTitle: string;
  guestId: string | null;
  feeling: "good" | "neutral" | "bad" | "anxious" | "relaxed";
  dateCompletion: string;
};
