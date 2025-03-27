import { useState } from 'react';

function TaskItem({ task, deleteTask, isOwner, onUpdate }) {

  const [isEditing, setIsEditing] = useState(false);
  const [editedTask, setEditedTask] = useState({ ...task });

  const statusColors = {
    IN_COURSE: 'bg-blue-100 text-blue-800',
    FINISHED: 'bg-green-100 text-green-800',
    STOPPED: 'bg-red-100 text-red-800',
  };

  const priorityColors = {
    LOW: 'text-gray-500',
    MEDIUM: 'text-yellow-600',
    HIGH: 'text-orange-600',
    CRITICAL: 'text-red-600',
  };

  const handleUpdate = () => {
    onUpdate(editedTask);
    setIsEditing(false);
  };


  return (
    <li className={`mb-4 p-4 rounded-lg shadow-md transition-all duration-200 
      ${task.status === 'FINISHED' ? 'bg-gray-50' : 'bg-white'}
      hover:shadow-lg`}>
      
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
          <div className="flex justify-between items-start">
            <h3 className={`text-lg font-semibold ${task.status === 'FINISHED' ? 'line-through' : ''}`}>
              {task.title}
            </h3>
            <span className={`text-xs px-2 py-1 rounded-full ${statusColors[task.status] || 'bg-gray-100'}`}>
              {task.status?.replace('_', ' ') || 'IN_COURSE'}
            </span>
          </div>
          
          {task.description && (
            <p className="mt-2 text-gray-600">{task.description}</p>
          )}
          
          <div className="mt-3 flex items-center justify-between text-sm">
            <span className={`font-medium ${priorityColors[task.priority] || 'text-gray-600'}`}>
              {task.priority || 'MEDIUM'}
            </span>
            <span className="text-gray-500">
              {task.updatedAt ? `Updated: ${new Date(task.updatedAt).toLocaleDateString()}` : ''}
            </span>
          </div>
          
          {isOwner && (
            <div className="mt-4 flex space-x-2">
              <button 
                onClick={() => setIsEditing(true)}
                className="px-3 py-1 text-sm bg-yellow-100 text-yellow-800 rounded hover:bg-yellow-200"
              >
                Edit
              </button>
              <button 
                onClick={() => deleteTask(task.id)}
                className="px-3 py-1 text-sm bg-red-100 text-red-800 rounded hover:bg-red-200"
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