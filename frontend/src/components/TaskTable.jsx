import PropTypes from 'prop-types';
import TaskRow from './TaskRow';
// components/TaskTable.jsx
export default function TaskTable({ tasks, deleteTask, updateTask }) {
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
          <TaskRow key={task.id} task={task} deleteTask={deleteTask} updateTask={updateTask} />
        ))}
      </tbody>
    </table>
  );
}

TaskTable.propTypes = {
  tasks: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired, // id should be a number, required
      title: PropTypes.string.isRequired, // title should be a string, required
      description: PropTypes.string, // description is optional, should be a string
      status: PropTypes.oneOf(['IN_COURSE', 'FINISHED', 'STOPPED']).isRequired, // status must be one of the enums from TaskStatus
      priority: PropTypes.oneOf(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']).isRequired, // priority must be one of the enums from Priority
      updatedAt: PropTypes.string.isRequired, // updatedAt is required and must be a string (ISO Date)
      dueDate: PropTypes.string, // dueDate is optional, must be a string (ISO Date)
    }),
  ).isRequired, // tasks should be an array of task objects, required
  deleteTask: PropTypes.func.isRequired, // deleteTask must be a function
  updateTask: PropTypes.func.isRequired, // updateTask must be a function
};
