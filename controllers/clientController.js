const bcrypt = require("bcryptjs");
const { db } = require("../config/db");
const crypto = require("crypto");
const { validationResult } = require("express-validator");
const ClientModel = require("../models/ClientModel");

// Get all clients with pagination and search
const getAllClients = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '' } = req.query;
    const offset = (page - 1) * limit;

    let query = db("clients")
      .where("is_active", true)
      .orderBy("name");

    if (search) {
      query = query.where(function() {
        this.where("name", "like", `%${search}%`)
          .orWhere("description", "like", `%${search}%`);
      });
    }

    const [clients, total] = await Promise.all([
      query.limit(limit).offset(offset),
      query.clone().count("* as total").first()
    ]);

    res.status(200).json({
      clients,
      pagination: {
        total: total.total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total.total / limit)
      }
    });
  } catch (error) {
    console.error("Error fetching clients:", error);
    res.status(500).json({ message: "Error fetching clients" });
  }
};

// Get a single client by ID with related information
const getClientById = async (req, res) => {
  try {
    const client = await db("clients")
      .where({ id: req.params.id, is_active: true })
      .first();

    if (!client) {
      return res.status(404).json({ message: "Client not found" });
    }

    // Get client's modules
    const modules = await db("modules")
      .where({ client_id: client.id, is_active: true })
      .select("id", "name", "description");

    // Get client's resources
    const resources = await db("resources")
      .where({ client_id: client.id, is_active: true })
      .select("id", "name", "description");

    res.status(200).json({
      ...client,
      modules,
      resources
    });
  } catch (error) {
    console.error("Error fetching client:", error);
    res.status(500).json({ message: "Error fetching client" });
  }
};

// Create a new client
const createClient = async (req, res) => {
    try {
        const { name, description } = req.body;
        const createdBy = req.user.id; // Get user ID from authenticated user

        // Validate input
        if (!name) {
            return res.status(400).json({ error: "Name is required" });
        }

        // Create client using the model function
        const { clientId } = await ClientModel.createClient({ name, description }, createdBy);

        res.status(201).json({
            message: "Client created successfully",
            clientId
        });
    } catch (error) {
        console.error("Error creating client:", error);
        if (error.message === "Client with this name already exists") {
            res.status(400).json({ error: error.message });
        } else {
            res.status(500).json({ error: "Failed to create client" });
        }
    }
};

// Update a client
const updateClient = async (req, res) => {
    try {
        const { name, description } = req.body;
        const clientId = req.params.id;

        // Check if client exists
        const existingClient = await db("clients")
            .where({ id: clientId, is_active: true })
            .first();

        if (!existingClient) {
            return res.status(404).json({ message: "Client not found" });
        }

        // Check if another client with same name exists
        const duplicateClient = await db("clients")
            .where({ name, is_active: true })
            .whereNot({ id: clientId })
            .first();

        if (duplicateClient) {
            return res.status(400).json({ message: "Client with this name already exists" });
        }

        // Update client
        await db("clients")
            .where({ id: clientId })
            .update({
                name,
                description,
                updated_by: req.user.id,
                updated_at: db.fn.now()
            });

        // Get the updated client
        const updatedClient = await db("clients")
            .where({ id: clientId })
            .first();

        res.status(200).json(updatedClient);
    } catch (error) {
        console.error("Error updating client:", error);
        res.status(500).json({ message: "Error updating client" });
    }
};

// Delete a client (set is_active to 0)
const deleteClient = async (req, res) => {
    try {
        const clientId = req.params.id;

        // Check if client exists
        const existingClient = await db("clients")
            .where({ id: clientId })
            .first();

        if (!existingClient) {
            return res.status(404).json({ message: "Client not found" });
        }

        // Set is_active to 0
        await db("clients")
            .where({ id: clientId })
            .update({
                is_active: 0,
                updated_by: req.user.id,
                updated_at: db.fn.now()
            });

        res.status(200).json({ message: "Client deleted successfully" });
    } catch (error) {
        console.error("Error deleting client:", error);
        res.status(500).json({ message: "Error deleting client" });
    }
};

module.exports = {
  createClient,
  getAllClients,
  getClientById,
  updateClient,
  deleteClient
}; 