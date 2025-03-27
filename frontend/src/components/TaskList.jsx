import { useState } from 'react';
import TaskItem from "./TaskItem";
import TaskTable from './TaskTable';

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
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Your Tasks</h2>
        <div className="flex items-center gap-3">
          <label htmlFor="filter" className="text-sm text-gray-600">Filter:</label>
          <select 
            id="filter"
            onChange={(e) => setFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            value={filter}
          >
            <option value="ALL">All Tasks</option>
            <option value="IN_COURSE">In Progress</option>
            <option value="FINISHED">Completed</option>
            <option value="STOPPED">Stopped</option>
          </select>
        </div>
      </div>
      
      {filteredTasks.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">No tasks found.</p>
          <p className="text-gray-400 mt-1">Add a new task to get started!</p>
        </div>
      ) : (
        <TaskTable 
          tasks={filteredTasks} 
          deleteTask={deleteTask}
          updateTask={updateTask}
        />
      )}
    </div>
  );
}

export default TaskList;