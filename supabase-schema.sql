-- ====================================================
-- ARTINFINITY7 DATABASE SCHEMA
-- SQL Script untuk Setup Supabase Database
-- ====================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ====================================================
-- 1. CATEGORIES TABLE
-- ====================================================
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default categories
INSERT INTO categories (name) VALUES
  ('Posters'),
  ('UI Kits'),
  ('Banners'),
  ('Social Media'),
  ('Branding'),
  ('Templates');

-- ====================================================
-- 2. USERS TABLE
-- ====================================================
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  name VARCHAR(255),
  role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default admin user
-- Email: admin@artinfinity7.com
-- Password: admin123 (untuk development/testing)
-- NOTE: Hash ini hanya contoh, untuk production gunakan hash yang proper!
INSERT INTO users (email, password_hash, name, role) VALUES
  ('admin@artinfinity7.com', '$2a$10$K7L5S4r6qP8Ug5Zv3nW7yuXvT9dK4xH8qF2sL1mP6nR7wE3gT5hJK', 'Admin', 'admin');

-- ====================================================
-- 3. PRODUCTS TABLE
-- ====================================================
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  price DECIMAL(10, 2) NOT NULL CHECK (price >= 0),
  image_url TEXT NOT NULL,
  file_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster category queries
CREATE INDEX idx_products_category ON products(category_id);

-- ====================================================
-- 4. ORDERS TABLE
-- ====================================================
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  total_price DECIMAL(10, 2) NOT NULL CHECK (total_price >= 0),
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster user order queries
CREATE INDEX idx_orders_user ON orders(user_id);

-- ====================================================
-- 5. ORDER_ITEMS TABLE
-- ====================================================
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  price DECIMAL(10, 2) NOT NULL CHECK (price >= 0),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for faster queries
CREATE INDEX idx_order_items_order ON order_items(order_id);
CREATE INDEX idx_order_items_product ON order_items(product_id);

-- ====================================================
-- TRIGGERS FOR UPDATED_AT
-- ====================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_products_updated_at
BEFORE UPDATE ON products
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- ====================================================
-- SAMPLE DATA (Optional - Uncomment untuk testing)
-- ====================================================
/*
INSERT INTO products (title, description, category_id, price, image_url, file_url)
VALUES
  (
    'Modern Minimalist Poster',
    'Clean and elegant poster design perfect for any space',
    (SELECT id FROM categories WHERE name = 'Posters'),
    15.99,
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400',
    'https://example.com/download/poster1.zip'
  ),
  (
    'Mobile UI Kit - Dark Theme',
    'Complete mobile UI kit with 50+ screens',
    (SELECT id FROM categories WHERE name = 'UI Kits'),
    49.99,
    'https://images.unsplash.com/photo-1555421689-d68471e189f2?w=400',
    'https://example.com/download/uikit1.zip'
  ),
  (
    'Social Media Banner Pack',
    'Professional banners for all social media platforms',
    (SELECT id FROM categories WHERE name = 'Banners'),
    24.99,
    'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400',
    'https://example.com/download/banner1.zip'
  ),
  (
    'Instagram Story Templates',
    'Trendy and engaging Instagram story templates',
    (SELECT id FROM categories WHERE name = 'Social Media'),
    19.99,
    'https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=400',
    'https://example.com/download/insta1.zip'
  ),
  (
    'Complete Brand Identity Kit',
    'Everything you need for a cohesive brand identity',
    (SELECT id FROM categories WHERE name = 'Branding'),
    79.99,
    'https://images.unsplash.com/photo-1634942537034-2531766767d1?w=400',
    'https://example.com/download/brand1.zip'
  ),
  (
    'Landing Page Template',
    'Modern responsive landing page template',
    (SELECT id FROM categories WHERE name = 'Templates'),
    34.99,
    'https://images.unsplash.com/photo-1547658719-da2b51169166?w=400',
    'https://example.com/download/template1.zip'
  );
*/
