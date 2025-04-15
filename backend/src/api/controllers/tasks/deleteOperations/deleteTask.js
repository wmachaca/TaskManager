const { prisma } = require('../../../../database/client');

module.exports = async (req, res) => {
  try {
    const { id } = req.params;
    const taskId = parseInt(id);

    if (isNaN(taskId)) {
      return res.status(400).json({
        error: 'Invalid task ID',
      });
    }

    // Verify ownership before deletion
    const task = await prisma.task.findUnique({
      where: {
        id_userId: {
          id: taskId,
          userId: req.user.id,
        },
      },
    });

    if (!task) {
      return res.status(404).json({
        error: 'Task not found or unauthorized',
      });
    }

    // Soft delete instead of actual deletion
    const deletedTask = await prisma.task.update({
      where: {
        id_userId: {
          id: taskId,
          userId: req.user.id,
        },
      },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
      },
    });

    res.status(200).json({
      success: true,
      message: 'Task moved to trash',
      task: deletedTask,
    });
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({
      error: 'Internal server error',
      details: error.message,
    });
  }
};
