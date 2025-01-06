import { Workout } from "@/types/workout";

const WORKOUTS_KEY = "workouts";

export const saveWorkout = (workout: Workout) => {
  const workouts = getWorkouts();
  workouts.push(workout);
  sessionStorage.setItem(WORKOUTS_KEY, JSON.stringify(workouts));
};

export const getWorkouts = (): Workout[] => {
  const workouts = sessionStorage.getItem(WORKOUTS_KEY);
  return workouts ? JSON.parse(workouts) : [];
};

export const deleteWorkout = (workoutId: string) => {
  const workouts = getWorkouts();
  const filteredWorkouts = workouts.filter((w) => w.id !== workoutId);
  sessionStorage.setItem(WORKOUTS_KEY, JSON.stringify(filteredWorkouts));
  return filteredWorkouts;
};

export const formatDuration = (startTime: string): string => {
  const start = new Date(startTime).getTime();
  const now = new Date().getTime();
  const diff = now - start;
  
  const minutes = Math.floor(diff / 60000);
  const seconds = Math.floor((diff % 60000) / 1000);
  
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};
