-- Database schema for HEVER E-commerce

CREATE DATABASE IF NOT EXISTS hever_ecommerce;
USE hever_ecommerce;

-- Categories table
CREATE TABLE categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    image VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Products table
CREATE TABLE products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    image VARCHAR(500),
    category_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
);

-- Insert sample categories
INSERT INTO categories (name, description, image) VALUES
('Pagnes', 'Collection de pagnes traditionnels africains', 'https://images.unsplash.com/photo-1583394838336-acd977736f90?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80'),
('Chaussures', 'Chaussures modernes et confortables', 'https://images.unsplash.com/photo-1549298916-b41d501d3772?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80'),
('Habits', 'Vêtements élégants pour toutes occasions', 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80'),
('Complets', 'Complets cousus sur mesure', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80'),
('Autres', 'Divers articles et accessoires', 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80');

-- Insert sample products
INSERT INTO products (name, description, price, image, category_id) VALUES
('Pagne Wax Coloré', 'Magnifique pagne wax aux couleurs vives', 25.00, 'https://images.unsplash.com/photo-1583394838336-acd977736f90?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80', 1),
('Chaussures de Sport', 'Chaussures confortables pour le sport', 50.00, 'https://images.unsplash.com/photo-1549298916-b41d501d3772?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80', 2),
('T-Shirt Blanc', 'T-shirt basique en coton', 15.00, 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80', 3),
('Complet Classique', 'Complet élégant pour occasions spéciales', 100.00, 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80', 4),
('Sac à Main', 'Sac à main en cuir véritable', 30.00, 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80', 5);