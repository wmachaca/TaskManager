import PropTypes from 'prop-types';
import TaskRow from './TaskRow';

export default function TaskTable({
  tasks,
  deleteTask,
  updateTask,
  isDeletedView = false,
  restoreTask,
}) {
  return (
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-yellow-50">
        <tr>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Title
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Description
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Priority
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Status
          </th>
          {isDeletedView && (
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Deleted At
            </th>
          )}
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Last Updated
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Actions
          </th>
        </tr>
      </thead>
      <tbody className="bg-yellow-50 divide-y divide-gray-200">
        {tasks.map(task => (
          <TaskRow
            key={task.id}
            task={task}
            deleteTask={deleteTask}
            updateTask={updateTask}
            isDeletedView={isDeletedView}
            restoreTask={restoreTask}
          />
        ))}
      </tbody>
    </table>
  );
}

TaskTable.propTypes = {
  tasks: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
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
  updateTask: PropTypes.func,
  isDeletedView: PropTypes.bool,
  restoreTask: PropTypes.func,
};

TaskTable.defaultProps = {
  isDeletedView: false,
};
