import { useState } from 'react';
import PropTypes from 'prop-types';
import { PencilIcon, TrashIcon, ArrowPathIcon } from '@heroicons/react/24/outline';

export default function TaskRow({
  task,
  deleteTask,
  updateTask,
  isDeletedView = false,
  restoreTask,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTask, setEditedTask] = useState({ ...task });
  const [isDeleting, setIsDeleting] = useState(false);

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

  const handleDelete = () => {
    setIsDeleting(true);
    deleteTask(task.id);
  };

  const handleRestore = () => {
    restoreTask(task.id);
  };

  return (
    <tr className="hover:bg-gray-50 transition-colors">
      <td className="px-6 py-4 whitespace-nowrap">
        {isEditing ? (
          <input
            type="text"
            value={editedTask.title}
            onChange={e => setEditedTask({ ...editedTask, title: e.target.value })}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
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
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
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
            className="p-2 border rounded focus:ring-2 focus:ring-blue-500"
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
            className="p-2 border rounded focus:ring-2 focus:ring-blue-500"
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

      {isDeletedView && (
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
          {console.log('Task object:', task)} {/* Debug line */}
          {task.deletedAt ? new Date(task.deletedAt).toLocaleString() : '-'}
        </td>
      )}

      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {task.updatedAt ? new Date(task.updatedAt).toLocaleString() : '-'}
      </td>

      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
        {isEditing ? (
          <>
            <button onClick={handleUpdate} className="text-blue-600 hover:text-blue-900">
              Save
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="text-gray-600 hover:text-gray-900"
            >
              Cancel
            </button>
          </>
        ) : isDeletedView ? (
          <>
            <button
              onClick={handleRestore}
              className="text-green-600 hover:text-green-900 inline-flex items-center"
              title="Restore task"
            >
              <ArrowPathIcon className="h-5 w-5 mr-1" />
              Restore
            </button>
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="text-red-600 hover:text-red-900 inline-flex items-center"
              title="Permanently delete"
            >
              <TrashIcon className="h-5 w-5 mr-1" />
              {isDeleting ? 'Deleting...' : 'Delete'}
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => setIsEditing(true)}
              className="text-blue-600 hover:text-blue-900 inline-flex items-center"
              title="Edit task"
            >
              <PencilIcon className="h-5 w-5 mr-1" />
              Edit
            </button>
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="text-red-600 hover:text-red-900 inline-flex items-center"
              title="Move to trash"
            >
              <TrashIcon className="h-5 w-5 mr-1" />
              {isDeleting ? 'Deleting...' : 'Delete'}
            </button>
          </>
        )}
      </td>
    </tr>
  );
}

TaskRow.propTypes = {
  task: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    status: PropTypes.oneOf(['IN_COURSE', 'FINISHED', 'STOPPED']),
    priority: PropTypes.oneOf(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']),
    updatedAt: PropTypes.string,
    dueDate: PropTypes.string,
    deletedAt: PropTypes.string,
  }).isRequired,
  deleteTask: PropTypes.func.isRequired,
  updateTask: PropTypes.func,
  restoreTask: PropTypes.func,
  isDeletedView: PropTypes.bool,
};

TaskRow.defaultProps = {
  isDeletedView: false,
};
