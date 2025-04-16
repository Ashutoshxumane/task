const { db } = require("../config/db");
const { validationResult } = require("express-validator");
const TypeModel = require("../models/TypeModel");

// Get all types with pagination and search
const getAllTypes = async (req, res) => {
    try {
        const { page = 1, limit = 10, search = '' } = req.query;
        const result = await TypeModel.getAllTypes(page, limit, search);
        res.status(200).json(result);
    } catch (error) {
        console.error("Error fetching types:", error);
        res.status(500).json({ message: "Error fetching types" });
    }
};

// Get a single type by ID
const getTypeById = async (req, res) => {
    try {
        const type = await TypeModel.getTypeById(req.params.id);

        if (!type) {
            return res.status(404).json({ message: "Type not found" });
        }

        res.status(200).json(type);
    } catch (error) {
        console.error("Error fetching type:", error);
        res.status(500).json({ message: "Error fetching type" });
    }
};

// Create a new type
const createType = async (req, res) => {
    try {
        const { name, description } = req.body;
        const createdBy = req.user.id;

        // Validate input
        if (!name) {
            return res.status(400).json({ error: "Name is required" });
        }

        // Check if type already exists
        const existingType = await TypeModel.getTypeByName(name);

        if (existingType) {
            return res.status(400).json({ error: "Type with this name already exists" });
        }

        // Create type using the model function
        const { typeId } = await TypeModel.createType({ name, description }, createdBy);

        res.status(201).json({
            message: "Type created successfully",
            typeId
        });
    } catch (error) {
        console.error("Error creating type:", error);
        res.status(500).json({ error: "Failed to create type" });
    }
};

// Update type
const updateType = async (req, res) => {
    try {
        const { name, description } = req.body;
        const typeId = req.params.id;

        // Check if type exists
        const existingType = await db("types")
            .where({ id: typeId, is_active: true })
            .first();

        if (!existingType) {
            return res.status(404).json({ message: "Type not found" });
        }

        // Only check for duplicate name if the name is being changed
        if (name !== existingType.name) {
            const duplicateType = await db("types")
                .where({ name, is_active: true })
                .whereNot({ id: typeId })
                .first();

            if (duplicateType) {
                return res.status(400).json({ message: "Type with this name already exists" });
            }
        }

        // Update type
        await db("types")
            .where({ id: typeId })
            .update({
                name,
                description,
                updated_by: req.user.id,
                updated_at: db.fn.now()
            });

        // Get the updated type
        const updatedType = await db("types")
            .where({ id: typeId })
            .first();

        res.status(200).json(updatedType);
    } catch (error) {
        console.error("Error updating type:", error);
        res.status(500).json({ message: "Error updating type" });
    }
};

// Delete type
const deleteType = async (req, res) => {
    try {
        const typeId = req.params.id;

        // Check if type exists
        const existingType = await TypeModel.getTypeById(typeId);

        if (!existingType) {
            return res.status(404).json({ message: "Type not found" });
        }

        // Check if type is being used by any subtypes
        const isInUse = await TypeModel.isTypeInUse(typeId);
        
        if (isInUse) {
            // Get subtypes using this type
            const subtypes = await TypeModel.getSubtypesUsingType(typeId);
            
            return res.status(400).json({
                message: "Cannot delete type as it is being used by subtypes",
                subtypes: subtypes,
                warning: "Deleting this type will also delete the following subtypes:",
                confirmRequired: true
            });
        }

        // Delete type using the model function
        await TypeModel.deleteType(typeId, req.user.id);

        res.status(200).json({ message: "Type deleted successfully" });
    } catch (error) {
        console.error("Error deleting type:", error);
        res.status(500).json({ message: "Error deleting type" });
    }
};

// Delete type with subtypes
const deleteTypeWithSubtypes = async (req, res) => {
    const trx = await db.transaction();
    
    try {
        const typeId = req.params.id;

        // Check if type exists
        const existingType = await trx("types").where({ id: typeId }).first();

        if (!existingType) {
            await trx.rollback();
            return res.status(404).json({ message: "Type not found" });
        }

        // Generate a unique name for the type
        const uniqueName = `${existingType.name}-deleted-${Date.now()}`;

        // Update all subtypes to inactive
        await trx("subtypes")
            .where({ type_id: typeId })
            .update({
                is_active: false,
                updated_by: req.user.id,
                updated_at: db.fn.now()
            });

        // Update the type with unique name and set inactive in a single operation
        await trx("types")
            .where({ id: typeId })
            .update({
                name: uniqueName,
                is_active: false,
                updated_by: req.user.id,
                updated_at: db.fn.now()
            });

        // Commit the transaction
        await trx.commit();

        res.status(200).json({ 
            message: "Type and associated subtypes deleted successfully" 
        });
    } catch (error) {
        // Rollback the transaction on error
        await trx.rollback();
        console.error("Error deleting type with subtypes:", error);
        res.status(500).json({ message: "Error deleting type with subtypes" });
    }
};

module.exports = {
    createType,
    getAllTypes,
    getTypeById,
    updateType,
    deleteType,
    deleteTypeWithSubtypes
}; 