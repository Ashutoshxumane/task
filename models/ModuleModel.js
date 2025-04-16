const { db } = require("../config/db");

// Create a new module
const createModule = async (moduleData, createdBy) => {
    // Start a transaction
    const trx = await db.transaction();

    try {
        // Insert module into the modules table
        const [moduleId] = await trx("modules").insert({
            name: moduleData.name,
            description: moduleData.description,
            is_active: true,
            created_by: createdBy,
            created_at: db.fn.now()
        });

        // Commit the transaction
        await trx.commit();

        return { moduleId };
    } catch (error) {
        // Rollback the transaction on error
        await trx.rollback();
        throw error;
    }
};

// Get module details by name
const getModuleByName = async (name) => {
    return db("modules").where({ name, is_active: true }).first();
};

// Find module by name
const findModuleByName = async (name) => {
    return db("modules").where({ name, is_active: true }).first();
};

// Get all modules with pagination and search
const getAllModules = async (page = 1, limit = 10, search = '') => {
    const offset = (page - 1) * limit;

    let query = db("modules")
        .where("is_active", true)
        .orderBy("name");

    if (search) {
        query = query.where(function() {
            this.where("name", "like", `%${search}%`)
                .orWhere("description", "like", `%${search}%`);
        });
    }

    const [modules, total] = await Promise.all([
        query.limit(limit).offset(offset),
        query.clone().count("* as total").first()
    ]);

    return {
        modules,
        pagination: {
            total: total.total,
            page: parseInt(page),
            limit: parseInt(limit),
            totalPages: Math.ceil(total.total / limit)
        }
    };
};

// Get module by ID
const getModuleById = async (id) => {
    return db("modules").where({ id, is_active: true }).first();
};

// Update module
const updateModule = async (id, moduleData, updatedBy) => {
    return db("modules")
        .where({ id })
        .update({
            name: moduleData.name,
            description: moduleData.description,
            updated_by: updatedBy,
            updated_at: db.fn.now()
        });
};

// Delete module (set is_active to 0)
const deleteModule = async (id, updatedBy) => {
    return db("modules")
        .where({ id })
        .update({
            is_active: 0,
            updated_by: updatedBy,
            updated_at: db.fn.now()
        });
};

module.exports = {
    createModule,
    getModuleByName,
    findModuleByName,
    getAllModules,
    getModuleById,
    updateModule,
    deleteModule
}; 