-- EXAMPLE 1: Connect ONE specific employee to a manager using their emails
UPDATE profiles 
SET manager_id = (SELECT id FROM profiles WHERE auth_email = 'manager_email@gmail.com')
WHERE auth_email = 'employee_email@gmail.com';

-- EXAMPLE 2: Connect MULTIPLE employees to the same manager
UPDATE profiles 
SET manager_id = (SELECT id FROM profiles WHERE auth_email = 'manager_email@gmail.com')
WHERE auth_email IN (
    'employee1@gmail.com', 
    'employee2@gmail.com', 
    'employee3@gmail.com'
);

-- EXAMPLE 3: Connect ALL employees in a specific department to a manager
UPDATE profiles 
SET manager_id = (SELECT id FROM profiles WHERE auth_email = 'manager_email@gmail.com')
WHERE department = 'Operations' AND role = 'employee';
