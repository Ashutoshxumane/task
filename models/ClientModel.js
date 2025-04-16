const { db } = require("../config/db");

// Create a new client
const createClient = async (clientData, createdBy) => {
    // Start a transaction
    const trx = await db.transaction();

    try {
        // Insert client into the clients table
        const [clientId] = await trx("clients").insert({
            name: clientData.name,
            description: clientData.description,
            is_active: true,
            created_by: createdBy,
            created_at: db.fn.now()
        });

        // Commit the transaction
        await trx.commit();

        return { clientId };
    } catch (error) {
        // Rollback the transaction on error
        await trx.rollback();
        throw error;
    }
};

// Get client by name
const getClientByName = async (name) => {
    return db("clients")
        .where({ name, is_active: true })
        .first();
};

// Find client by name
const findClientByName = async (name) => {
    return db("clients")
        .where({ name, is_active: true })
        .first();
};

// Get all clients with pagination and search
const getAllClients = async (page = 1, limit = 10, search = "") => {
    const offset = (page - 1) * limit;
    
    const query = db("clients")
        .where("is_active", true)
        .orderBy("created_at", "desc");

    if (search) {
        query.where(function() {
            this.where("name", "like", `%${search}%`)
                .orWhere("description", "like", `%${search}%`);
        });
    }

    const [total] = await query.clone().count("* as total");
    const clients = await query.offset(offset).limit(limit);

    return {
        clients,
        pagination: {
            total: parseInt(total.total),
            page,
            limit,
            totalPages: Math.ceil(total.total / limit)
        }
    };
};

// Get client by ID
const getClientById = async (id) => {
    return db("clients")
        .where({ id, is_active: true })
        .first();
};

// Update client
const updateClient = async (id, clientData, updatedBy) => {
    const { name, description } = clientData;
    
    return db("clients")
        .where({ id, is_active: true })
        .update({
            name,
            description,
            updated_by: updatedBy,
            updated_at: db.fn.now()
        });
};

// Delete client (soft delete)
const deleteClient = async (id, updatedBy) => {
    return db("clients")
        .where({ id })
        .update({
            is_active: false,
            updated_by: updatedBy,
            updated_at: db.fn.now()
        });
};

module.exports = {
    createClient,
    getClientByName,
    findClientByName,
    getAllClients,
    getClientById,
    updateClient,
    deleteClient
};