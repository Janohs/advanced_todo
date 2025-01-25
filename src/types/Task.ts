import { PrismaClient } from "@prisma/client";

/**
 * Task Management System using Composite and Factory Design Patterns
 * - Composite Pattern: Allows creation of tree structures of tasks and subtasks
 * - Factory Pattern: Manages creation of different task types
 * - Prisma Integration: Handles persistence layer
 */

/**
 * Tag Interface - Represents task categories/labels
 */
export interface Tag {
  id: string;
  name: string;
  color: string;
}

/**
 * TaskComponent Interface - Base contract for Composite Pattern
 * Implemented by both TaskLeaf (individual tasks) and CompositeTask (task with subtasks)
 */
export interface TaskComponent {
  id: string;
  title: string;
  description: string;
  isComplete: boolean;
  tags?: Tag[];
  display(): string;
  toggleComplete(): Promise<void>;
}

/**
 * TaskLeaf Class - Represents individual tasks (Leaf nodes in Composite Pattern)
 * Handles single task operations and persistence
 */
export class TaskLeaf implements TaskComponent {
  constructor(
    public id: string,
    public title: string,
    public description: string,
    public isComplete: boolean = false
  ) {}

  /**
   * Toggles task completion status and persists to database
   */
  async toggleComplete(): Promise<void> {
    const prisma = new PrismaClient();
    this.isComplete = !this.isComplete;
    await prisma.task.update({
      where: { id: this.id },
      data: { isComplete: this.isComplete },
    });
  }

  /**
   * Displays task status using checkbox notation
   * ✓ = complete, □ = incomplete
   */
  display(): string {
    const status = this.isComplete ? "✓" : "□";
    return `${status} ${this.title}: ${this.description}`;
  }
}

/**
 * CompositeTask Class - Represents tasks that can contain subtasks
 * Implements Composite Pattern to create task hierarchies
 */
export class CompositeTask implements TaskComponent {
  // Contains child tasks (both TaskLeaf and CompositeTask)
  private tasks: TaskComponent[] = [];

  constructor(
    public id: string,
    public title: string,
    public description: string,
    public isComplete: boolean = false,
    public tags: Tag[] = []
  ) {}

  async toggleComplete(): Promise<void> {
    const prisma = new PrismaClient();
    this.isComplete = !this.isComplete;

    // Update all children tasks
    for (const task of this.tasks) {
      await task.toggleComplete();
    }

    await prisma.task.update({
      where: { id: this.id },
      data: { isComplete: this.isComplete },
    });
  }

  async add(task: TaskComponent): Promise<void> {
    const prisma = new PrismaClient();
    await prisma.task.update({
      where: { id: task.id },
      data: { parentId: this.id },
    });
    this.tasks.push(task);
  }

  async remove(taskId: string): Promise<void> {
    const prisma = new PrismaClient();
    await prisma.task.update({
      where: { id: taskId },
      data: { parentId: null },
    });
    this.tasks = this.tasks.filter((task) => task.id !== taskId);
  }

  getChildren(): TaskComponent[] {
    return [...this.tasks];
  }

  display(): string {
    const status = this.isComplete ? "✓" : "□";
    const childrenDisplay = this.tasks
      .map((task) => task.display())
      .join("\n  ");
    return `${status} ${this.title}: ${this.description}\n  ${childrenDisplay}`;
  }
}

export class TaskFactory {
  private static instance: TaskFactory;
  private prisma: PrismaClient;

  private constructor() {
    this.prisma = new PrismaClient();
  }

  public static getInstance(): TaskFactory {
    if (!TaskFactory.instance) {
      TaskFactory.instance = new TaskFactory();
    }
    return TaskFactory.instance;
  }

  async createTag(name: string, color: string): Promise<Tag> {
    return await this.prisma.tag.create({
      data: { name, color },
    });
  }

  async createCompositeTask(
    title: string,
    description: string,
    parentId?: string,
    tags?: string[]
  ): Promise<TaskComponent> {
    const task = await this.prisma.task.create({
      data: {
        title,
        description,
        parentId,
        tags: tags
          ? {
              connect: tags.map((id) => ({ id })),
            }
          : undefined,
      },
      include: {
        children: true,
        tags: true,
      },
    });

    return new CompositeTask(
      task.id,
      task.title,
      task.description,
      task.isComplete,
      task.tags
    );
  }

  async getTaskWithChildren(taskId: string): Promise<TaskComponent> {
    const task = await this.prisma.task.findUnique({
      where: { id: taskId },
      include: {
        children: true,
        tags: true,
      },
    });

    if (!task) throw new Error("Task not found");

    const composite = new CompositeTask(
      task.id,
      task.title,
      task.description,
      task.isComplete,
      task.tags
    );

    // Recursively add children
    for (const child of task.children) {
      const childTask = await this.getTaskWithChildren(child.id);
      composite.add(childTask);
    }

    return composite;
  }
}
