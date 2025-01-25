"use client";

import { useState, useEffect } from 'react';
import { TaskFactory } from '@/components/TaskFactory';
import { TaskComponent } from '@/types/Task';
import { CreateTaskForm } from '@/components/CreateTaskForm';
import { TaskList } from '@/components/TaskList';

export default function TaskManagementPage() {
  const [tasks, setTasks] = useState<TaskComponent[]>([]);
  const factory = TaskFactory.getInstance();

  useEffect(() => {
    async function loadTasks() {
      try {
        // Load root-level tasks
        const rootTasks = await factory.getRootTasks();
        setTasks(rootTasks);
      } catch (error) {
        console.error('Failed to load tasks', error);
      }
    }
    loadTasks();
  }, []);

  const handleCreateTask = async (title: string, description: string, tags?: string[]) => {
    const newTask = await factory.createCompositeTask(title, description, undefined, tags);
    setTasks([...tasks, newTask]);
  };

  const handleAddSubtask = async (parentTaskId: string, title: string, description: string) => {
    const parentTask = await factory.getTaskWithChildren(parentTaskId);
    const subtask = await factory.createCompositeTask(title, description, parentTaskId);
    await parentTask.add(subtask);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Task Management</h1>
      <CreateTaskForm onCreateTask={handleCreateTask} />
      <TaskList
        tasks={tasks}
        onAddSubtask={handleAddSubtask}
      />
    </div>
  );
}