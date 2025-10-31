/*
  # Create Products Table for E-Commerce Application

  1. New Tables
    - `products`
      - `id` (uuid, primary key) - Unique identifier
      - `name` (text) - Product name
      - `slug` (text, unique) - URL-friendly identifier
      - `description` (text) - Product description
      - `price` (numeric) - Product price
      - `category` (text) - Product category
      - `inventory` (integer) - Stock quantity
      - `last_updated` (timestamptz) - Last update timestamp
      - `created_at` (timestamptz) - Creation timestamp

  2. Security
    - Enable RLS on `products` table
    - Add policy for public read access (e-commerce site needs public product viewing)
    - Add policy for authenticated admin operations (insert, update)

  3. Notes
    - Slug field is unique for SEO-friendly URLs
    - Inventory tracking for dashboard statistics
    - Default values for timestamps
*/

CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text NOT NULL DEFAULT '',
  price numeric NOT NULL DEFAULT 0,
  category text NOT NULL DEFAULT 'general',
  inventory integer NOT NULL DEFAULT 0,
  last_updated timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view products"
  ON products
  FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Authenticated can insert products"
  ON products
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated can update products"
  ON products
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated can delete products"
  ON products
  FOR DELETE
  TO authenticated
  USING (true);

-- Insert sample products for demonstration
INSERT INTO products (name, slug, description, price, category, inventory) VALUES
('Laptop Pro 15"', 'laptop-pro-15', 'High-performance laptop with 16GB RAM and 512GB SSD', 1299.99, 'Electronics', 12),
('Wireless Mouse', 'wireless-mouse', 'Ergonomic wireless mouse with precision tracking', 29.99, 'Electronics', 45),
('Mechanical Keyboard', 'mechanical-keyboard', 'RGB mechanical keyboard with blue switches', 89.99, 'Electronics', 23),
('USB-C Hub', 'usb-c-hub', '7-in-1 USB-C hub with HDMI and USB 3.0 ports', 49.99, 'Accessories', 8),
('Laptop Stand', 'laptop-stand', 'Adjustable aluminum laptop stand', 39.99, 'Accessories', 3),
('Noise Cancelling Headphones', 'noise-cancelling-headphones', 'Premium wireless headphones with active noise cancellation', 249.99, 'Audio', 18),
('Portable SSD 1TB', 'portable-ssd-1tb', 'Fast external SSD with USB-C connectivity', 129.99, 'Storage', 2),
('Webcam HD', 'webcam-hd', '1080p HD webcam with auto-focus', 79.99, 'Electronics', 15),
('Phone Stand', 'phone-stand', 'Adjustable phone stand for desk', 19.99, 'Accessories', 34),
('Monitor 27"', 'monitor-27', '27-inch 4K monitor with IPS panel', 399.99, 'Electronics', 7);
