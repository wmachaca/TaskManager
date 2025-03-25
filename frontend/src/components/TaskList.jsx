import TaskItem from "./TaskItem";

function TaskList({ tasks, deleteTask, currentUserId }) {
  console.log("Current User ID:", currentUserId); // Debug
  console.log("Tasks:", tasks); // Debug
    
  // Filter tasks based on ownership/assignment: for team task manager
  const filteredTasks = tasks.filter(task => 
    !task.userId || // Show local tasks (no userId)
    task.userId === currentUserId || // Show user's own tasks
    task.assignedTo === currentUserId // Show tasks assigned to user
  );

  return (
    <ul>
      {filteredTasks.map((task) => (
        <TaskItem 
          key={task.id} 
          task={task} 
          deleteTask={deleteTask} 
          //isOwner={task.userId === currentUserId}          
          isOwner={task.userId ? task.userId === currentUserId : true}
        />
      ))}
    </ul>
  );
}

export default TaskList;