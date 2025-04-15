const { prisma } = require('../../../database/client');

module.exports = async (req, res) => {
  try {
    const { showDeleted } = req.query; // Check if client wants to see deleted tasks

    const tasks = await prisma.task.findMany({
      where: {
        userId: req.user.id,
        isDeleted: showDeleted ? undefined : false, // Only show non-deleted unless requested
      },
      orderBy: [{ priority: 'desc' }, { dueDate: 'asc' }],
    });
    res.status(200).json(tasks);
  } catch (error) {
    console.error('🔥 Error fetching tasks:', error);
    res.status(500).json({
      error: 'Error fetching tasks',
      details: error.message,
    });
  }
};
