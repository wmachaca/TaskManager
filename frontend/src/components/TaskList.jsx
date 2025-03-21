import TaskItem from "./TaskItem";

function TaskList({ tasks, deleteTask }) {
  return (
    <ul>
      {tasks.map((task) => (
        <TaskItem key={task.id} task={task} deleteTask={deleteTask} />
      ))}
    </ul>
  );
}

export default TaskList;