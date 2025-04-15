const { prisma } = require('../../../../database/client');

module.exports = async (req, res) => {
  try {
    const tasks = await prisma.task.findMany({
      where: {
        userId: req.user.id,
        isDeleted: true,
      },
      orderBy: [{ deletedAt: 'desc' }],
    });
    console.log('Deleted tasks from DB:', tasks);
    res.status(200).json(tasks);
  } catch (error) {
    console.error('🔥 Error fetching deleted tasks:', error);
    res.status(500).json({
      error: 'Error fetching deleted tasks',
      details: error.message,
    });
  }
};
