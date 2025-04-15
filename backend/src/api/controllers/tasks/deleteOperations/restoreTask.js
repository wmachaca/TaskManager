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

    const task = await prisma.task.findUnique({
      where: {
        id_userId: {
          id: taskId,
          userId: req.user.id,
        },
        isDeleted: true, // Only restore if it's in trash
      },
    });

    if (!task) {
      return res.status(404).json({
        error: 'Deleted task not found or unauthorized',
      });
    }

    const restoredTask = await prisma.task.update({
      where: {
        id_userId: {
          id: taskId,
          userId: req.user.id,
        },
      },
      data: {
        isDeleted: false,
        deletedAt: null,
      },
    });

    res.status(200).json({
      success: true,
      message: 'Task restored successfully',
      task: restoredTask,
    });
  } catch (error) {
    console.error('Restore error:', error);
    res.status(500).json({
      error: 'Internal server error',
      details: error.message,
    });
  }
};
