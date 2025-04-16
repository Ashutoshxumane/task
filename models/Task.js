const db = require('../config/db');

class Task {
    static async create(taskData) {
        const query = `
            INSERT INTO tasks (
                title, details, client_id, module_id, resource_id,
                type_id, subtype_id, hours_spent, date,
                created_by, updated_by
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        
        const values = [
            taskData.title,
            taskData.details,
            taskData.client_id,
            taskData.module_id,
            taskData.resource_id,
            taskData.type_id,
            taskData.subtype_id,
            taskData.hours_spent,
            taskData.date,
            taskData.created_by,
            taskData.updated_by
        ];

        try {
            const [result] = await db.query(query, values);
            return result.insertId;
        } catch (error) {
            throw error;
        }
    }

    static async findAll(filters = {}) {
        let query = `
             SELECT t.*, 
                   c.name as client_name,
                   m.name as module_name,
                   e.first_name as resource_name,
                   ty.name as type_name,
                   st.name as subtype_name
            FROM tasks t
            LEFT JOIN clients c ON t.client_id = c.id
            LEFT JOIN modules m ON t.module_id = m.id
            LEFT JOIN employees e ON t.resource_id = e.id
            LEFT JOIN types ty ON t.type_id = ty.id
            LEFT JOIN subtypes st ON t.subtype_id = st.id
            WHERE t.is_active = 1
        `;
        
        const values = [];
        
        if (filters.date) {
            query += ' AND t.date = ?';
            values.push(filters.date);
        }
        
        if (filters.client_id) {
            query += ' AND t.client_id = ?';
            values.push(filters.client_id);
        }
        
        if (filters.resource_id) {
            query += ' AND t.resource_id = ?';
            values.push(filters.resource_id);
        }

        try {
            const [tasks] = await db.query(query, values);
            return tasks;
        } catch (error) {
            throw error;
        }
    }

    static async findById(id) {
        const query = `
            SELECT t.*, 
                   c.name as client_name,
                   m.name as module_name,
                   e.first_name as resource_name,
                   ty.name as type_name,
                   st.name as subtype_name
            FROM tasks t
            LEFT JOIN clients c ON t.client_id = c.id
            LEFT JOIN modules m ON t.module_id = m.id
            LEFT JOIN employees e ON t.resource_id = e.id
            LEFT JOIN types ty ON t.type_id = ty.id
            LEFT JOIN subtypes st ON t.subtype_id = st.id
            WHERE t.id = ? AND t.is_active = 1
        `;

        try {
            const [tasks] = await db.query(query, [id]);
            return tasks[0];
        } catch (error) {
            throw error;
        }
    }

    static async update(id, taskData) {
        const query = `
            UPDATE tasks 
            SET title = ?,
                details = ?,
                client_id = ?,
                module_id = ?,
                resource_id = ?,
                type_id = ?,
                subtype_id = ?,
                hours_spent = ?,
                date = ?,
                updated_by = ?
            WHERE id = ? AND is_active = 1
        `;

        const values = [
            taskData.title,
            taskData.details,
            taskData.client_id,
            taskData.module_id,
            taskData.resource_id,
            taskData.type_id,
            taskData.subtype_id,
            taskData.hours_spent,
            taskData.date,
            taskData.updated_by,
            id
        ];

        try {
            const [result] = await db.query(query, values);
            return result.affectedRows > 0;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = Task; 