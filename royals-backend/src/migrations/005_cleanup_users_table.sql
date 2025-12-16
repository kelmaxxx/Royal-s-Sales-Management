-- Remove unnecessary email verification columns
ALTER TABLE users DROP COLUMN IF EXISTS email_verify_token;
ALTER TABLE users DROP COLUMN IF EXISTS email_verify_expires;
ALTER TABLE users DROP COLUMN IF EXISTS email_verified;

-- Remove password reset columns
ALTER TABLE users DROP COLUMN IF EXISTS reset_token;
ALTER TABLE users DROP COLUMN IF EXISTS reset_expires;

-- Remove security/locking columns
ALTER TABLE users DROP COLUMN IF EXISTS failed_attempts;
ALTER TABLE users DROP COLUMN IF EXISTS lock_until;
ALTER TABLE users DROP COLUMN IF EXISTS password_changed_at;

-- Remove tracking columns
ALTER TABLE users DROP COLUMN IF EXISTS last_login_at;
ALTER TABLE users DROP COLUMN IF EXISTS updated_at;

-- Show updated table structure
DESCRIBE users;
