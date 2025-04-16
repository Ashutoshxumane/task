const { db } = require("../config/db");

// Get all active resource types
const getAllResourceTypes = async (req, res) => {
  try {
    const resourceTypes = await db("resource_types")
      .where("is_active", true)
      .select("*");
    res.json(resourceTypes);
  } catch (error) {
    console.error("Error fetching resource types:", error);
    res.status(500).json({ message: "Error fetching resource types" });
  }
};

// Get resource type by ID
const getResourceTypeById = async (req, res) => {
  try {
    const { id } = req.params;
    const resourceType = await db("resource_types")
      .where({ id, is_active: true })
      .first();
    
    if (!resourceType) {
      return res.status(404).json({ message: "Resource type not found" });
    }
    
    res.json(resourceType);
  } catch (error) {
    console.error("Error fetching resource type:", error);
    res.status(500).json({ message: "Error fetching resource type" });
  }
};

// Create new resource type
const createResourceType = async (req, res) => {
  try {
    const { name, description } = req.body;
    
    // Check if name already exists
    const existing = await db("resource_types")
      .where({ name, is_active: true })
      .first();
    
    if (existing) {
      return res.status(400).json({ message: "Resource type with this name already exists" });
    }
    
    const [id] = await db("resource_types").insert({
      name,
      description,
      created_by: req.user.id
    });
    
    const newResourceType = await db("resource_types")
      .where({ id })
      .first();
    
    res.status(201).json(newResourceType);
  } catch (error) {
    console.error("Error creating resource type:", error);
    res.status(500).json({ message: "Error creating resource type" });
  }
};

// Update resource type
const updateResourceType = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;
    
    // Check if resource type exists
    const existing = await db("resource_types")
      .where({ id, is_active: true })
      .first();
    
    if (!existing) {
      return res.status(404).json({ message: "Resource type not found" });
    }
    
    // Check if new name conflicts with another resource type
    if (name !== existing.name) {
      const nameExists = await db("resource_types")
        .where({ name, is_active: true })
        .whereNot({ id })
        .first();
      
      if (nameExists) {
        return res.status(400).json({ message: "Resource type with this name already exists" });
      }
    }
    
    await db("resource_types")
      .where({ id })
      .update({
        name,
        description,
        updated_by: req.user.id,
        updated_at: db.fn.now()
      });
    
    const updatedResourceType = await db("resource_types")
      .where({ id })
      .first();
    
    res.json(updatedResourceType);
  } catch (error) {
    console.error("Error updating resource type:", error);
    res.status(500).json({ message: "Error updating resource type" });
  }
};

// Delete resource type (soft delete)
const deleteResourceType = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if resource type exists
    const existing = await db("resource_types")
      .where({ id, is_active: true })
      .first();
    
    if (!existing) {
      return res.status(404).json({ message: "Resource type not found" });
    }
    
    // Check if resource type has any subtypes
    const hasSubtypes = await db("resource_subtypes")
      .where({ type_id: id, is_active: true })
      .first();
    
    if (hasSubtypes) {
      return res.status(400).json({ 
        message: "Cannot delete resource type that has active subtypes" 
      });
    }
    
    await db("resource_types")
      .where({ id })
      .update({
        is_active: false,
        updated_by: req.user.id,
        updated_at: db.fn.now()
      });
    
    res.json({ message: "Resource type deleted successfully" });
  } catch (error) {
    console.error("Error deleting resource type:", error);
    res.status(500).json({ message: "Error deleting resource type" });
  }
};

module.exports = {
  getAllResourceTypes,
  getResourceTypeById,
  createResourceType,
  updateResourceType,
  deleteResourceType
}; 