import { useState } from 'react';
import TaskItem from "./TaskItem";

function TaskList({ tasks, deleteTask, currentUserId, updateTask }) {
  console.log("Current User ID:", currentUserId); // Debug
  console.log("Tasks:", tasks); // Debug

  const [filter, setFilter] = useState('ALL');
  // Filter tasks based on ownership and status
  const filteredTasks = tasks.filter(task => {
    // Ownership filter
    const isOwned = !task.userId || task.userId === currentUserId;
    
    // Status filter
    if (filter === 'ALL') return isOwned;
    return isOwned && task.status === filter;
  });

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Your Tasks</h2>
        <select 
          onChange={(e) => setFilter(e.target.value)}
          className="p-2 border rounded bg-white"
          value={filter}
        >
          <option value="ALL">All Tasks</option>
          <option value="IN_COURSE">In Progress</option>
          <option value="FINISHED">Completed</option>
          <option value="STOPPED">Stopped</option>
        </select>
      </div>
      
      {filteredTasks.length === 0 ? (
        <p className="text-center text-gray-500 py-4">No tasks found. Add a new task to get started!</p>
      ) : (
        <ul className="space-y-4">
          {filteredTasks.map((task) => (
            <TaskItem 
              key={task.id} 
              task={task} 
              deleteTask={deleteTask} 
              isOwner={task.userId ? task.userId === currentUserId : true}
              onUpdate={updateTask}
            />
          ))}
        </ul>
      )}
    </div>
  );
}

export default TaskList;