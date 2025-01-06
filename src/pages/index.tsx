"use client";

import { useState, useEffect } from "react";
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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Exercise, Workout } from "@/types/workout";
import {
  formatDuration,
  getWorkouts,
  saveWorkout,
  deleteWorkout,
} from "@/utils/workout";
import { Trash2 } from "lucide-react";
import { ExerciseSelector } from "@/components/exercise-selector";
import exerciseData from "@/lib/exercise.json";
import { X } from "lucide-react";
import { Check } from "lucide-react";
import { Dumbbell } from "lucide-react";

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

  const handleDeleteWorkout = (workoutId: string) => {
    const updatedWorkouts = deleteWorkout(workoutId);
    setWorkouts(updatedWorkouts);
  };

  return (
    <main className="container mx-auto p-4 max-w-3xl min-h-screen flex flex-col">
      <h1 className="text-3xl font-bold mb-6">Workout Tracker</h1>

      {!currentWorkout ? (
        <div className="space-y-6 flex-grow">
          <Button onClick={startWorkout} size="lg" className="w-full">
            Start Workout
          </Button>

          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Previous Workouts</h2>
            {workouts.length === 0 ? (
              <div className="text-center py-8 space-y-3">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                  <Dumbbell className="h-6 w-6 text-muted-foreground" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-semibold">No workouts yet</h3>
                  <p className="text-sm text-muted-foreground">
                    Start your first workout to begin tracking your progress
                  </p>
                </div>
              </div>
            ) : (
              <Accordion type="single" collapsible className="space-y-2">
                {workouts.map((workout) => (
                  <AccordionItem
                    key={workout.id}
                    value={workout.id}
                    className="border rounded-lg px-4"
                  >
                    <div className="flex items-center justify-between">
                      <AccordionTrigger className="hover:no-underline">
                        <div className="flex items-center gap-4">
                          <span className="font-semibold">
                            {new Date(workout.startTime).toLocaleDateString(
                              undefined,
                              {
                                weekday: "long",
                                month: "short",
                                day: "numeric",
                              }
                            )}
                          </span>
                          <span className="text-sm text-muted-foreground">
                            Duration: {workout.duration}
                          </span>
                        </div>
                      </AccordionTrigger>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive/90"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteWorkout(workout.id);
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <AccordionContent>
                      <div className="space-y-4 pt-2">
                        {workout.exercises.map((exercise, i) => (
                          <Card key={i}>
                            <CardContent className="p-4">
                              <h3 className="font-semibold mb-2">
                                {exercise.name}
                              </h3>
                              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                {exercise.sets.map((set, j) => (
                                  <div
                                    key={j}
                                    className="bg-muted/50 rounded-md p-2 text-sm"
                                  >
                                    Set {j + 1}: {set.reps} reps @ {set.weight}
                                    kg
                                  </div>
                                ))}
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            )}
          </div>
        </div>
      ) : (
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
        </div>
      )}

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
    </main>
  );
}
