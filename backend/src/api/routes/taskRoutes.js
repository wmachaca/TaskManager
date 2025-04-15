const express = require('express');
const {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  syncTasks,
  getDeletedTasks,
  restoreTask,
  permanentDeleteTask,
} = require('../controllers/tasks/index');
const validateTaskMiddleware = require('../middleware/validateTask');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Apply authMiddleware to ALL task routes
router.use(authMiddleware);
router.get('/', getTasks);
router.post('/', [...validateTaskMiddleware], createTask);
router.post('/sync', syncTasks);
router.put('/:id', updateTask);
router.delete('/:id', deleteTask);

router.get('/trash', getDeletedTasks);
router.post('/:id/restore', restoreTask);
router.delete('/:id/permanent', permanentDeleteTask);

module.exports = router;
