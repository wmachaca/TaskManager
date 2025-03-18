import { useState, useEffect } from "react";
import TaskPage from "./pages/TaskPage";
import "./styles/global.css";

function App() {
  return (
    <div>
      <h1>Task Manager</h1>
      <TaskPage />
    </div>
  );
}

export default App;