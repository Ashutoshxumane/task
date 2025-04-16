const { db } = require("../config/db");

// Create a new type
const createType = async (typeData, createdBy) => {
    // Start a transaction
    const trx = await db.transaction();

    try {
        // Insert type into the types table
        const [typeId] = await trx("types").insert({
            name: typeData.name,
            description: typeData.description,
            is_active: true,
            created_by: createdBy,
            created_at: db.fn.now()
        });

        // Commit the transaction
        await trx.commit();

        return { typeId };
    } catch (error) {
        // Rollback the transaction on error
        await trx.rollback();
        throw error;
    }
};

// Get type details by name
const getTypeByName = async (name) => {
    return db("types").where({ name, is_active: true }).first();
};

// Find type by name
const findTypeByName = async (name) => {
    return db("types").where({ name, is_active: true }).first();
};

// Get all types with pagination and search
const getAllTypes = async (page = 1, limit = 10, search = '') => {
    const offset = (page - 1) * limit;

    let query = db("types")
        .where("is_active", true)
        .orderBy("name");

    if (search) {
        query = query.where(function() {
            this.where("name", "like", `%${search}%`)
                .orWhere("description", "like", `%${search}%`);
        });
    }

    const [types, total] = await Promise.all([
        query.limit(limit).offset(offset),
        query.clone().count("* as total").first()
    ]);

    return {
        types,
        pagination: {
            total: total.total,
            page: parseInt(page),
            limit: parseInt(limit),
            totalPages: Math.ceil(total.total / limit)
        }
    };
};

// Get type by ID
const getTypeById = async (id) => {
    return db("types").where({ id, is_active: true }).first();
};

// Update type
const updateType = async (id, typeData, updatedBy) => {
    return db("types")
        .where({ id })
        .update({
            name: typeData.name,
            description: typeData.description,
            updated_by: updatedBy,
            updated_at: db.fn.now()
        });
};

// Delete type (set is_active to false)
const deleteType = async (id, updatedBy) => {
    // First get the type name
    const type = await db("types").where({ id }).first();
    if (!type) {
        throw new Error("Type not found");
    }

    // Generate a unique name by appending a UUID
    const uniqueName = `${type.name}-deleted-${Date.now()}`;

    // Update the type with the unique name and set inactive
    return db("types")
        .where({ id })
        .update({
            name: uniqueName,
            is_active: false,
            updated_by: updatedBy,
            updated_at: db.fn.now()
        });
};

// Check if type is being used by any subtypes
const isTypeInUse = async (typeId) => {
    const result = await db("subtypes")
        .where({ type_id: typeId, is_active: true })
        .count("* as count")
        .first();
    return result.count > 0;
};

// Get subtypes using this type
const getSubtypesUsingType = async (typeId) => {
    return db("subtypes")
        .where({ type_id: typeId, is_active: true })
        .select("id", "name");
};

module.exports = {
    createType,
    getTypeByName,
    findTypeByName,
    getAllTypes,
    getTypeById,
    updateType,
    deleteType,
    isTypeInUse,
    getSubtypesUsingType
}; 