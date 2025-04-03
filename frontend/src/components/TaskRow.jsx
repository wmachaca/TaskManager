// components/TaskRow.jsx
import { useState } from 'react';
import PropTypes from 'prop-types';

export default function TaskRow({ task, deleteTask, updateTask }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTask, setEditedTask] = useState({ ...task });

  const statusColors = {
    IN_COURSE: 'bg-blue-100 text-blue-800',
    FINISHED: 'bg-green-100 text-green-800',
    STOPPED: 'bg-red-100 text-red-800',
  };

  const priorityColors = {
    LOW: 'text-gray-600',
    MEDIUM: 'text-yellow-600',
    HIGH: 'text-orange-600',
    CRITICAL: 'text-red-600',
  };

  const handleUpdate = () => {
    updateTask(editedTask);
    setIsEditing(false);
  };

  return (
    <tr>
      <td className="px-6 py-4 whitespace-nowrap">
        {isEditing ? (
          <input
            type="text"
            value={editedTask.title}
            onChange={e => setEditedTask({ ...editedTask, title: e.target.value })}
            className="w-full p-2 border rounded"
          />
        ) : (
          <div
            className={`text-sm font-medium ${task.status === 'FINISHED' ? 'line-through text-gray-400' : 'text-gray-900'}`}
          >
            {task.title}
          </div>
        )}
      </td>

      <td className="px-6 py-4">
        {isEditing ? (
          <textarea
            value={editedTask.description || ''}
            onChange={e => setEditedTask({ ...editedTask, description: e.target.value })}
            className="w-full p-2 border rounded"
            rows="2"
          />
        ) : (
          <div className="text-sm text-gray-500">{task.description || '-'}</div>
        )}
      </td>

      <td className="px-6 py-4 whitespace-nowrap">
        {isEditing ? (
          <select
            value={editedTask.priority}
            onChange={e => setEditedTask({ ...editedTask, priority: e.target.value })}
            className="p-2 border rounded"
          >
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
            <option value="CRITICAL">Critical</option>
          </select>
        ) : (
          <span
            className={`px-2 py-1 text-xs font-semibold rounded-full ${priorityColors[task.priority]}`}
          >
            {task.priority}
          </span>
        )}
      </td>

      <td className="px-6 py-4 whitespace-nowrap">
        {isEditing ? (
          <select
            value={editedTask.status}
            onChange={e => setEditedTask({ ...editedTask, status: e.target.value })}
            className="p-2 border rounded"
          >
            <option value="IN_COURSE">In Course</option>
            <option value="FINISHED">Finished</option>
            <option value="STOPPED">Stopped</option>
          </select>
        ) : (
          <span
            className={`px-2 py-1 text-xs font-semibold rounded-full ${statusColors[task.status]}`}
          >
            {task.status.replace('_', ' ')}
          </span>
        )}
      </td>

      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {task.updatedAt ? new Date(task.updatedAt).toLocaleString() : '-'}
      </td>

      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
        {isEditing ? (
          <>
            <button onClick={handleUpdate} className="text-blue-600 hover:text-blue-900 mr-3">
              Save
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="text-gray-600 hover:text-gray-900"
            >
              Cancel
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => setIsEditing(true)}
              className="text-blue-600 hover:text-blue-900 mr-3"
            >
              Edit
            </button>
            <button onClick={() => deleteTask(task.id)} className="text-red-600 hover:text-red-900">
              Delete
            </button>
          </>
        )}
      </td>
    </tr>
  );
}

TaskRow.propTypes = {
  task: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired, // Title is required and must be a string
    description: PropTypes.string, // Description is optional and must be a string
    status: PropTypes.oneOf(['IN_COURSE', 'FINISHED', 'STOPPED']).isRequired, // Status must be one of these values
    priority: PropTypes.oneOf(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']).isRequired, // Priority must be one of these values
    updatedAt: PropTypes.string,
  }).isRequired,
  deleteTask: PropTypes.func.isRequired, // deleteTask must be a function
  updateTask: PropTypes.func.isRequired, // updateTask must be a function
};
