const express = require("express");
const { authenticate } = require("../middlewares/authMiddleware");
const { createTask, getAllTasks, getTaskById, updateTask, deleteTask } = require("../controllers/taskController");
const { body } = require("express-validator");

const router = express.Router();

// Get tasks by date
router.get("/", authenticate, getAllTasks);

// Create a new task
router.post("/", 
    authenticate,
    [
        body("title").trim().notEmpty().withMessage("Title is required"),
        body("details").optional().trim(),
        body("client_id").isInt().withMessage("Client ID must be a number"),
        body("module_id").isInt().withMessage("Module ID must be a number"),
        body("resource_id").isInt().withMessage("Resource ID must be a number"),
        body("type_id").isInt().withMessage("Type ID must be a number"),
        body("subtype_id").isInt().withMessage("Subtype ID must be a number"),
        body("hours_spent").isFloat({ min: 0 }).withMessage("Hours spent must be a positive number"),
        body("date").isISO8601().withMessage("Date must be a valid date")
    ],
    createTask
);

// Get task by ID
router.get("/:id", authenticate, getTaskById);

// Update task
router.put("/:id", 
    authenticate,
    [
        body("title").trim().notEmpty().withMessage("Title is required"),
        body("details").optional().trim(),
        body("client_id").isInt().withMessage("Client ID must be a number"),
        body("module_id").isInt().withMessage("Module ID must be a number"),
        body("resource_id").isInt().withMessage("Resource ID must be a number"),
        body("type_id").isInt().withMessage("Type ID must be a number"),
        body("subtype_id").isInt().withMessage("Subtype ID must be a number"),
        body("hours_spent").isFloat({ min: 0 }).withMessage("Hours spent must be a positive number"),
        body("date").isISO8601().withMessage("Date must be a valid date")
    ],
    updateTask
);

// Delete task
router.delete("/:id", authenticate, deleteTask);

module.exports = router; 