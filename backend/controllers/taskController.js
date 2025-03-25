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

// Create a single task
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


// Bulk insert for offline sync
exports.syncTasks = async (req, res) => {
  try {
    const userId = req.user.id;
    const { tasks } = req.body;

    if (!Array.isArray(tasks) || tasks.length === 0) {
      return res.status(400).json({ error: "Invalid task data" });
    }

    const createdTasks = await prisma.task.createMany({
      data: tasks.map((task) => ({
        title: task.title,
        description: task.description || "",
        userId: parseInt(userId),
      })),
      skipDuplicates: true, // Prevent duplicates
    });

    res.status(201).json({ success: true, inserted: createdTasks.count });
  } catch (error) {
    console.error("Task sync error", error);
    res.status(500).json({ error: "Error syncing tasks", details: error.message });
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
    // Convert ID to number and validate
    const taskId = parseInt(id);
    if (isNaN(taskId)) {
      return res.status(400).json({ 
        error: "Invalid task ID format",
        details: "ID must be a number" 
      });
    }

    const task = await prisma.task.findFirst({ //findFirst or findUnique
      where: { 
        id: taskId,
        userId: req.user.id // Security check
      }
    });
    if (!task) {
      return res.status(404).json({ 
        error: "Task not found or unauthorized",
        details: "Task doesn't exist or doesn't belong to user"
      });
    }
    await prisma.task.delete({
      where: { id: taskId }
    });
    res.status(200).json({ 
      success: true,
      message: "Task deleted successfully",
      deletedId: taskId // Return deleted ID for frontend reference
    });
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({ 
      error: "Internal server error",
      details: error.message 
    });
  }
};
