const { validationResult } = require("express-validator");
const TaskModel = require("../models/TaskModel");
const { createLogger } = require("winston");
const { db } = require("../config/db");

// Get tasks with filters for different views
const getAllTasks = async (req, res) => {
    try {
        const { date, startDate, endDate, resourceId, managerId } = req.query;
        const currentUser = req.user; // Get the current logged-in user
        
        // Build base query
        let query = db("tasks")
            .select(
                "tasks.*",
                "clients.name as client_name",
                "modules.name as module_name",
                "types.name as type_name",
                "subtypes.name as subtype_name",
                db.raw("CONCAT(employees.first_name, ' ', employees.last_name) as resource_name"),
                "employees.reporting_manager"
            )
            .leftJoin("clients", "tasks.client_id", "clients.id")
            .leftJoin("modules", "tasks.module_id", "modules.id")
            .leftJoin("types", "tasks.type_id", "types.id")
            .leftJoin("subtypes", "tasks.subtype_id", "subtypes.id")
            .leftJoin("employees", "tasks.resource_id", "employees.id")
            .where("tasks.is_active", true);

        // Apply date filters
        if (date) {
            query = query.where("tasks.date", date);
        } else if (startDate && endDate) {
            query = query.whereBetween("tasks.date", [startDate, endDate]);
        }

        // Apply role-based filters
        if (currentUser.role === 'admin') {
            // Admin can see all tasks in All Tasks tab
            if (resourceId) {
                // In My Tasks tab, show only tasks where admin is the resource
                query = query.where("tasks.resource_id", resourceId);
            } else if (managerId) {
                // In Team Tasks tab, show tasks of team members reporting to the admin
                query = query.whereIn("tasks.resource_id", function() {
                    this.select("id")
                        .from("employees")
                        .where("reporting_manager", managerId);
                });
            }
            // If neither resourceId nor managerId is provided, return all tasks (All Tasks tab)
        } else {
            // For non-admin users
            if (managerId && currentUser.id === parseInt(managerId)) {
                // Manager viewing their team's tasks
                query = query.whereIn("tasks.resource_id", function() {
                    this.select("id")
                        .from("employees")
                        .where("reporting_manager", currentUser.id);
                });
            } else {
                // Regular user or Manager viewing their own tasks
                // Always filter by resource_id to ensure users only see tasks assigned to them
                query = query.where("tasks.resource_id", currentUser.id);
            }
        }

        const tasks = await query.orderBy("tasks.created_at", "desc");

        res.status(200).json({ tasks });
    } catch (error) {
        console.error("Error fetching tasks:", error);
        res.status(500).json({ message: "Error fetching tasks" });
    }
};

// Get a single task by ID
const getTaskById = async (req, res) => {
    try {
        const task = await TaskModel.getTaskById(req.params.id);

        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }

        res.status(200).json(task);
    } catch (error) {
        console.error("Error fetching task:", error);
        res.status(500).json({ message: "Error fetching task" });
    }
};

// Create a new task
const createTask = async (req, res) => {
    try {
        const { title, client_id, module_id, resource_id, type_id, subtype_id, hours_spent, date, details } = req.body;
        const createdBy = req.user.id;

        // Validate input
        if (!title) {
            return res.status(400).json({ error: "Title is required" });
        }

        // Check if task with same title exists
        const existingTask = await TaskModel.getTaskByTitle(title);

        if (existingTask) {
            return res.status(400).json({ error: "Task with this title already exists" });
        }

        // Create task using the model function
        const { taskId } = await TaskModel.createTask({
            title,
            client_id,
            module_id,
            resource_id,
            type_id,
            subtype_id,
            hours_spent,
            date,
            details
        }, createdBy);

        res.status(201).json({
            message: "Task created successfully",
            taskId
        });
    } catch (error) {
        console.error("Error creating task:", error);
        res.status(500).json({ error: "Failed to create task" });
    }
};

// Update a task
const updateTask = async (req, res) => {
    try {
        const { title, client_id, module_id, resource_id, type_id, subtype_id, hours_spent, date, details } = req.body;
        const taskId = req.params.id;

        // Check if task exists
        const existingTask = await TaskModel.getTaskById(taskId);

        if (!existingTask) {
            return res.status(404).json({ message: "Task not found" });
        }

        // Check if another task with same title exists
        const duplicateTask = await TaskModel.getTaskByTitle(title);
        if (duplicateTask && duplicateTask.id !== taskId) {
            return res.status(400).json({ message: "Task with this title already exists" });
        }

        // Update task
        await TaskModel.updateTask(taskId, {
            title,
            client_id,
            module_id,
            resource_id,
            type_id,
            subtype_id,
            hours_spent,
            date,
            details
        }, req.user.id);

        res.status(200).json({ message: "Task updated successfully" });
    } catch (error) {
        console.error("Error updating task:", error);
        res.status(500).json({ message: "Error updating task" });
    }
};

// Delete a task (soft delete)
const deleteTask = async (req, res) => {
    try {
        const taskId = req.params.id;

        // Check if task exists
        const existingTask = await TaskModel.getTaskById(taskId);

        if (!existingTask) {
            return res.status(404).json({ message: "Task not found" });
        }

        // Soft delete task
        await TaskModel.deleteTask(taskId, req.user.id);

        res.status(200).json({ message: "Task deleted successfully" });
    } catch (error) {
        console.error("Error deleting task:", error);
        res.status(500).json({ message: "Error deleting task" });
    }
};

module.exports = {
    createTask,
    getAllTasks,
    getTaskById,
    updateTask,
    deleteTask
}; 