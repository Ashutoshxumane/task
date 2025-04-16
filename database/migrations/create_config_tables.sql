-- Create resource_types table
CREATE TABLE IF NOT EXISTS resource_types (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT 1,
    created_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_by INT,
    updated_at TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES employees(id),
    FOREIGN KEY (updated_by) REFERENCES employees(id)
);

-- Create resource_subtypes table
CREATE TABLE IF NOT EXISTS resource_subtypes (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    type_id INT NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT 1,
    created_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_by INT,
    updated_at TIMESTAMP,
    FOREIGN KEY (type_id) REFERENCES resource_types(id),
    FOREIGN KEY (created_by) REFERENCES employees(id),
    FOREIGN KEY (updated_by) REFERENCES employees(id)
);

-- Add indexes for better performance
CREATE INDEX idx_resource_types_name ON resource_types(name);
CREATE INDEX idx_resource_subtypes_name ON resource_subtypes(name);
CREATE INDEX idx_resource_subtypes_type_id ON resource_subtypes(type_id);

-- Add unique constraints
ALTER TABLE resource_types ADD UNIQUE INDEX uk_resource_types_name (name);
ALTER TABLE resource_subtypes ADD UNIQUE INDEX uk_resource_subtypes_name_type (name, type_id); 