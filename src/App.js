import React, { useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import Stage from './components/Stage';

const App = () => {
  const [stages, setStages] = useState(['To Do', 'Doing', 'Done']);
  const [tasks, setTasks] = useState({
    'To Do': [{ id: 1, name: 'Task 1' }, { id: 2, name: 'Task 2' }],
    Doing: [],
    Done: [],
  });

  const addStage = () => {
    const newStage = prompt('Enter a new stage name:');
    if (newStage && !stages.includes(newStage)) {
      setStages([...stages, newStage]);
      setTasks({ ...tasks, [newStage]: [] });
    }
  };

  const addTask = (stage) => {
    const taskName = prompt(`Enter a task for ${stage}:`);
    if (taskName) {
      const newTask = { id: Date.now(), name: taskName };
      setTasks({ ...tasks, [stage]: [...tasks[stage], newTask] });
    }
  };

  const moveTask = (task, fromStage, toStage) => {
    setTasks((prev) => {
      const updatedFromStage = prev[fromStage].filter((t) => t.id !== task.id);
      const updatedToStage = [...prev[toStage], task];

      return {
        ...prev,
        [fromStage]: updatedFromStage,
        [toStage]: updatedToStage,
      };
    });
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div style={{ padding: '20px' }}>
        <h1>Trello-like To-Do List</h1>
        <button onClick={addStage} style={{ marginBottom: '20px' }}>
          Add Stage
        </button>
        <div style={{ display: 'flex', gap: '10px' }}>
          {stages.map((stage) => (
            <Stage
              key={stage}
              stage={stage}
              tasks={tasks[stage]}
              onAddTask={() => addTask(stage)}
              onMoveTask={moveTask}
            />
          ))}
        </div>
      </div>
    </DndProvider>
  );
};

export default App;
