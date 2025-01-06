"use client";

import { Button } from "@/components/ui/button";
import { Workout } from "@/types/workout";

interface WorkoutHeaderProps {
  currentWorkout: Workout | null;
  startWorkout: () => void;
}

export function WorkoutHeader({
  currentWorkout,
  startWorkout,
}: WorkoutHeaderProps) {
  return (
    <div className="flex gap-6 flex-col mb-6">
      <h1 className="text-3xl font-bold">Workout Tracker</h1>

      {!currentWorkout && (
        <div className="space-y-6">
          <Button onClick={startWorkout} size="lg" className="w-full">
            Start Workout
          </Button>
        </div>
      )}
    </div>
  );
}
