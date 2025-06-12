const express = require("express");
const router = express.Router();
const taskController = require("../controllers/taskController");
const {
  validate,
  createTaskValidation,
  updateTaskValidation,
  updateTaskStatusValidation,
  queryValidation,
} = require("../middleware/validation");

// Get all tasks with optional filtering
router.get("/", queryValidation, validate, taskController.getAllTasks);

// Get single task
router.get("/:id", taskController.getTask);

// Create new task
router.post("/", createTaskValidation, validate, taskController.createTask);

// Update task
router.put("/:id", updateTaskValidation, validate, taskController.updateTask);

// Delete task
router.delete("/:id", taskController.deleteTask);

// Update task status
router.patch(
  "/:id/status",
  updateTaskStatusValidation,
  validate,
  taskController.updateTaskStatus
);

module.exports = router;
