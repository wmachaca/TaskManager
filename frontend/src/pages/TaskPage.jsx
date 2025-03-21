import { useState, useEffect } from "react";
import { loadTasks, saveTasks } from "../utils/localStorage";
import TaskList from "../components/TaskList";
import AddTask from "../components/AddTask";

function TaskPage() {
  const [tasks, setTasks] = useState(loadTasks);

  useEffect(() => {
    saveTasks(tasks)}, [tasks]);

  const addTask = (taskText) => {
    setTasks([...tasks, { id: Date.now(), text: taskText }]);
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  return (
    <div>
      <AddTask addTask={addTask} />
      <TaskList tasks={tasks} deleteTask={deleteTask} />
    </div>
  );
}

export default TaskPage;