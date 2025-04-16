const { db } = require("../config/db");
const { validationResult } = require("express-validator");
const SubtypeModel = require("../models/SubtypeModel");

// Get all subtypes with pagination and search
const getAllSubtypes = async (req, res) => {
    try {
        const { page = 1, limit = 10, search = '', typeId = null } = req.query;
        const result = await SubtypeModel.getAllSubtypes(page, limit, search, typeId);
        res.status(200).json(result);
    } catch (error) {
        console.error("Error fetching subtypes:", error);
        res.status(500).json({ message: "Error fetching subtypes" });
    }
};

// Get a single subtype by ID
const getSubtypeById = async (req, res) => {
    try {
        const subtype = await SubtypeModel.getSubtypeById(req.params.id);

        if (!subtype) {
            return res.status(404).json({ message: "Subtype not found" });
        }

        res.status(200).json(subtype);
    } catch (error) {
        console.error("Error fetching subtype:", error);
        res.status(500).json({ message: "Error fetching subtype" });
    }
};

// Create a new subtype
const createSubtype = async (req, res) => {
    try {
        const { name, description, typeId } = req.body;
        const createdBy = req.user.id;

        // Validate input
        if (!name || !typeId) {
            return res.status(400).json({ error: "Name and type are required" });
        }

        // Check if subtype already exists for this type
        const existingSubtype = await SubtypeModel.getSubtypeByNameAndType(name, typeId);

        if (existingSubtype) {
            return res.status(400).json({ error: "Subtype with this name already exists for this type" });
        }

        // Create subtype using the model function
        const { subtypeId } = await SubtypeModel.createSubtype({ name, description, typeId }, createdBy);

        res.status(201).json({
            message: "Subtype created successfully",
            subtypeId
        });
    } catch (error) {
        console.error("Error creating subtype:", error);
        res.status(500).json({ error: "Failed to create subtype" });
    }
};

// Update subtype
const updateSubtype = async (req, res) => {
    try {
        const { name, description, typeId } = req.body;
        const subtypeId = req.params.id;

        // Check if subtype exists
        const existingSubtype = await db("subtypes")
            .where({ id: subtypeId, is_active: true })
            .first();

        if (!existingSubtype) {
            return res.status(404).json({ message: "Subtype not found" });
        }

        // Only check for duplicate name if the name is being changed
        if (name !== existingSubtype.name || typeId !== existingSubtype.type_id) {
            const duplicateSubtype = await db("subtypes")
                .where({ name, type_id: typeId, is_active: true })
                .whereNot({ id: subtypeId })
                .first();

            if (duplicateSubtype) {
                return res.status(400).json({ message: "Subtype with this name already exists for this type" });
            }
        }

        // Update subtype
        await db("subtypes")
            .where({ id: subtypeId })
            .update({
                name,
                description,
                type_id: typeId,
                updated_by: req.user.id,
                updated_at: db.fn.now()
            });

        // Get the updated subtype
        const updatedSubtype = await db("subtypes")
            .join("types", "subtypes.type_id", "=", "types.id")
            .where("subtypes.id", subtypeId)
            .select(
                "subtypes.*",
                "types.name as type_name"
            )
            .first();

        res.status(200).json(updatedSubtype);
    } catch (error) {
        console.error("Error updating subtype:", error);
        res.status(500).json({ message: "Error updating subtype" });
    }
};

// Delete subtype
const deleteSubtype = async (req, res) => {
    try {
        const subtypeId = req.params.id;

        // Check if subtype exists
        const existingSubtype = await SubtypeModel.getSubtypeById(subtypeId);

        if (!existingSubtype) {
            return res.status(404).json({ message: "Subtype not found" });
        }

        // Delete subtype using the model function
        await SubtypeModel.deleteSubtype(subtypeId, req.user.id);

        res.status(200).json({ message: "Subtype deleted successfully" });
    } catch (error) {
        console.error("Error deleting subtype:", error);
        res.status(500).json({ message: "Error deleting subtype" });
    }
};

module.exports = {
    createSubtype,
    getAllSubtypes,
    getSubtypeById,
    updateSubtype,
    deleteSubtype
}; 