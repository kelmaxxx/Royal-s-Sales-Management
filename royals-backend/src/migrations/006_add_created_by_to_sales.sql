-- Add created_by_user_id column to sales table to track who added the sale
ALTER TABLE sales 
ADD COLUMN created_by_user_id BIGINT NULL AFTER recorded_by,
ADD COLUMN created_by_user_name VARCHAR(255) NULL AFTER created_by_user_id;

-- Add index for better query performance
CREATE INDEX idx_sales_created_by ON sales(created_by_user_id);

-- Add comment to describe the columns
ALTER TABLE sales 
MODIFY COLUMN recorded_by VARCHAR(255) COMMENT 'Who made the sale (can be Admin or Staff name)',
MODIFY COLUMN created_by_user_id BIGINT COMMENT 'User ID of who added this sale record',
MODIFY COLUMN created_by_user_name VARCHAR(255) COMMENT 'Name of user who added this sale record';
