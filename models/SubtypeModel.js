const { db } = require("../config/db");

// Create a new subtype
const createSubtype = async (subtypeData, createdBy) => {
    // Start a transaction
    const trx = await db.transaction();

    try {
        // Insert subtype into the subtypes table
        const [subtypeId] = await trx("subtypes").insert({
            name: subtypeData.name,
            description: subtypeData.description,
            type_id: subtypeData.typeId,
            is_active: true,
            created_by: createdBy,
            created_at: db.fn.now()
        });

        // Commit the transaction
        await trx.commit();

        return { subtypeId };
    } catch (error) {
        // Rollback the transaction on error
        await trx.rollback();
        throw error;
    }
};

// Get subtype details by name and type
const getSubtypeByNameAndType = async (name, typeId) => {
    return db("subtypes").where({ name, type_id: typeId, is_active: true }).first();
};

// Find subtype by name and type
const findSubtypeByNameAndType = async (name, typeId) => {
    return db("subtypes").where({ name, type_id: typeId, is_active: true }).first();
};

// Get all subtypes with pagination and search
const getAllSubtypes = async (page = 1, limit = 10, search = '', typeId = null) => {
    const offset = (page - 1) * limit;

    // First get the total count
    let countQuery = db("subtypes")
        .join("types", "subtypes.type_id", "=", "types.id")
        .where("subtypes.is_active", true);

    if (typeId) {
        countQuery = countQuery.where("subtypes.type_id", typeId);
    }

    if (search) {
        countQuery = countQuery.where(function() {
            this.where("subtypes.name", "like", `%${search}%`)
                .orWhere("subtypes.description", "like", `%${search}%`)
                .orWhere("types.name", "like", `%${search}%`);
        });
    }

    const total = await countQuery.count("* as total").first();

    // Then get the paginated data
    let dataQuery = db("subtypes")
        .join("types", "subtypes.type_id", "=", "types.id")
        .where("subtypes.is_active", true)
        .select(
            "subtypes.*",
            "types.name as type_name"
        )
        .orderBy("subtypes.name")
        .limit(limit)
        .offset(offset);

    if (typeId) {
        dataQuery = dataQuery.where("subtypes.type_id", typeId);
    }

    if (search) {
        dataQuery = dataQuery.where(function() {
            this.where("subtypes.name", "like", `%${search}%`)
                .orWhere("subtypes.description", "like", `%${search}%`)
                .orWhere("types.name", "like", `%${search}%`);
        });
    }

    const subtypes = await dataQuery;

    return {
        subtypes,
        pagination: {
            total: total.total,
            page: parseInt(page),
            limit: parseInt(limit),
            totalPages: Math.ceil(total.total / limit)
        }
    };
};

// Get subtype by ID
const getSubtypeById = async (id) => {
    return db("subtypes")
        .join("types", "subtypes.type_id", "=", "types.id")
        .where("subtypes.id", id)
        .where("subtypes.is_active", true)
        .select(
            "subtypes.*",
            "types.name as type_name"
        )
        .first();
};

// Update subtype
const updateSubtype = async (id, subtypeData, updatedBy) => {
    return db("subtypes")
        .where({ id })
        .update({
            name: subtypeData.name,
            description: subtypeData.description,
            type_id: subtypeData.typeId,
            updated_by: updatedBy,
            updated_at: db.fn.now()
        });
};

// Delete subtype (set is_active to false)
const deleteSubtype = async (id, updatedBy) => {
    return db("subtypes")
        .where({ id })
        .update({
            is_active: false,
            updated_by: updatedBy,
            updated_at: db.fn.now()
        });
};

module.exports = {
    createSubtype,
    getSubtypeByNameAndType,
    findSubtypeByNameAndType,
    getAllSubtypes,
    getSubtypeById,
    updateSubtype,
    deleteSubtype
}; 