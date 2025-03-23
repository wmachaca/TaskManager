import { useState, useEffect } from "react";
import axios from 'axios';
import { loadTasks, saveTasks } from "../utils/localStorage";
import TaskList from "../components/TaskList";
import AddTask from "../components/AddTask";

function TaskPage() {
  const [localTasks, setLocalTasks] = useState(loadTasks());
  const [backendTasks, setBackendTasks] = useState([]);
  const [error, setError] = useState(null); // State for error handling

    // Fetch tasks from the backend on component mount
    useEffect(() => {
      axios.get("http://localhost:5000/api/tasks")
        .then((response) => {
          setBackendTasks(response.data);
          setError(null); // Clear any previous errors
        })
        .catch((error) => {
          console.error("Error fetching tasks:", error);
          setError("Error fetching tasks. Please try again later."); // Set error message          
        });
    }, []);
    // save local taks to localStorage
  useEffect(() => {
    saveTasks(localTasks)}, [localTasks]);

  // Function to add a task
  const addTask = (taskText) => {
    const newTask = { id: Date.now(), text: taskText };

    // Add to local tasks
    setLocalTasks([...localTasks, newTask]);

    // Add to backend
    axios.post("http://localhost:5000/api/tasks", {
      title: taskText,
      description: "",  // You can extend this to include a description
    })
    .then((response) => {
      setBackendTasks([...backendTasks, response.data]);
      setError(null); // Clear any previous errors
    })
    .catch((error) => {
      console.error("Error adding task to backend:", error);
      setError("Error adding task. Please try again later."); // Set error message      
    });
  };  

    // Function to delete a task
    const deleteTask = (id) => {
      // Delete from local tasks
      setLocalTasks(localTasks.filter((task) => task.id !== id));
  
      // Delete from backend
      axios.delete(`http://localhost:5000/api/tasks/${id}`)
        .then(() => {
          setBackendTasks(backendTasks.filter((task) => task.id !== id));
          setError(null); // Clear any previous errors          
        })
        .catch((error) => {
          console.error("Error deleting task from backend:", error);
          setError("Error deleting task. Please try again later."); // Set error message          
        });
    };  

  // Combine local and backend tasks for display
  const allTasks = [...localTasks, ...backendTasks];
  return (
    <div>
      <AddTask addTask={addTask} />
      <TaskList tasks={allTasks} deleteTask={deleteTask} />
    </div>
  );
}

export default TaskPage;