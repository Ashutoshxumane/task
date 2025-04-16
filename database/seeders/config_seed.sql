-- Insert sample resource types
INSERT INTO resource_types (name, description, created_by) VALUES
('Development', 'Software development resources', 1),
('Testing', 'Testing and QA resources', 1),
('Design', 'UI/UX design resources', 1),
('Documentation', 'Technical documentation resources', 1),
('Infrastructure', 'Infrastructure and DevOps resources', 1);

-- Insert sample resource subtypes
INSERT INTO resource_subtypes (name, type_id, description, created_by) VALUES
('Frontend Development', 1, 'Frontend development resources', 1),
('Backend Development', 1, 'Backend development resources', 1),
('Mobile Development', 1, 'Mobile app development resources', 1),
('New Testing', 2, 'New feature testing resources', 1),
('Regression Testing', 2, 'Regression testing resources', 1),
('Performance Testing', 2, 'Performance testing resources', 1),
('UI Design', 3, 'User interface design resources', 1),
('UX Design', 3, 'User experience design resources', 1),
('API Documentation', 4, 'API documentation resources', 1),
('User Guides', 4, 'User guide documentation resources', 1),
('Cloud Infrastructure', 5, 'Cloud infrastructure resources', 1),
('DevOps', 5, 'DevOps resources', 1); 