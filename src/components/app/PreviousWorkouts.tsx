"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Workout } from "@/types/workout";
import { Trash2, Dumbbell } from "lucide-react";

interface PreviousWorkoutsProps {
  workouts: Workout[];
  onDeleteWorkout: (workoutId: string) => void;
}

export function PreviousWorkouts({
  workouts,
  onDeleteWorkout,
}: PreviousWorkoutsProps) {
  return (
    <div className="space-y-6 flex-grow">
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
                      onDeleteWorkout(workout.id);
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
  );
}
