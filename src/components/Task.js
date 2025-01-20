import React from 'react';
import { useDrag } from 'react-dnd';

const Task = ({ task, stage }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'task',
    item: { task, stage },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag}
      style={{
        opacity: isDragging ? 0.5 : 1,
        cursor: 'move',
        border: '1px solid #ccc',
        padding: '10px',
        borderRadius: '5px',
        marginBottom: '5px',
        backgroundColor: 'lightblue',
      }}
    >
      {task.name}
    </div>
  );
};

export default Task;
