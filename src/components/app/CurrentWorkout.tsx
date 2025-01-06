"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Exercise, Workout } from "@/types/workout";
import { formatDuration } from "@/utils/workout";
import { Trash2, Check } from "lucide-react";
import { ExerciseSelector } from "@/components/exercise-selector";
import exerciseData from "@/lib/exercise.json";

interface CurrentWorkoutProps {
  currentWorkout: Workout;
  setCurrentWorkout: (workout: Workout | null) => void;
  completeWorkout: () => void;
}

export function CurrentWorkout({
  currentWorkout,
  setCurrentWorkout,
  completeWorkout,
}: CurrentWorkoutProps) {
  const [showExerciseList, setShowExerciseList] = useState(false);
  const [timer, setTimer] = useState("0:00");

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (currentWorkout) {
      interval = setInterval(() => {
        const duration = formatDuration(currentWorkout.startTime);
        setTimer(duration);
        setCurrentWorkout({
          ...currentWorkout,
          duration,
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [currentWorkout]);

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

  return (
    <div className="space-y-4 flex-grow flex flex-col">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Current Workout</h2>
        <div className="text-xl font-mono">{timer}</div>
      </div>

      <Button onClick={() => setShowExerciseList(true)} className="w-full">
        Add Exercise
      </Button>

      <ScrollArea className="flex-grow">
        {currentWorkout.exercises.map((exercise, exerciseIndex) => (
          <Card key={exerciseIndex} className="mb-4">
            <CardContent className="p-4">
              <h3 className="font-semibold mb-4">{exercise.name}</h3>
              <div className="space-y-3">
                {exercise.sets.map((set, setIndex) => (
                  <div
                    key={setIndex}
                    className="flex gap-4 items-center bg-muted/50 p-3 rounded-lg"
                  >
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
                  className="w-full"
                >
                  Add Set
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </ScrollArea>

      <div className="flex gap-2 mt-auto">
        <Button
          onClick={() => setCurrentWorkout(null)}
          className=""
          variant="ghost"
          size="icon"
        >
          <Trash2 className="h-4 w-4" />
          <span className="sr-only">Cancel Workout</span>
        </Button>
        <Button
          onClick={completeWorkout}
          className="w-full"
          variant="secondary"
        >
          <Check className="h-4 w-4 mr-2" />
          Complete Workout
        </Button>
      </div>

      <Dialog open={showExerciseList} onOpenChange={setShowExerciseList}>
        <DialogContent className="w-11/12 sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Select Exercise</DialogTitle>
          </DialogHeader>
          <div className="flex-1 h-[400px]">
            <ExerciseSelector exercises={exerciseData} onSelect={addExercise} />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
