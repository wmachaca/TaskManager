const { prisma } = require('../../../prisma/models/index');

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
        isDeleted: true, // Only allow permanent delete if in trash
      },
    });

    if (!task) {
      return res.status(404).json({
        error: 'Task not found in trash or unauthorized',
      });
    }

    await prisma.task.delete({
      where: {
        id_userId: {
          id: taskId,
          userId: req.user.id,
        },
      },
    });

    res.status(200).json({
      success: true,
      message: 'Task permanently deleted',
    });
  } catch (error) {
    console.error('Permanent delete error:', error);
    res.status(500).json({
      error: 'Internal server error',
      details: error.message,
    });
  }
};
