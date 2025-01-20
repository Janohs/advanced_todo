import React, { useState } from "react";
import { DragDropContext } from "react-beautiful-dnd";
import Stage from "./Stage";

const Board = ({ stages }) => {
  const [tasks, setTasks] = useState({
    "To Do": [{ id: "1", content: "Task 1" }, { id: "2", content: "Task 2" }],
    Doing: [],
    Done: [],
  });

  const onDragEnd = (result) => {
    const { source, destination } = result;

    if (!destination) return;

    const sourceStage = source.droppableId;
    const destStage = destination.droppableId;

    if (sourceStage === destStage) {
      const stageTasks = Array.from(tasks[sourceStage]);
      const [movedTask] = stageTasks.splice(source.index, 1);
      stageTasks.splice(destination.index, 0, movedTask);
      setTasks({ ...tasks, [sourceStage]: stageTasks });
    } else {
      const sourceTasks = Array.from(tasks[sourceStage]);
      const destTasks = Array.from(tasks[destStage]);
      const [movedTask] = sourceTasks.splice(source.index, 1);
      destTasks.splice(destination.index, 0, movedTask);
      setTasks({ ...tasks, [sourceStage]: sourceTasks, [destStage]: destTasks });
    }
  };

  const addTask = (stage) => {
    const taskContent = prompt("Enter task description:");
    if (taskContent) {
      const newTask = { id: Date.now().toString(), content: taskContent };
      setTasks({
        ...tasks,
        [stage]: [...(tasks[stage] || []), newTask],
      });
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div style={{ display: "flex", gap: "1rem" }}>
        {stages.map((stage) => (
          <Stage
            key={stage}
            stage={stage}
            tasks={tasks[stage] || []}
            addTask={addTask}
          />
        ))}
      </div>
    </DragDropContext>
  );
};

export default Board;