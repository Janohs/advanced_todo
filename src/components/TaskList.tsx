"use client";

import { useState } from 'react';
import { CompositeTask, TaskComponent } from '@/types/Task';
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@/components/ui/accordion";

interface TaskListProps {
  tasks: TaskComponent[];
  onAddSubtask: (parentTaskId: string, title: string, description: string) => Promise<void>;
}

export function TaskList({ tasks, onAddSubtask }: TaskListProps) {
  const [expandedTasks, setExpandedTasks] = useState<string[]>([]);

  const toggleTaskCompletion = async (task: TaskComponent) => {
    await task.toggleComplete();
  };

  const renderTask = (task: TaskComponent) => {
    const hasChildren = task instanceof CompositeTask && task.getChildren().length > 0;

    return (
      <AccordionItem value={task.id} key={task.id}>
        <AccordionTrigger>
          <div className="flex items-center space-x-2">
            <Checkbox
              checked={task.isComplete}
              onCheckedChange={() => toggleTaskCompletion(task)}
            />
            <span>{task.title}</span>
          </div>
        </AccordionTrigger>
        <AccordionContent>
          <p>{task.description}</p>
          {hasChildren && (
            <div className="ml-4 mt-2">
              {task.getChildren().map(renderTask)}
            </div>
          )}
          <Button
            onClick={() => {/* Implement add subtask logic */ }}
            className="mt-2"
          >
            Add Subtask
          </Button>
        </AccordionContent>
      </AccordionItem>
    );
  };

  return (
    <Accordion type="multiple">
      {tasks.map(renderTask)}
    </Accordion>
  );
}