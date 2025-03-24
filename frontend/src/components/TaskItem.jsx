function TaskItem({ task, deleteTask, isOwner }) {
  return (
    <li>
      <div>
        <h3>{task.title}</h3>
        {task.description && <p>{task.description}</p>}
        {/* Only show delete button if user is owner */}
        {isOwner && (
          <button onClick={() => deleteTask(task.id)}>Delete</button>
        )}
        {/* Show assignment info if applicable */}
        {task.assignedTo && !isOwner && (
          <span>Assigned to you</span>
        )}
      </div>
    </li>
  );
}

export default TaskItem;