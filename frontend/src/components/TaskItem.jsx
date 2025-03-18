function TaskItem({ task, deleteTask }) {
    return (
      <li>
        {task.text}
        <button onClick={() => deleteTask(task.id)}>Delete</button>
      </li>
    );
  }
  
  export default TaskItem;