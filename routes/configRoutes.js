const express = require("express");
const { authenticate, authorizeRoles } = require("../middlewares/authMiddleware");
const { createClient, getAllClients, getClientById, updateClient, deleteClient } = require("../controllers/clientController");
const { getAllModules, getModuleById, createModule, updateModule, deleteModule } = require("../controllers/moduleController");
const { createType, getAllTypes, getTypeById, updateType, deleteType, deleteTypeWithSubtypes } = require("../controllers/typeController");
const { createSubtype, getAllSubtypes, getSubtypeById, updateSubtype, deleteSubtype } = require("../controllers/subtypeController");
const { getAllResourceTypes } = require("../controllers/resourceTypeController");
const { getAllUsers } = require("../controllers/userController");
const { body } = require("express-validator");

const router = express.Router();

// Client routes with validation
router.get("/clients", authenticate, authorizeRoles(["admin", "user"]), getAllClients);
router.post("/clients", 
    authenticate, 
    authorizeRoles(["admin"]),
    [
        body("name").trim().notEmpty().withMessage("Name is required"),
        body("description").optional().trim()
    ],
    createClient
);
router.get("/clients/:id", authenticate, authorizeRoles(["admin", "user"]), getClientById);
router.put("/clients/:id", authenticate, authorizeRoles(["admin"]), updateClient);
router.delete("/clients/:id", authenticate, authorizeRoles(["admin"]), deleteClient);

// Module routes
router.get("/modules", authenticate, authorizeRoles(["admin", "user"]), getAllModules);
router.post("/modules", 
    authenticate, 
    authorizeRoles(["admin"]),
    [
        body("name").trim().notEmpty().withMessage("Name is required"),
        body("description").optional().trim()
    ],
    createModule
);
router.get("/modules/:id", authenticate, authorizeRoles(["admin", "user"]), getModuleById);
router.put("/modules/:id", authenticate, authorizeRoles(["admin"]), updateModule);
router.delete("/modules/:id", authenticate, authorizeRoles(["admin"]), deleteModule);

// Type routes
router.get("/types", authenticate, authorizeRoles(["admin", "user"]), getAllTypes);
router.post("/types", 
    authenticate, 
    authorizeRoles(["admin"]),
    [
        body("name").trim().notEmpty().withMessage("Name is required"),
        body("description").optional().trim()
    ],
    createType
);
router.get("/types/:id", authenticate, authorizeRoles(["admin", "user"]), getTypeById);
router.put("/types/:id", authenticate, authorizeRoles(["admin"]), updateType);
router.delete("/types/:id", authenticate, authorizeRoles(["admin"]), deleteType);
router.delete("/types/:id/with-subtypes", authenticate, authorizeRoles(["admin"]), deleteTypeWithSubtypes);

// Subtype routes
router.get("/subtypes", authenticate, authorizeRoles(["admin", "user"]), getAllSubtypes);
router.post("/subtypes", 
    authenticate, 
    authorizeRoles(["admin"]),
    [
        body("name").trim().notEmpty().withMessage("Name is required"),
        body("typeId").notEmpty().withMessage("Type is required"),
        body("description").optional().trim()
    ],
    createSubtype
);
router.get("/subtypes/:id", authenticate, authorizeRoles(["admin", "user"]), getSubtypeById);
router.put("/subtypes/:id", authenticate, authorizeRoles(["admin"]), updateSubtype);
router.delete("/subtypes/:id", authenticate, authorizeRoles(["admin"]), deleteSubtype);

// Resource types route
router.get("/resource-types", authenticate, authorizeRoles(["admin", "user"]), getAllUsers);

module.exports = router;