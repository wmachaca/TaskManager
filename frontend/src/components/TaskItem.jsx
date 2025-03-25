function TaskItem({ task, deleteTask, isOwner }) {
  return (
    <li className="task-item">
      <div className="task-content">
        <h3>{task.title}</h3>
        {task.description && <p>{task.description}</p>}
        
        <div className="task-actions">
        {/* Only show delete button if user is owner */}
          {isOwner && (
            <button 
              className="delete-btn"
              onClick={() => deleteTask(task.id)}
              aria-label={`Delete task ${task.title}`}
            >
              Delete
            </button>
          )}
        </div>
        <div>
        {/* Show assignment info if applicable */}
        {task.assignedTo && !isOwner && (
          <span>Assigned to you</span>
        )}          
        </div>
      </div>
    </li>
  );
}

export default TaskItem;