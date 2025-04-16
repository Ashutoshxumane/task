-- Clients table
CREATE TABLE IF NOT EXISTS clients (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  email VARCHAR(255) NOT NULL UNIQUE,
  phone VARCHAR(20),
  address TEXT,
  description TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_by INT NOT NULL,
  updated_by INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (created_by) REFERENCES employees(id),
  FOREIGN KEY (updated_by) REFERENCES employees(id)
);

-- Client auth table (needed for client login)
CREATE TABLE IF NOT EXISTS client_auth (
  id INT AUTO_INCREMENT PRIMARY KEY,
  client_id INT NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  salt VARCHAR(255) NOT NULL,
  auth_provider VARCHAR(50) DEFAULT 'local',
  FOREIGN KEY (client_id) REFERENCES clients(id)
);

-- Client sessions table
CREATE TABLE IF NOT EXISTS client_sessions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  client_id INT NOT NULL,
  token_hash VARCHAR(255) NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  expires_at TIMESTAMP,
  ip_address VARCHAR(45),
  browser VARCHAR(255),
  os VARCHAR(255),
  device_type VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_active_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  timezone VARCHAR(50),
  FOREIGN KEY (client_id) REFERENCES clients(id)
);

-- Client login logs table
CREATE TABLE IF NOT EXISTS client_login_logs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  client_id INT NOT NULL,
  login_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  ip_address VARCHAR(45),
  browser VARCHAR(255),
  os VARCHAR(255),
  device_type VARCHAR(50),
  timezone VARCHAR(50),
  status VARCHAR(20),
  failure_reason TEXT,
  FOREIGN KEY (client_id) REFERENCES clients(id)
); 