const getTasks = require('./getTasks');
const createTask = require('./createTask');
const syncTasks = require('./syncTasks');
const updateTask = require('./updateTask');
const {
  deleteTask,
  getDeletedTasks,
  restoreTask,
  permanentDeleteTask,
} = require('./deleteOperations/index');

module.exports = {
  getTasks,
  createTask,
  syncTasks,
  updateTask,
  deleteTask,
  getDeletedTasks,
  restoreTask,
  permanentDeleteTask,
};
