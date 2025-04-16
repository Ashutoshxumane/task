const { db } = require("../config/db");

// Get tasks with all related fields
const getTasksWithDetails = async (date = null, startDate = null, endDate = null) => {
    try {
        console.log("Fetching tasks with date range:", { date, startDate, endDate });
        
        let query = db("tasks")
            .select(
                "tasks.*",
                "clients.name as client_name",
                "modules.name as module_name",
                "employees.first_name",
                "employees.last_name",
                "types.name as type_name",
                "subtypes.name as subtype_name"
            )
            .leftJoin("clients", function() {
                this.on("tasks.client_id", "=", "clients.id")
                    .andOn("clients.is_active", "=", db.raw("?", [true]));
            })
            .leftJoin("modules", function() {
                this.on("tasks.module_id", "=", "modules.id")
                    .andOn("modules.is_active", "=", db.raw("?", [true]));
            })
            .leftJoin("employees", function() {
                this.on("tasks.resource_id", "=", "employees.id")
                    .andOn("employees.status", "=", db.raw("?", ["active"]));
            })
            .leftJoin("types", function() {
                this.on("tasks.type_id", "=", "types.id")
                    .andOn("types.is_active", "=", db.raw("?", [true]));
            })
            .leftJoin("subtypes", function() {
                this.on("tasks.subtype_id", "=", "subtypes.id")
                    .andOn("subtypes.is_active", "=", db.raw("?", [true]));
            })
            .where("tasks.is_active", true);

        if (date) {
            query = query.where("tasks.date", date);
        } else if (startDate && endDate) {
            query = query.whereBetween("tasks.date", [startDate, endDate]);
        }

        const tasks = await query.orderBy("tasks.created_at", "desc");
        console.log("Raw tasks from database:", tasks);

        // Format the response to include full resource name
        const formattedTasks = tasks.map(task => ({
            ...task,
            resource_name: task.first_name && task.last_name 
                ? `${task.first_name} ${task.last_name}`
                : null
        }));

        return {
            tasks: formattedTasks,
            pagination: {
                total: formattedTasks.length,
                page: 1,
                limit: 10,
                totalPages: Math.ceil(formattedTasks.length / 10)
            }
        };
    } catch (error) {
        console.error("Error in getTasksWithDetails:", error);
        throw error;
    }
};

// Create a new task
const createTask = async (taskData, createdBy) => {
    const trx = await db.transaction();
    try {
        const [taskId] = await trx("tasks").insert({
            title: taskData.title,
            details: taskData.details || null,
            client_id: taskData.client_id,
            module_id: taskData.module_id,
            resource_id: taskData.resource_id,
            type_id: taskData.type_id,
            subtype_id: taskData.subtype_id,
            hours_spent: taskData.hours_spent,
            date: taskData.date,
            created_by: createdBy,
            updated_by: createdBy,
            created_at: db.fn.now(),
            updated_at: db.fn.now(),
            is_active: true
        });
        await trx.commit();
        return { taskId };
    } catch (error) {
        await trx.rollback();
        throw error;
    }
};

// Get task by title
const getTaskByTitle = async (title) => {
    return db("tasks")
        .where({ title, is_active: true })
        .first();
};

// Get all tasks with pagination and search
const getAllTasks = async (page = 1, limit = 10, search = "", date = null) => {
    const offset = (page - 1) * limit;
    
    const query = db("tasks")
        .where("is_active", true)
        .orderBy("created_at", "desc");

    if (search) {
        query.where(function() {
            this.where("title", "like", `%${search}%`)
                .orWhere("details", "like", `%${search}%`);
        });
    }

    if (date) {
        query.where("date", date);
    }

    const [total] = await query.clone().count("* as total");
    const tasks = await query.offset(offset).limit(limit);

    return {
        tasks,
        pagination: {
            total: parseInt(total.total),
            page,
            limit,
            totalPages: Math.ceil(total.total / limit)
        }
    };
};

// Get task by ID
const getTaskById = async (id) => {
    return db("tasks")
        .where({ id, is_active: true })
        .first();
};

// Update task
const updateTask = async (id, taskData, updatedBy) => {
    const { title, details, client_id, module_id, resource_id, type_id, subtype_id, hours_spent, date } = taskData;
    
    return db("tasks")
        .where({ id, is_active: true })
        .update({
            title,
            details,
            client_id,
            module_id,
            resource_id,
            type_id,
            subtype_id,
            hours_spent,
            date,
            updated_by: updatedBy,
            updated_at: db.fn.now()
        });
};

// Delete task (soft delete)
const deleteTask = async (id, updatedBy) => {
    return db("tasks")
        .where({ id })
        .update({
            is_active: false,
            updated_by: updatedBy,
            updated_at: db.fn.now()
        });
};

module.exports = {
    createTask,
    getTaskByTitle,
    getAllTasks,
    getTaskById,
    updateTask,
    deleteTask,
    getTasksWithDetails
}; 