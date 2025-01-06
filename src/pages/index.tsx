"use client";

import { useState, useEffect } from "react";
import { Workout } from "@/types/workout";
import { getWorkouts, saveWorkout, deleteWorkout } from "@/utils/workout";
import { CurrentWorkout } from "@/components/app/CurrentWorkout";
import { WorkoutHeader } from "@/components/app/WorkoutHeader";
import { PreviousWorkouts } from "@/components/app/PreviousWorkouts";

export default function Home() {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [currentWorkout, setCurrentWorkout] = useState<Workout | null>(null);

  useEffect(() => {
    setWorkouts(getWorkouts());
  }, []);

  const startWorkout = () => {
    const newWorkout: Workout = {
      id: Date.now().toString(),
      startTime: new Date().toISOString(),
      endTime: "",
      duration: "",
      exercises: [],
    };
    setCurrentWorkout(newWorkout);
  };

  const completeWorkout = () => {
    if (!currentWorkout) return;

    const completedWorkout = {
      ...currentWorkout,
      endTime: new Date().toISOString(),
    };

    saveWorkout(completedWorkout);
    setWorkouts(getWorkouts());
    setCurrentWorkout(null);
  };

  const handleDeleteWorkout = (workoutId: string) => {
    const updatedWorkouts = deleteWorkout(workoutId);
    setWorkouts(updatedWorkouts);
  };

  return (
    <main className="container mx-auto p-4 max-w-3xl min-h-screen flex flex-col">
      <WorkoutHeader
        currentWorkout={currentWorkout}
        startWorkout={startWorkout}
      />

      {!currentWorkout ? (
        <PreviousWorkouts
          workouts={workouts}
          onDeleteWorkout={handleDeleteWorkout}
        />
      ) : (
        <CurrentWorkout
          currentWorkout={currentWorkout}
          setCurrentWorkout={setCurrentWorkout}
          completeWorkout={completeWorkout}
        />
      )}
    </main>
  );
}
