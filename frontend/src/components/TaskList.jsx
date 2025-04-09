import { useState } from 'react';
import PropTypes from 'prop-types';
import TaskTable from './TaskTable';

function TaskList({
  tasks,
  deleteTask,
  currentUserId,
  updateTask,
  isDeletedView = false,
  restoreTask,
}) {
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [priorityFilter, setPriorityFilter] = useState('ALL');

  // Filter tasks based on ownership and selected filters
  const filteredTasks = tasks.filter(task => {
    // Ownership filter
    const isOwned = !task.userId || task.userId === currentUserId;

    // Status filter
    const statusMatch = statusFilter === 'ALL' || task.status === statusFilter;

    // Priority filter
    const priorityMatch = priorityFilter === 'ALL' || task.priority === priorityFilter;

    return isOwned && statusMatch && priorityMatch;
  });

  // Don't show filters in deleted tasks view
  const showFilters = !isDeletedView;
  return (
    <div>
      {showFilters && (
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h2 className="text-xl font-semibold text-gray-800">
            {isDeletedView ? 'Deleted Tasks' : 'Your Tasks'}
          </h2>

          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <div className="flex items-center gap-3">
              <label htmlFor="status-filter" className="text-sm text-gray-600 whitespace-nowrap">
                Status:
              </label>
              <select
                id="status-filter"
                onChange={e => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 w-full"
                value={statusFilter}
              >
                <option value="ALL">All Statuses</option>
                <option value="IN_COURSE">In Course</option>
                <option value="FINISHED">Finished</option>
                <option value="STOPPED">Stopped</option>
              </select>
            </div>

            <div className="flex items-center gap-3">
              <label htmlFor="priority-filter" className="text-sm text-gray-600 whitespace-nowrap">
                Priority:
              </label>
              <select
                id="priority-filter"
                onChange={e => setPriorityFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 w-full"
                value={priorityFilter}
              >
                <option value="ALL">All Priorities</option>
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
                <option value="CRITICAL">Critical</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {filteredTasks.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">
            {isDeletedView ? 'No deleted tasks found' : 'No tasks match the selected filters'}
          </p>
          {!isDeletedView && (
            <p className="text-gray-400 mt-1">Try changing your filter criteria</p>
          )}
        </div>
      ) : (
        <TaskTable
          tasks={filteredTasks}
          deleteTask={deleteTask}
          updateTask={updateTask}
          isDeletedView={isDeletedView}
          restoreTask={restoreTask}
        />
      )}
    </div>
  );
}

TaskList.propTypes = {
  tasks: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      userId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      title: PropTypes.string.isRequired,
      description: PropTypes.string,
      status: PropTypes.oneOf(['IN_COURSE', 'FINISHED', 'STOPPED']),
      priority: PropTypes.oneOf(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']),
      updatedAt: PropTypes.string,
      dueDate: PropTypes.string,
      deletedAt: PropTypes.string,
    }),
  ).isRequired,
  deleteTask: PropTypes.func.isRequired,
  currentUserId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  updateTask: PropTypes.func,
  isDeletedView: PropTypes.bool,
  restoreTask: PropTypes.func,
};

TaskList.defaultProps = {
  isDeletedView: false,
};

export default TaskList;
