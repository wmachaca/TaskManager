const express = require("express");
const { getTasks, createTask, updateTask, deleteTask } = require("../controllers/taskController");
const validateTask = require("../middleware/validateTask");
const authMiddleware = require("../middleware/authMiddleware"); 

const router = express.Router();

// Apply authMiddleware to ALL task routes
router.use(authMiddleware);

router.get("/", getTasks);
router.post("/", validateTask, createTask);
router.put("/:id", updateTask);
router.delete("/:id", deleteTask);

module.exports = router;