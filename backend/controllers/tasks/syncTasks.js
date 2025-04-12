const { prisma } = require('../../prisma/models/index');

module.exports = async (req, res) => {
  try {
    const userId = req.user.id;
    const { tasks } = req.body;

    if (!Array.isArray(tasks) || tasks.length === 0) {
      return res.status(400).json({ error: 'Invalid task data' });
    }
    // Using transactions for bulk operations
    const result = await prisma.$transaction(
      tasks.map(task =>
        prisma.task.upsert({
          where: {
            id_userId: {
              id: task.id,
              userId: parseInt(userId),
            },
          },
          create: {
            title: task.title,
            description: task.description || '',
            status: task.status || 'IN_COURSE',
            priority: task.priority || 'MEDIUM',
            dueDate: task.dueDate ? new Date(task.dueDate) : null,
            userId: parseInt(userId),
          },
          update: {
            title: task.title,
            description: task.description || '',
            status: task.status || 'IN_COURSE',
            priority: task.priority || 'MEDIUM',
            dueDate: task.dueDate ? new Date(task.dueDate) : null,
          },
        }),
      ),
    );

    res.status(201).json({
      success: true,
      syncedTasks: result.length,
    });
  } catch (error) {
    console.error('Task sync error', error);
    res.status(500).json({
      error: 'Error syncing tasks',
      details: error.message,
    });
  }
};
