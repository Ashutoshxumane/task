const { db } = require("../config/db");
const { validationResult } = require("express-validator");
const ModuleModel = require("../models/ModuleModel");

// Get all modules with pagination and search
const getAllModules = async (req, res) => {
    try {
        const { page = 1, limit = 10, search = '' } = req.query;
        const result = await ModuleModel.getAllModules(page, limit, search);
        res.status(200).json(result);
    } catch (error) {
        console.error("Error fetching modules:", error);
        res.status(500).json({ message: "Error fetching modules" });
    }
};

// Get a single module by ID
const getModuleById = async (req, res) => {
    try {
        const module = await ModuleModel.getModuleById(req.params.id);

        if (!module) {
            return res.status(404).json({ message: "Module not found" });
        }

        res.status(200).json(module);
    } catch (error) {
        console.error("Error fetching module:", error);
        res.status(500).json({ message: "Error fetching module" });
    }
};

// Create a new module
const createModule = async (req, res) => {
    try {
        const { name, description } = req.body;
        const createdBy = req.user.id;

        // Validate input
        if (!name) {
            return res.status(400).json({ error: "Name is required" });
        }

        // Check if module already exists
        const existingModule = await ModuleModel.getModuleByName(name);

        if (existingModule) {
            return res.status(400).json({ error: "Module with this name already exists" });
        }

        // Create module using the model function
        const { moduleId } = await ModuleModel.createModule({ name, description }, createdBy);

        res.status(201).json({
            message: "Module created successfully",
            moduleId
        });
    } catch (error) {
        console.error("Error creating module:", error);
        res.status(500).json({ error: "Failed to create module" });
    }
};

// Update module
const updateModule = async (req, res) => {
    try {
        const { name, description } = req.body;
        const moduleId = req.params.id;

        // Check if module exists
        const existingModule = await db("modules")
            .where({ id: moduleId, is_active: true })
            .first();

        if (!existingModule) {
            return res.status(404).json({ message: "Module not found" });
        }

        // Only check for duplicate name if the name is being changed
        if (name !== existingModule.name) {
            const duplicateModule = await db("modules")
                .where({ name, is_active: true })
                .whereNot({ id: moduleId })
                .first();

            if (duplicateModule) {
                return res.status(400).json({ message: "Module with this name already exists" });
            }
        }

        // Update module
        await db("modules")
            .where({ id: moduleId })
            .update({
                name,
                description,
                updated_by: req.user.id,
                updated_at: db.fn.now()
            });

        // Get the updated module
        const updatedModule = await db("modules")
            .where({ id: moduleId })
            .first();

        res.status(200).json(updatedModule);
    } catch (error) {
        console.error("Error updating module:", error);
        res.status(500).json({ message: "Error updating module" });
    }
};

// Delete module
const deleteModule = async (req, res) => {
    try {
        const moduleId = req.params.id;

        // Check if module exists
        const existingModule = await ModuleModel.getModuleById(moduleId);

        if (!existingModule) {
            return res.status(404).json({ message: "Module not found" });
        }

        // Delete module using the model function
        await ModuleModel.deleteModule(moduleId, req.user.id);

        res.status(200).json({ message: "Module deleted successfully" });
    } catch (error) {
        console.error("Error deleting module:", error);
        res.status(500).json({ message: "Error deleting module" });
    }
};

module.exports = {
    createModule,
    getAllModules,
    getModuleById,
    updateModule,
    deleteModule
}; 