-- add_badge_fields.sql

-- Añadir columnas para el control de la etiqueta promocional (Badge)
ALTER TABLE products
ADD COLUMN IF NOT EXISTS badge_text TEXT,
ADD COLUMN IF NOT EXISTS badge_color TEXT;
