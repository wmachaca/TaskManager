import { useContext, useState, useEffect } from "react";
import axios from 'axios';
import { loadTasks, saveTasks } from "../utils/localStorage";
import TaskList from "../components/TaskList";
import AddTask from "../components/AddTask";
import AuthContext from "../context/AuthContext";


function TaskPage() {
  const { user } = useContext(AuthContext);
  console.log("User object in TaskPage:", user); // Verify user.id exists
  const [localTasks, setLocalTasks] = useState(loadTasks());
  const [backendTasks, setBackendTasks] = useState([]);
  const [pendingSyncTasks, setPendingSyncTasks] = useState([]);  
  const [error, setError] = useState(null); // State for error handling
  const [isOnline, setIsOnline] = useState(navigator.onLine);  

  // Monitor online/offline status/UND
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

    // Fetch tasks from the backend on component mount
    useEffect(() => {
      if (user && isOnline) {
        axios.get("http://localhost:5000/api/tasks", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        })
        .then((response) => {
          setBackendTasks(response.data);
          setError(null);
        })
        .catch((error) => {
          console.error("Error fetching tasks:", error);
          setError("Error fetching tasks. Please try again later.");
        });
      }
    }, [user,isOnline]);

    // save local taks to localStorage
  useEffect(() => {
    saveTasks(localTasks)}, [localTasks]);

  // Sync pending tasks when back online
  useEffect(() => {
    if (user && isOnline && pendingSyncTasks.length > 0) {
      axios
        .post("http://localhost:5000/api/tasks/sync", { tasks: pendingSyncTasks }, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        })
        .then(() => {
          setPendingSyncTasks([]);
          setLocalTasks([]);
          setError(null);
        })
        .catch((error) => {
          console.error("Error syncing tasks:", error);
          setError("Error syncing tasks. Please try again later.");
        });
    }
  }, [user, isOnline, pendingSyncTasks]);

  // Function to add a task
  const addTask = (taskText) => {
    if (!user) {
      setError("Please log in to add tasks");
      return;
    }

    const newTask = { id: Date.now(), title: taskText, description: "", userId: user.userId };


    if (isOnline) {
      axios
        .post("http://localhost:5000/api/tasks", newTask, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        })
        .then((response) => {
          setBackendTasks([...backendTasks, response.data]);
          setError(null);
        })
        .catch((error) => {
          console.error("Error adding task:", error);
          setError("Error adding task. Please try again later.");
        });
    } else {
      setLocalTasks([...localTasks, newTask]);
      setPendingSyncTasks([...pendingSyncTasks, newTask]);
    }
  };

  // Function to delete a task
  const deleteTask = (id) => {
    if (!user) {
      setError("Please log in to delete tasks");
      return;
    }

    // Delete from local tasks
    setLocalTasks(localTasks.filter((task) => task.id !== id));
    setPendingSyncTasks(pendingSyncTasks.filter((task) => task.id !== id));    

    // Delete from backend
    if (isOnline) {
      axios
        .delete(`http://localhost:5000/api/tasks/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        })
        .then(() => {
          setBackendTasks(backendTasks.filter((task) => task.id !== id));
          setError(null);
        })
        .catch((error) => {
          console.error("Error deleting task:", error);
          setError("Error deleting task. Please try again later.");
        });
    }
  };

  if (!user) {
    return (
      <div className="auth-message">
        <h2>Please log in to view your tasks</h2>
        <p>You can use your email or Google account to sign in.</p>
      </div>
    );
  }

  // Combine local and backend tasks for display
  const allTasks = [...localTasks, ...backendTasks];
  return (
    <div className="task-page">
      {error && <div className="error-message">{error}</div>}
      <AddTask addTask={addTask} />
      <TaskList 
        tasks={allTasks} 
        deleteTask={deleteTask} 
        currentUserId={user.userId} // if you use !user, you can use user?.id
      />
    </div>
  );
}

export default TaskPage;