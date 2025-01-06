"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Exercise, EXERCISE_LIST, Workout } from "@/types/workout";
import { formatDuration, getWorkouts, saveWorkout } from "@/utils/workout";

export default function Home() {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [currentWorkout, setCurrentWorkout] = useState<Workout | null>(null);
  const [showExerciseList, setShowExerciseList] = useState(false);
  const [timer, setTimer] = useState("0:00");

  useEffect(() => {
    setWorkouts(getWorkouts());
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (currentWorkout) {
      interval = setInterval(() => {
        setTimer(formatDuration(currentWorkout.startTime));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [currentWorkout]);

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

  const addExercise = (exerciseName: string) => {
    if (!currentWorkout) return;

    const newExercise: Exercise = {
      name: exerciseName,
      sets: Array(3).fill({ reps: 0, weight: 0 }),
    };

    setCurrentWorkout({
      ...currentWorkout,
      exercises: [...currentWorkout.exercises, newExercise],
    });
    setShowExerciseList(false);
  };

  const updateSet = (
    exerciseIndex: number,
    setIndex: number,
    field: "reps" | "weight",
    value: number
  ) => {
    if (!currentWorkout) return;

    const updatedExercises = [...currentWorkout.exercises];
    const sets = [...updatedExercises[exerciseIndex].sets];
    sets[setIndex] = { ...sets[setIndex], [field]: value };
    updatedExercises[exerciseIndex] = {
      ...updatedExercises[exerciseIndex],
      sets,
    };

    setCurrentWorkout({
      ...currentWorkout,
      exercises: updatedExercises,
    });
  };

  const addSet = (exerciseIndex: number) => {
    if (!currentWorkout) return;

    const updatedExercises = [...currentWorkout.exercises];
    updatedExercises[exerciseIndex].sets.push({ reps: 0, weight: 0 });

    setCurrentWorkout({
      ...currentWorkout,
      exercises: updatedExercises,
    });
  };

  const completeWorkout = () => {
    if (!currentWorkout) return;

    const completedWorkout = {
      ...currentWorkout,
      endTime: new Date().toISOString(),
      duration: timer,
    };

    saveWorkout(completedWorkout);
    setWorkouts(getWorkouts());
    setCurrentWorkout(null);
  };

  return (
    <main className="container mx-auto p-4 max-w-3xl">
      <h1 className="text-3xl font-bold mb-6">Workout Tracker</h1>

      {!currentWorkout ? (
        <div className="space-y-6">
          <Button onClick={startWorkout}>Start Workout</Button>

          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Previous Workouts</h2>
            {workouts.map((workout) => (
              <Card key={workout.id}>
                <CardHeader>
                  <CardTitle>
                    Workout - {new Date(workout.startTime).toLocaleDateString()}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Duration: {workout.duration}</p>
                  <div className="mt-2">
                    {workout.exercises.map((exercise, i) => (
                      <div key={i} className="mt-2">
                        <p className="font-medium">{exercise.name}</p>
                        <div className="text-sm text-gray-600">
                          {exercise.sets.map((set, j) => (
                            <span key={j} className="mr-4">
                              Set {j + 1}: {set.reps} reps @ {set.weight}kg
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold">Current Workout</h2>
            <div className="text-xl font-mono">{timer}</div>
          </div>

          <Button onClick={() => setShowExerciseList(true)}>
            Add Exercise
          </Button>

          <ScrollArea className="h-[60vh]">
            {currentWorkout.exercises.map((exercise, exerciseIndex) => (
              <Card key={exerciseIndex} className="mb-4">
                <CardHeader>
                  <CardTitle>{exercise.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {exercise.sets.map((set, setIndex) => (
                      <div key={setIndex} className="flex gap-4 items-center">
                        <span className="w-16">Set {setIndex + 1}</span>
                        <Input
                          type="number"
                          placeholder="Reps"
                          value={set.reps || ""}
                          onChange={(e) =>
                            updateSet(
                              exerciseIndex,
                              setIndex,
                              "reps",
                              Number(e.target.value)
                            )
                          }
                          className="w-24"
                        />
                        <Input
                          type="number"
                          placeholder="Weight (kg)"
                          value={set.weight || ""}
                          onChange={(e) =>
                            updateSet(
                              exerciseIndex,
                              setIndex,
                              "weight",
                              Number(e.target.value)
                            )
                          }
                          className="w-24"
                        />
                      </div>
                    ))}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => addSet(exerciseIndex)}
                    >
                      Add Set
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </ScrollArea>

          <Button onClick={completeWorkout} className="w-full">
            Complete Workout
          </Button>
        </div>
      )}

      <Dialog open={showExerciseList} onOpenChange={setShowExerciseList}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Select Exercise</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-2">
            {EXERCISE_LIST.map((exercise) => (
              <Button
                key={exercise}
                variant="outline"
                onClick={() => addExercise(exercise)}
              >
                {exercise}
              </Button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </main>
  );
}
