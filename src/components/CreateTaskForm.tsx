"use client";

import { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";

import { Tag } from '@/types/Task';
import { TaskFactory } from './TaskFactory';

interface CreateTaskFormProps {
    onCreateTask: (title: string, description: string, tags?: string[]) => Promise<void>;
}

export function CreateTaskForm({ onCreateTask }: CreateTaskFormProps) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [availableTags, setAvailableTags] = useState<Tag[]>([]);

    const factory = TaskFactory.getInstance();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await onCreateTask(title, description, selectedTags);

        // Reset form
        setTitle('');
        setDescription('');
        setSelectedTags([]);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <Input
                placeholder="Task Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
            />
            <Input
                placeholder="Task Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
            />
            <Select
                multiple
                value={selectedTags}
                onValueChange={setSelectedTags}
            >
                <SelectTrigger>
                    <SelectValue placeholder="Select Tags" />
                </SelectTrigger>
                <SelectContent>
                    {availableTags.map(tag => (
                        <SelectItem key={tag.id} value={tag.id}>
                            {tag.name}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
            <Button type="submit">Create Task</Button>
        </form>
    );
}