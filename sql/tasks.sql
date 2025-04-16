-- Note: Make sure the following tables exist before creating this table:
-- 1. clients
-- 2. modules
-- 3. employees (for resource)
-- 4. types
-- 5. subtypes
-- 6. employees (for created_by and updated_by)

-- Create tasks table with all fields and indexes
CREATE TABLE IF NOT EXISTS tasks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    details TEXT,
    client_id INT NOT NULL,
    module_id INT NOT NULL,
    resource_id INT NOT NULL,
    type_id INT NOT NULL,
    subtype_id INT NOT NULL,
    hours_spent DECIMAL(5,2) NOT NULL,
    date DATE NOT NULL,
    created_by INT NOT NULL,
    updated_by INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    is_active TINYINT(1) DEFAULT 1,
    INDEX idx_client_id (client_id),
    INDEX idx_module_id (module_id),
    INDEX idx_resource_id (resource_id),
    INDEX idx_type_id (type_id),
    INDEX idx_subtype_id (subtype_id),
    INDEX idx_date (date),
    INDEX idx_created_by (created_by),
    CONSTRAINT fk_client FOREIGN KEY (client_id) REFERENCES clients(id),
    CONSTRAINT fk_module FOREIGN KEY (module_id) REFERENCES modules(id),
    CONSTRAINT fk_resource FOREIGN KEY (resource_id) REFERENCES employees(id),
    CONSTRAINT fk_type FOREIGN KEY (type_id) REFERENCES types(id),
    CONSTRAINT fk_subtype FOREIGN KEY (subtype_id) REFERENCES subtypes(id),
    CONSTRAINT fk_created_by FOREIGN KEY (created_by) REFERENCES employees(id),
    CONSTRAINT fk_updated_by FOREIGN KEY (updated_by) REFERENCES employees(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create all indexes in one go
CREATE INDEX idx_tasks_client_id ON tasks(client_id);
CREATE INDEX idx_tasks_module_id ON tasks(module_id);
CREATE INDEX idx_tasks_resource_id ON tasks(resource_id);
CREATE INDEX idx_tasks_type_id ON tasks(type_id);
CREATE INDEX idx_tasks_subtype_id ON tasks(subtype_id);
CREATE INDEX idx_tasks_date ON tasks(date);
CREATE INDEX idx_tasks_created_by ON tasks(created_by); 