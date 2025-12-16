-- Update admin username to 'Admin Kelma' and ensure only one admin
UPDATE users 
SET name = 'Admin Kelma' 
WHERE id = 4;

-- Delete other admin accounts (keep only id 4)
DELETE FROM users 
WHERE role = 'Admin' AND id != 4;

-- Fix any users with 'user' or 'User' role to 'Staff' role
UPDATE users 
SET role = 'Staff' 
WHERE LOWER(role) = 'user';

-- Show results
SELECT id, username, name, email, role FROM users ORDER BY role, id;
