import { useContext, useState, useEffect } from 'react';
import apiClient from '../utils/apiClient';
import { loadTasks, saveTasks } from '../utils/localStorage';
import TaskList from '../components/TaskList';
import AddTask from '../components/AddTask';
import AuthContext from '../context/AuthContext';
import { TrashIcon, ArrowPathIcon } from '@heroicons/react/24/outline';

function TaskPage() {
  const { user } = useContext(AuthContext);
  console.log('User object in TaskPage:', user); // Verify user.id exists
  const [localTasks, setLocalTasks] = useState(loadTasks());
  const [backendTasks, setBackendTasks] = useState([]);
  const [deletedTasks, setDeletedTasks] = useState([]); // New state for deleted tasks
  const [pendingSyncTasks, setPendingSyncTasks] = useState([]);
  const [error, setError] = useState(null); // State for error handling
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showDeleted, setShowDeleted] = useState(false); // Toggle for showing deleted tasks

  // Monitor online/offline status/UND
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Fetch tasks from the backend on component mount
  useEffect(() => {
    if (user && isOnline) {
      apiClient
        .get('/api/tasks', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        })
        .then(response => {
          setBackendTasks(response.data);
          setError(null);
        })
        .catch(error => {
          console.error('Error fetching tasks:', error);
          setError('Error fetching tasks. Please try again later.');
        });
    }
  }, [user, isOnline]);

  // save local taks to localStorage
  useEffect(() => {
    saveTasks(localTasks);
  }, [localTasks]);

  // Sync pending tasks when back online
  useEffect(() => {
    if (user && isOnline && pendingSyncTasks.length > 0) {
      apiClient
        .post(
          '/api/tasks/sync',
          { tasks: pendingSyncTasks },
          {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
          },
        )
        .then(() => {
          setPendingSyncTasks([]);
          setLocalTasks([]);
          setError(null);
        })
        .catch(error => {
          console.error('Error syncing tasks:', error);
          setError('Error syncing tasks. Please try again later.');
        });
    }
  }, [user, isOnline, pendingSyncTasks]);

  // Fetch deleted tasks
  useEffect(() => {
    if (user && isOnline) {
      fetchDeletedTasks();
    }
  }, [user, isOnline]);

  const fetchDeletedTasks = async () => {
    try {
      const response = await apiClient.get('/api/tasks/trash', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setDeletedTasks(response.data);
    } catch (error) {
      console.error('Error fetching deleted tasks:', error);
    }
  };

  // Function to add a task
  const addTask = taskData => {
    if (!user) {
      setError('Please log in to add tasks');
      return;
    }

    const newTask = {
      id: Date.now(),
      title: taskData.title,
      description: taskData.description || '',
      status: 'IN_COURSE',
      priority: taskData.priority || 'MEDIUM',
      userId: user.userId,
    };

    if (isOnline) {
      apiClient
        .post('/api/tasks', newTask, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        })
        .then(response => {
          setBackendTasks([...backendTasks, response.data]);
          setError(null);
        })
        .catch(error => {
          console.error('Error adding task:', error);
          setError('Error adding task. Please try again later.');
        });
    } else {
      setLocalTasks([...localTasks, newTask]);
      setPendingSyncTasks([...pendingSyncTasks, newTask]);
    }
  };

  // Function to delete a task
  const deleteTask = async id => {
    if (!user) {
      setError('Please log in to delete tasks');
      return;
    }

    // Optimistic update for UI
    const taskToDelete = [...backendTasks, ...localTasks].find(task => task.id === id);
    if (isOnline) {
      try {
        // Remove from active tasks
        setBackendTasks(backendTasks.filter(task => task.id !== id));
        setLocalTasks(localTasks.filter(task => task.id !== id));

        // Add to deleted tasks (optimistically)
        if (taskToDelete) {
          setDeletedTasks(prev => [...prev, { ...taskToDelete, isDeleted: true }]);
        }

        await apiClient.delete(`/api/tasks/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });

        setError(null);
      } catch (error) {
        console.error('Error deleting task:', error);
        setError('Error deleting task. Please try again later.');
        // Revert optimistic update
        if (taskToDelete) {
          setBackendTasks(prev => [...prev, taskToDelete]);
          setDeletedTasks(prev => prev.filter(task => task.id !== id));
        }
      }
    } else {
      // For offline, we'll just remove it locally
      setLocalTasks(localTasks.filter(task => task.id !== id));
      setPendingSyncTasks(pendingSyncTasks.filter(task => task.id !== id));
    }
  };

  // Function to update a task
  const updateTask = updatedTask => {
    if (!user) {
      setError('Please log in to update tasks');
      return;
    }

    if (isOnline) {
      apiClient
        .put(`/api/tasks/${updatedTask.id}`, updatedTask, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        })
        .then(response => {
          setBackendTasks(
            backendTasks.map(task => (task.id === updatedTask.id ? response.data : task)),
          );
          setError(null);
        })
        .catch(error => {
          console.error('Error updating task:', error);
          setError('Error updating task. Please try again later.');
        });
    } else {
      setLocalTasks(localTasks.map(task => (task.id === updatedTask.id ? updatedTask : task)));
      setPendingSyncTasks([...pendingSyncTasks.filter(t => t.id !== updatedTask.id), updatedTask]);
    }
  };

  // Add restore task function
  const restoreTask = async id => {
    if (!user) {
      setError('Please log in to restore tasks');
      return;
    }

    const taskToRestore = deletedTasks.find(task => task.id === id);

    if (isOnline) {
      try {
        // Optimistically update UI
        setDeletedTasks(prev => prev.filter(task => task.id !== id));
        if (taskToRestore) {
          setBackendTasks(prev => [...prev, { ...taskToRestore, isDeleted: false }]);
        }

        await apiClient.post(
          `/api/tasks/${id}/restore`,
          {},
          {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
          },
        );

        setError(null);
      } catch (error) {
        console.error('Error restoring task:', error);
        setError('Error restoring task. Please try again later.');
        // Revert optimistic update
        if (taskToRestore) {
          setDeletedTasks(prev => [...prev, taskToRestore]);
          setBackendTasks(prev => prev.filter(task => task.id !== id));
        }
      }
    } else {
      setError('Cannot restore tasks while offline');
    }
  };

  // Add permanent delete function
  const permanentDeleteTask = async id => {
    if (!user) {
      setError('Please log in to delete tasks');
      return;
    }

    if (isOnline) {
      try {
        // Optimistically update UI
        setDeletedTasks(prev => prev.filter(task => task.id !== id));

        await apiClient.delete(`/api/tasks/${id}/permanent`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });

        setError(null);
      } catch (error) {
        console.error('Error permanently deleting task:', error);
        setError('Error deleting task. Please try again later.');
        // Revert optimistic update would need to re-fetch deleted tasks
      }
    } else {
      setError('Cannot permanently delete tasks while offline');
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-sky-100 to-blue-200 p-4 md:p-8 transition-all duration-300">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-800">
            {showDeleted ? 'Deleted Tasks' : 'Task Manager'}
          </h1>
          <button
            onClick={() => setShowDeleted(!showDeleted)}
            className="flex items-center gap-2 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors"
          >
            {showDeleted ? (
              <>
                <ArrowPathIcon className="h-5 w-5" />
                <span>Back to Active Tasks</span>
              </>
            ) : (
              <>
                <TrashIcon className="h-5 w-5" />
                <span>View Deleted Tasks</span>
              </>
            )}
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded">
            {error}
          </div>
        )}
        {/* Layout Wrapper */}
        {showDeleted ? (
          // 🔴 Deleted Task View
          <div className="flex justify-center w-full px-4">
            <div className="bg-white p-6 rounded-xl shadow-md overflow-auto">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Deleted Tasks</h2>
              {deletedTasks.length === 0 ? (
                <p className="text-gray-500">No deleted tasks found</p>
              ) : (
                <TaskList
                  tasks={deletedTasks}
                  deleteTask={permanentDeleteTask} // A hard delete function
                  currentUserId={user.userId}
                  updateTask={null} // Disable editing
                  restoreTask={restoreTask} // Add restore functionality
                  isDeletedView={true}
                />
              )}
            </div>
          </div>
        ) : (
          // ✅ Active Task View
          <div className="flex flex-col lg:flex-row gap-6 w-full">
            {/* Left - Add Task */}
            <div className="lg:w-1/3 w-full px-4">
              <div className="bg-white p-6 rounded-xl shadow-md lg:sticky lg:top-4 mx-auto max-w-md">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Add New Task</h2>
                <AddTask addTask={addTask} />
              </div>
            </div>

            {/* Right - Task List */}
            <div className="lg:w-2/3 w-full">
              <div className="bg-white p-6 rounded-xl shadow-md overflow-auto">
                <TaskList
                  tasks={allTasks}
                  deleteTask={deleteTask}
                  currentUserId={user.userId}
                  updateTask={updateTask}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default TaskPage;
