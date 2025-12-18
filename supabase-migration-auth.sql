-- ====================================================
-- UPDATE USERS TABLE FOR SUPABASE AUTH
-- Run this to update the users table schema
-- ====================================================

-- Drop password_hash column (Supabase Auth handles passwords)
ALTER TABLE users DROP COLUMN IF EXISTS password_hash;

-- Make name column NOT NULL with default value
ALTER TABLE users ALTER COLUMN name SET DEFAULT '' ;

-- Update existing admin user if needed
-- Note: Admin password needs to be set in Supabase Auth dashboard manually
-- Or use SQL to create auth user:

/*
-- To create admin account in Supabase Auth (run in SQL Editor):
-- Replace 'your-secure-password' with actual password

-- First, register admin via the app UI at /register, then update role:
UPDATE users SET role = 'admin' WHERE email = 'admin@artinfinity7.com';

-- Or if you have the auth.users ID, insert directly:
-- INSERT INTO users (id, email, name, role) 
-- VALUES ('auth-user-id-here', 'admin@artinfinity7.com', 'Admin', 'admin');
*/
