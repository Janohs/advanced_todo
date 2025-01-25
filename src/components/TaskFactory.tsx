"use client";

import { TaskComponent, Tag, CompositeTask } from '@/types/Task';

export class TaskFactory {
    private static instance: TaskFactory;

    private constructor() { }

    public static getInstance(): TaskFactory {
        if (!TaskFactory.instance) {
            TaskFactory.instance = new TaskFactory();
        }
        return TaskFactory.instance;
    }

    async createTag(name: string, color: string): Promise<Tag> {
        // Frontend method to create tag (will call API)
        const response = await fetch('/api/tags', {
            method: 'POST',
            body: JSON.stringify({ name, color })
        });
        return await response.json();
    }

    async createCompositeTask(
        title: string,
        description: string,
        parentId?: string,
        tags?: string[]
    ): Promise<TaskComponent> {
        const response = await fetch('/api/tasks', {
            method: 'POST',
            body: JSON.stringify({
                title,
                description,
                parentId,
                tags
            })
        });
        const taskData = await response.json();

        return new CompositeTask(
            taskData.id,
            taskData.title,
            taskData.description,
            taskData.isComplete,
            taskData.tags
        );
    }

    async getTaskWithChildren(taskId: string): Promise<TaskComponent> {
        const response = await fetch(`/api/tasks/${taskId}`);
        const taskData = await response.json();

        const task = new CompositeTask(
            taskData.id,
            taskData.title,
            taskData.description,
            taskData.isComplete,
            taskData.tags
        );

        // Recursively add children
        for (const child of taskData.children) {
            const childTask = await this.getTaskWithChildren(child.id);
            await task.add(childTask);
        }

        return task;
    }

    async getRootTasks(): Promise<TaskComponent[]> {
        const response = await fetch('/api/tasks/root');
        const tasksData = await response.json();

        return Promise.all(
            tasksData.map(async (taskData: any) =>
                await this.getTaskWithChildren(taskData.id)
            )
        );
    }
}