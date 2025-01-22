import React from 'react';
import { useDrop } from 'react-dnd';
import Task from './Task';

const Stage = ({ stage, tasks, onAddTask, onMoveTask }) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'task',
    drop: (item) => onMoveTask(item.task, item.stage, stage),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));

  return (
    <div
      ref={drop}
      style={{
        border: `2px solid ${isOver ? 'green' : '#ccc'}`,
        borderRadius: '5px',
        padding: '10px',
        width: '300px',
        minHeight: '200px',
        backgroundColor: isOver ? '#f0f8ff' : 'white',
      }}
    >
      <h2>{stage}</h2>
      <button onClick={onAddTask} style={{ marginBottom: '10px' }}>
        Add Task
      </button>
      {tasks.map((task) => (
        <Task key={task.id} task={task} stage={stage} />
      ))}
    </div>
  );
};

export default Stage;
