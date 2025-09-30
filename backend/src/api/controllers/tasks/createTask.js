const { prisma } = require('../../../database/client');

module.exports = async (req, res) => {
  try {
    console.log('Request body received by backend:', req.body); // Log the request body

    const { title, description, status, priority, dueDate } = req.body;
    const userId = req.user.id; // Extract userId from the authenticated user

    const task = await prisma.task.create({
      data: {
        title,
        description: description || '',
        status: status || 'IN_COURSE',
        priority: priority || 'MEDIUM',
        dueDate: dueDate ? new Date(dueDate) : null,
        userId: parseInt(userId), // Set userId from the authenticated user
      },
    });
    console.log(task); // Log to check if it was created
    res.status(201).json(task);
  } catch (error) {
    console.error('Task creation error', error);
    res.status(400).json({
      error: 'Invalid data',
      details: error.message,
    });
  }
};
