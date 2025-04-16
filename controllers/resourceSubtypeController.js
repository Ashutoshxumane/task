const { db } = require("../config/db");

// Get all active resource subtypes
const getAllResourceSubtypes = async (req, res) => {
  try {
    const subtypes = await db("resource_subtypes")
      .where("resource_subtypes.is_active", true)
      .join("resource_types", "resource_subtypes.type_id", "resource_types.id")
      .select(
        "resource_subtypes.*",
        "resource_types.name as type_name"
      );
    res.json(subtypes);
  } catch (error) {
    console.error("Error fetching resource subtypes:", error);
    res.status(500).json({ message: "Error fetching resource subtypes" });
  }
};

// Get resource subtypes by type ID
const getResourceSubtypesByTypeId = async (req, res) => {
  try {
    const { typeId } = req.params;
    
    // Check if resource type exists
    const typeExists = await db("resource_types")
      .where({ id: typeId, is_active: true })
      .first();
    
    if (!typeExists) {
      return res.status(404).json({ message: "Resource type not found" });
    }
    
    const subtypes = await db("resource_subtypes")
      .where({ 
        "resource_subtypes.type_id": typeId,
        "resource_subtypes.is_active": true 
      })
      .join("resource_types", "resource_subtypes.type_id", "resource_types.id")
      .select(
        "resource_subtypes.*",
        "resource_types.name as type_name"
      );
    
    res.json(subtypes);
  } catch (error) {
    console.error("Error fetching resource subtypes:", error);
    res.status(500).json({ message: "Error fetching resource subtypes" });
  }
};

// Get resource subtype by ID
const getResourceSubtypeById = async (req, res) => {
  try {
    const { id } = req.params;
    const subtype = await db("resource_subtypes")
      .where({ "resource_subtypes.id": id, "resource_subtypes.is_active": true })
      .join("resource_types", "resource_subtypes.type_id", "resource_types.id")
      .select(
        "resource_subtypes.*",
        "resource_types.name as type_name"
      )
      .first();
    
    if (!subtype) {
      return res.status(404).json({ message: "Resource subtype not found" });
    }
    
    res.json(subtype);
  } catch (error) {
    console.error("Error fetching resource subtype:", error);
    res.status(500).json({ message: "Error fetching resource subtype" });
  }
};

// Create new resource subtype
const createResourceSubtype = async (req, res) => {
  try {
    const { name, type_id, description } = req.body;
    
    // Check if resource type exists
    const typeExists = await db("resource_types")
      .where({ id: type_id, is_active: true })
      .first();
    
    if (!typeExists) {
      return res.status(404).json({ message: "Resource type not found" });
    }
    
    // Check if name already exists for this type
    const existing = await db("resource_subtypes")
      .where({ 
        name,
        type_id,
        is_active: true 
      })
      .first();
    
    if (existing) {
      return res.status(400).json({ 
        message: "Resource subtype with this name already exists for this type" 
      });
    }
    
    const [id] = await db("resource_subtypes").insert({
      name,
      type_id,
      description,
      created_by: req.user.id
    });
    
    const newSubtype = await db("resource_subtypes")
      .where({ id })
      .join("resource_types", "resource_subtypes.type_id", "resource_types.id")
      .select(
        "resource_subtypes.*",
        "resource_types.name as type_name"
      )
      .first();
    
    res.status(201).json(newSubtype);
  } catch (error) {
    console.error("Error creating resource subtype:", error);
    res.status(500).json({ message: "Error creating resource subtype" });
  }
};

// Update resource subtype
const updateResourceSubtype = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, type_id, description } = req.body;
    
    // Check if subtype exists
    const existing = await db("resource_subtypes")
      .where({ id, is_active: true })
      .first();
    
    if (!existing) {
      return res.status(404).json({ message: "Resource subtype not found" });
    }
    
    // If type_id is changing, check if new type exists
    if (type_id !== existing.type_id) {
      const typeExists = await db("resource_types")
        .where({ id: type_id, is_active: true })
        .first();
      
      if (!typeExists) {
        return res.status(404).json({ message: "Resource type not found" });
      }
    }
    
    // Check if new name conflicts with another subtype of the same type
    if (name !== existing.name || type_id !== existing.type_id) {
      const nameExists = await db("resource_subtypes")
        .where({ 
          name,
          type_id,
          is_active: true 
        })
        .whereNot({ id })
        .first();
      
      if (nameExists) {
        return res.status(400).json({ 
          message: "Resource subtype with this name already exists for this type" 
        });
      }
    }
    
    await db("resource_subtypes")
      .where({ id })
      .update({
        name,
        type_id,
        description,
        updated_by: req.user.id,
        updated_at: db.fn.now()
      });
    
    const updatedSubtype = await db("resource_subtypes")
      .where({ id })
      .join("resource_types", "resource_subtypes.type_id", "resource_types.id")
      .select(
        "resource_subtypes.*",
        "resource_types.name as type_name"
      )
      .first();
    
    res.json(updatedSubtype);
  } catch (error) {
    console.error("Error updating resource subtype:", error);
    res.status(500).json({ message: "Error updating resource subtype" });
  }
};

// Delete resource subtype (soft delete)
const deleteResourceSubtype = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if subtype exists
    const existing = await db("resource_subtypes")
      .where({ id, is_active: true })
      .first();
    
    if (!existing) {
      return res.status(404).json({ message: "Resource subtype not found" });
    }
    
    await db("resource_subtypes")
      .where({ id })
      .update({
        is_active: false,
        updated_by: req.user.id,
        updated_at: db.fn.now()
      });
    
    res.json({ message: "Resource subtype deleted successfully" });
  } catch (error) {
    console.error("Error deleting resource subtype:", error);
    res.status(500).json({ message: "Error deleting resource subtype" });
  }
};

module.exports = {
  getAllResourceSubtypes,
  getResourceSubtypesByTypeId,
  getResourceSubtypeById,
  createResourceSubtype,
  updateResourceSubtype,
  deleteResourceSubtype
}; 