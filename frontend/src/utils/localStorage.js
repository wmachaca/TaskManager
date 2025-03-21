export const loadTasks = () => {
    const savedTasks = localStorage.getItem("tasks");
    return savedTasks ? JSON.parse(savedTasks) : [];
  };
  
  export const saveTasks = (tasks) => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  };