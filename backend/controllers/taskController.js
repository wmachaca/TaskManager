const { prisma } = require("../models");

exports.getTasks = async (req, res) => {
  try {
    const tasks = await prisma.task.findMany({
      where: { userId: req.user.id },
      orderBy: [
        { priority: 'desc' }, // Higher priority first
        { dueDate: 'asc' }    // Earlier due dates first
      ]
    });
    res.status(200).json(tasks);
  } catch (error) {
    console.error("🔥 Error fetching tasks:", error); // Log the actual error
    res.status(500).json({ error: "Error fetching tasks", details: error.message });  }
};

// Create a single task
exports.createTask = async (req, res) => {
  try {
    const { title, description, status, priority, dueDate } = req.body;
    const userId = req.user.id; // Assuming you store user ID in JWT    
    const task = await prisma.task.create({  // Create a new task
      data: { 
        title,
        description: description || "",
        status: status || "IN_COURSE",
        priority: priority || "MEDIUM",
        dueDate: dueDate ? new Date(dueDate) : null,
        userId: parseInt(userId)
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

    // Using transactions for bulk operations
    const result = await prisma.$transaction(
      tasks.map(task => 
        prisma.task.upsert({
          where: { 
            id_userId: { // Compound unique constraint needed
              id: task.id,
              userId: parseInt(userId)
            }
          },
          create: {
            title: task.title,
            description: task.description || "",
            status: task.status || "IN_COURSE",
            priority: task.priority || "MEDIUM",
            dueDate: task.dueDate ? new Date(task.dueDate) : null,
            userId: parseInt(userId)
          },
          update: {
            title: task.title,
            description: task.description || "",
            status: task.status || "IN_COURSE",
            priority: task.priority || "MEDIUM",
            dueDate: task.dueDate ? new Date(task.dueDate) : null
          }
        })
      )
    );

    res.status(201).json({ 
      success: true, 
      syncedTasks: result.length 
    });
  } catch (error) {
    console.error("Task sync error", error);
    res.status(500).json({ error: "Error syncing tasks", details: error.message });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, status, priority, dueDate } = req.body;
    
    // First verify task exists and belongs to user
    const task = await prisma.task.findUnique({
      where: { 
        id_userId: {
          id: parseInt(id),
          userId: req.user.id
        }
      }
    });

    if (!task) {
      return res.status(404).json({ 
        error: "Task not found or unauthorized"
      });
    }

    const updatedTask = await prisma.task.update({
      where: { 
        id_userId: {
          id: parseInt(id),
          userId: req.user.id
        }
      },
      data: { 
        title,
        description,
        status,
        priority,
        dueDate: dueDate ? new Date(dueDate) : null
      }
    });

    res.status(200).json(updatedTask);
  } catch (error) {
    console.error("Update error:", error);
    res.status(400).json({ 
      error: "Invalid data",
      details: error.message 
    });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const taskId = parseInt(id);

    if (isNaN(taskId)) {
      return res.status(400).json({ 
        error: "Invalid task ID" 
      });
    }

    // Verify ownership before deletion
    const task = await prisma.task.findUnique({
      where: { 
        id_userId: {
          id: taskId,
          userId: req.user.id
        }
      }
    });

    if (!task) {
      return res.status(404).json({ 
        error: "Task not found or unauthorized"
      });
    }

    await prisma.task.delete({
      where: { 
        id_userId: {
          id: taskId,
          userId: req.user.id
        }
      }
    });

    res.status(200).json({ 
      success: true,
      message: "Task deleted successfully"
    });
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({ 
      error: "Internal server error",
      details: error.message 
    });
  }
};
