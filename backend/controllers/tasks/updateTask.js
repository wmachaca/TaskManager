const { prisma } = require('../../prisma/models/index');

module.exports = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, status, priority, dueDate } = req.body;

    // First verify task exists and belongs to user
    const task = await prisma.task.findUnique({
      where: {
        id_userId: {
          id: parseInt(id),
          userId: req.user.id,
        },
      },
    });

    if (!task) {
      return res.status(404).json({
        error: 'Task not found or unauthorized',
      });
    }

    const updatedTask = await prisma.task.update({
      where: {
        id_userId: {
          id: parseInt(id),
          userId: req.user.id,
        },
      },
      data: {
        title,
        description,
        status,
        priority,
        dueDate: dueDate ? new Date(dueDate) : null,
      },
    });

    res.status(200).json(updatedTask);
  } catch (error) {
    console.error('Update error:', error);
    res.status(400).json({
      error: 'Invalid data',
      details: error.message,
    });
  }
};
