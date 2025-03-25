const { prisma } = require("../models");

exports.getTasks = async (req, res) => {
  try {
    const tasks = await prisma.task.findMany({
      where: { userId: req.user.id } 
    });
    res.status(200).json(tasks);
  } catch (error) {
    console.error("🔥 Error fetching tasks:", error); // Log the actual error
    res.status(500).json({ error: "Error fetching tasks", details: error.message });  }
};

exports.createTask = async (req, res) => {
  try {
    const { title, description } = req.body;
    const userId = req.user.id; // Assuming you store user ID in JWT    
    const task = await prisma.task.create({  // Create a new task
      data: { 
        title,
        description,
        userId: parseInt(userId) // Convert to Int if needed        
      }
    });
    console.log(task); // Log to check if it was created    
    res.status(201).json(task);
  } catch (error) {
    console.error("Task creation error", error);
    res.status(400).json({ 
      error: "Invalid data",
      details: error.message 
    });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, status } = req.body;
    const task = await prisma.task.findUnique({
      where: { id: parseInt(id) }  // Find task by primary key
    });
    if (!task) return res.status(404).json({ error: "Task not found" });

    const updatedTask = await prisma.task.update({
      where: { id: parseInt(id) },  // Update task by primary key
      data: { title, description, status }
    });    res.status(200).json(updatedTask);
  } catch (error) {
    res.status(400).json({ error: "Invalid data" });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const task = await prisma.task.findUnique({
      where: { id: parseInt(id) }
    });
    if (!task) return res.status(404).json({ error: "Task not found" });

    await prisma.task.delete({
      where: { id: parseInt(id) }
    });
    res.status(200).json({ message: "Task deleted" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting task" });
  }
};
