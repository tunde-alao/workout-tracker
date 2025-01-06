export interface Set {
  reps: number;
  weight: number;
}

export interface Exercise {
  name: string;
  sets: Set[];
}

export interface Workout {
  id: string;
  startTime: string;
  endTime: string;
  duration: string;
  exercises: Exercise[];
}
