-- Add phone field to users table
-- Note: Run this manually or check if column exists first
ALTER TABLE users 
ADD COLUMN phone VARCHAR(20) DEFAULT NULL AFTER email;

-- Show updated table structure
DESCRIBE users;
