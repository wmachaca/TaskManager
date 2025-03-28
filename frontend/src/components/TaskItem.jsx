import { useState } from 'react';

function TaskItem({ task, deleteTask, isOwner, onUpdate }) {

  const [isEditing, setIsEditing] = useState(false);
  const [editedTask, setEditedTask] = useState({ ...task });

  // Updated color scheme
  const statusColors = {
    IN_COURSE: 'bg-blue-50 border-l-4 border-blue-500',
    FINISHED: 'bg-green-50 border-l-4 border-green-500',
    STOPPED: 'bg-red-50 border-l-4 border-red-500',
  };

  const priorityColors = {
    LOW: 'text-gray-600',
    MEDIUM: 'text-yellow-600',
    HIGH: 'text-orange-600',
    CRITICAL: 'text-red-600',
  };

  const priorityBadges = {
    LOW: 'bg-gray-100 text-gray-800',
    MEDIUM: 'bg-yellow-100 text-yellow-800',
    HIGH: 'bg-orange-100 text-orange-800',
    CRITICAL: 'bg-red-100 text-red-800',
  };

  const handleUpdate = () => {
    onUpdate(editedTask);
    setIsEditing(false);
  };


  return (
    <li className={`mb-4 p-5 rounded-lg transition-all duration-200 
      ${statusColors[task.status] || 'bg-white border-l-4 border-gray-200'}
      hover:shadow-md`}>
      
      {isEditing ? (
        <div className="space-y-3">
          <input
            type="text"
            value={editedTask.title}
            onChange={(e) => setEditedTask({...editedTask, title: e.target.value})}
            className="w-full p-2 border rounded"
          />
          <textarea
            value={editedTask.description || ''}
            onChange={(e) => setEditedTask({...editedTask, description: e.target.value})}
            className="w-full p-2 border rounded"
            rows="3"
          />
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700">Status</label>
              <select
                value={editedTask.status}
                onChange={(e) => setEditedTask({...editedTask, status: e.target.value})}
                className="w-full p-2 border rounded"
              >
                {Object.keys(statusColors).map((status) => (
                  <option key={status} value={status}>
                    {status.replace('_', ' ')}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Priority</label>
              <select
                value={editedTask.priority}
                onChange={(e) => setEditedTask({...editedTask, priority: e.target.value})}
                className="w-full p-2 border rounded"
              >
                {Object.keys(priorityColors).map((priority) => (
                  <option key={priority} value={priority}>
                    {priority}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex justify-between">
            <button 
              onClick={handleUpdate}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Save
            </button>
            <button 
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div>
          <div className="flex justify-between items-start mb-2">
            <h3 className={`text-lg font-semibold ${task.status === 'FINISHED' ? 'line-through text-gray-500' : 'text-gray-800'}`}>
              {task.title}
            </h3>
            <span className={`text-xs px-3 py-1 rounded-full ${priorityBadges[task.priority] || 'bg-gray-100'}`}>
              {task.priority || 'MEDIUM'}
            </span>
          </div>
          
          {task.description && (
            <p className="mt-2 text-gray-700">{task.description}</p>
          )}
          
          <div className="mt-4 flex items-center justify-between">
            <span className={`text-xs px-3 py-1 rounded-full ${statusColors[task.status]?.replace('bg-', 'text-').replace('border-l-4 border-', '') || 'text-gray-600'}`}>
              {task.status?.replace('_', ' ') || 'IN_PROGRESS'}
            </span>
            
            <span className="text-xs text-gray-500">
              {task.updatedAt ? `Updated: ${new Date(task.updatedAt).toLocaleString()}` : ''}
            </span>
          </div>
          
          {isOwner && (
            <div className="mt-4 flex space-x-2">
              <button 
                onClick={() => setIsEditing(true)}
                className="px-3 py-1 text-sm bg-blue-50 text-blue-600 rounded hover:bg-blue-100 transition-colors"
              >
                Edit
              </button>
              <button 
                onClick={() => deleteTask(task.id)}
                className="px-3 py-1 text-sm bg-red-50 text-red-600 rounded hover:bg-red-100 transition-colors"
              >
                Delete
              </button>
            </div>
          )}
        </div>
      )}
    </li>
  );
}

export default TaskItem;