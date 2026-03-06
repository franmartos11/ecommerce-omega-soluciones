-- ==========================================
-- SCRIPT DE INICIALIZACIÓN PARA SUPABASE
-- ==========================================
-- Ejecuta esto en el "SQL Editor" de tu panel de Supabase.

-- 1. Tabla de Usuarios (Se sincroniza con Supabase Auth)
-- Cada vez que alguien se registra, la data de negocio se guarda aquí.
CREATE TABLE public.users (
  id UUID REFERENCES auth.users NOT NULL PRIMARY KEY,
  email TEXT,
  display_name TEXT,
  role TEXT DEFAULT 'user',
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW())
);

-- Habilitar Row Level Security (RLS) para la tabla de usuarios
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Políticas básicas para usuarios (Opcional pero recomendado en Supabase)
-- Un usuario puede leer y actualizar su propio perfil
CREATE POLICY "Los usuarios pueden ver su propio perfil" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Los usuarios pueden actualizar su propio perfil" ON public.users
  FOR UPDATE USING (auth.uid() = id);


-- ==========================================


-- 2. Tabla de Órdenes / Ventas
-- Guardaremos todo el carrito "items" y el "shipping" como JSONB
-- para máxima flexibilidad sin armar 5 tablas relacionales complicadas.
CREATE TABLE public.orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  status TEXT DEFAULT 'pendiente',
  payment_method TEXT NOT NULL,
  total NUMERIC NOT NULL,
  items JSONB NOT NULL,
  shipping JSONB NOT NULL,
  user_email TEXT,
  reference TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW())
);

-- Habilitar Row Level Security (RLS) en órdenes (Recomendado)
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Política provisoria (Solo para desarrollo, en producción deberías restringir más):
-- Permitimos que usuarios anónimos o logueados puedan INSERTAR ordenes (cuando compran)
CREATE POLICY "Cualquiera puede insertar ordenes" ON public.orders
  FOR INSERT WITH CHECK (true);

-- IMPORTANTE PARA TU PANEL ADMIN:
-- Si vas a usar un backend interno de NextJS (Rutas API /api/admin/orders),
-- esas llamadas deberían usar el "Service Role Key" para bypassear RLS.
-- Si usas el Anon Key en el cliente del panel, asegúrate de crear una política de SELECT.
CREATE POLICY "Permitir select a todos (Solo Desarrollo)" ON public.orders
  FOR SELECT USING (true);
  
CREATE POLICY "Permitir update a todos (Solo Desarrollo)" ON public.orders
  FOR UPDATE USING (true);


-- ==========================================


-- 3. TRIGGER AUTOMÁTICO PARA USUARIOS (Opcional pero muy útil)
-- Esto inserta un registro en public.users automáticamente cada
-- vez que alguien se registra con éxito en Supabase Auth.
CREATE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, display_name)
  VALUES (new.id, new.email, new.raw_user_meta_data->>'display_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();


-- ==========================================


-- 4. Tabla de Productos (Catálogo)
CREATE TABLE public.products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  price NUMERIC NOT NULL,
  old_price NUMERIC,
  stock INTEGER DEFAULT 0,
  sku TEXT,
  tags JSONB DEFAULT '[]'::jsonb,
  mfg TEXT,
  life TEXT,
  rating NUMERIC DEFAULT 5.0,
  color TEXT,
  badge_text TEXT,
  badge_color TEXT,
  image_url TEXT,
  gallery_urls JSONB DEFAULT '[]'::jsonb,
  category TEXT,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW())
);

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Permitir select a todos" ON public.products FOR SELECT USING (true);
CREATE POLICY "Permitir all a admin (desarrollo)" ON public.products FOR ALL USING (true);


-- ==========================================


-- 5. STORAGE BUCKET: products
-- Script para crear el bucket de productos y permitir acceso público

-- Inserta el bucket si no existe
INSERT INTO storage.buckets (id, name, public) 
VALUES ('products', 'products', true)
ON CONFLICT (id) DO NOTHING;

-- Política para permitir que cualquiera pueda ver/descargar las imágenes (Público)
CREATE POLICY "Imágenes públicas de productos" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'products');

-- Política para permitir subida de imágenes (Para desarrollo permitimos a todos)
CREATE POLICY "Permitir subida de imágenes a todos (desarrollo)" 
ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'products');

-- Política para actualizar imágenes
CREATE POLICY "Permitir update de imágenes a todos (desarrollo)" 
ON storage.objects FOR UPDATE
USING (bucket_id = 'products');

-- ==========================================


-- 6. Tabla de Categorías
-- Guarda jerarquías, nombre, y slug para uso en URLs y filtros de tienda.
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nombre TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  icon_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW())
);

ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Permitir select de cat a todos" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Permitir all de cat a admin (desarrollo)" ON public.categories FOR ALL USING (true);


-- ==========================================


-- 7. Tabla de Configuraciones del Sitio (Site Settings)
-- Guarda ajustes globales (carruseles, redes, textos extra)
CREATE TABLE IF NOT EXISTS public.site_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT UNIQUE NOT NULL,
  value JSONB NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW())
);

ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Permitir select settings a todos" ON public.site_settings FOR SELECT USING (true);
CREATE POLICY "Permitir all settings a admin" ON public.site_settings FOR ALL USING (true);

-- Insertar configuración inicial por defecto para el Banner Principal
INSERT INTO public.site_settings (key, value) 
VALUES ('hero_banners', '["/banner1.webp", "/banner2.webp", "/banner3.webp"]'::jsonb)
ON CONFLICT (key) DO NOTHING;

-- ==========================================

-- 8. Reseñas de Productos (Reviews)
CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  user_name TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  status TEXT DEFAULT 'approved', -- 'approved', 'pending', 'rejected'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW())
);

ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public reviews are viewable by everyone" ON public.reviews FOR SELECT USING (status = 'approved');
CREATE POLICY "Anyone can insert a review" ON public.reviews FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin update reviews" ON public.reviews FOR UPDATE USING (true);
CREATE POLICY "Admin delete reviews" ON public.reviews FOR DELETE USING (true);

