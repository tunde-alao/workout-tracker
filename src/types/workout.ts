export type Set = {
  reps: number;
  weight: number;
};

export type Exercise = {
  name: string;
  sets: Set[];
};

export type Workout = {
  id: string;
  startTime: string;
  endTime: string;
  duration: string;
  exercises: Exercise[];
};

export const EXERCISE_LIST = [
  "Bench Press",
  "Squat",
  "Deadlift",
  "Shoulder Press",
  "Bent Over Row",
  "Pull Ups",
  "Push Ups",
  "Bicep Curls",
  "Tricep Extensions",
  "Leg Press",
] as const;
