"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

interface ExerciseSelectorProps {
  exercises: any[];
  onSelect: (exerciseName: string) => void;
}

export function ExerciseSelector({
  exercises,
  onSelect,
}: ExerciseSelectorProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredExercises = exercises.filter((exercise) =>
    exercise.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full gap-4">
      <div className="relative">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search exercises..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-8"
        />
      </div>
      <ScrollArea className="flex-1">
        <div className="grid grid-cols-1 gap-2">
          {filteredExercises.slice(0, 20).map((exercise) => (
            <Button
              key={exercise.name}
              variant="outline"
              onClick={() => onSelect(exercise.name)}
              className="justify-start h-auto py-3"
            >
              <div className="text-left">
                <div className="font-medium">{exercise.name}</div>
                <div className="text-xs text-muted-foreground">
                  {exercise.primaryMuscles.join(", ")} • {exercise.level}
                </div>
              </div>
            </Button>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
