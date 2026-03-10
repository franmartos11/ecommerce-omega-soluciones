-- =========================================================================
-- SCRIPT DE SEGURIDAD: BLINDAJE DE RLS (Row Level Security)
-- =========================================================================
-- Instrucciones:
-- 1. Copiá este script entero.
-- 2. Pegalo en el "SQL Editor" de tu panel de Supabase.
-- 3. Hacé click en "Run" (Ejecutar).
-- 
-- Esto cerrará las vulnerabilidades críticas, permitiendo que:
-- - Cualquiera pueda LEER productos, categorías y configuraciones.
-- - Cualquiera pueda COMPRAR (Insertar órdenes).
-- - PERO SOLO TÚ (Admin) puedas modificar productos, configuraciones y ver todas las órdenes.
-- =========================================================================

-- 1. Función Auxiliar para verificar si el usuario actual es Admin
-- Esta función chequea la tabla de usuarios buscando tu rol.
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.users
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ==========================================
-- 2. BLINDANDO LA TABLA `products`
-- ==========================================
-- Borramos las políticas de desarrollo previas
DROP POLICY IF EXISTS "Permitir select a todos" ON public.products;
DROP POLICY IF EXISTS "Permitir all a admin (desarrollo)" ON public.products;

-- Creamos las políticas seguras
CREATE POLICY "Cualquiera puede ver los productos" 
  ON public.products FOR SELECT USING (true);

CREATE POLICY "Solo los admins pueden insertar productos" 
  ON public.products FOR INSERT WITH CHECK (public.is_admin());

CREATE POLICY "Solo los admins pueden modificar productos" 
  ON public.products FOR UPDATE USING (public.is_admin());

CREATE POLICY "Solo los admins pueden borrar productos" 
  ON public.products FOR DELETE USING (public.is_admin());


-- ==========================================
-- 3. BLINDANDO LA TABLA `categories`
-- ==========================================
DROP POLICY IF EXISTS "Permitir select de cat a todos" ON public.categories;
DROP POLICY IF EXISTS "Permitir all de cat a admin (desarrollo)" ON public.categories;

CREATE POLICY "Cualquiera puede ver las categorias" 
  ON public.categories FOR SELECT USING (true);

CREATE POLICY "Solo admins pueden modificar categorias" 
  ON public.categories FOR ALL USING (public.is_admin());


-- ==========================================
-- 4. BLINDANDO LA TABLA `site_settings`
-- ==========================================
DROP POLICY IF EXISTS "Permitir select settings a todos" ON public.site_settings;
DROP POLICY IF EXISTS "Permitir all settings a admin" ON public.site_settings;

CREATE POLICY "Cualquiera puede leer la configuracion" 
  ON public.site_settings FOR SELECT USING (true);

CREATE POLICY "Solo admins pueden modificar la configuracion" 
  ON public.site_settings FOR ALL USING (public.is_admin());


-- ==========================================
-- 5. BLINDANDO LA TABLA `orders`
-- ==========================================
DROP POLICY IF EXISTS "Permitir select a todos (Solo Desarrollo)" ON public.orders;
DROP POLICY IF EXISTS "Permitir update a todos (Solo Desarrollo)" ON public.orders;
DROP POLICY IF EXISTS "Cualquiera puede insertar ordenes" ON public.orders;

-- Todos pueden hacer compras (insertar)
CREATE POLICY "Cualquiera puede hacer una compra" 
  ON public.orders FOR INSERT WITH CHECK (true);

-- IMPORTANTE: Para ver/editar el historial de todas las órdenes, solo admins.
-- NOTA: Como la API de Next.js usa Service Role Key para leer órdenes, no se bloquea.
-- Pero esto bloquea a los hackers desde su navegador.
CREATE POLICY "Solo admins pueden leer todas las ordenes" 
  ON public.orders FOR SELECT USING (public.is_admin());

CREATE POLICY "Solo admins pueden modificar ordenes" 
  ON public.orders FOR UPDATE USING (public.is_admin());

CREATE POLICY "Solo admins pueden borrar ordenes" 
  ON public.orders FOR DELETE USING (public.is_admin());


-- ==========================================
-- 6. BLINDANDO LAS IMÁGENES (Bucket `products`)
-- ==========================================
DROP POLICY IF EXISTS "Permitir subida de imágenes a todos (desarrollo)" ON storage.objects;
DROP POLICY IF EXISTS "Permitir update de imágenes a todos (desarrollo)" ON storage.objects;

CREATE POLICY "Solo admins pueden subir imagenes" 
  ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'products' AND public.is_admin());

CREATE POLICY "Solo admins pueden actualizar imagenes" 
  ON storage.objects FOR UPDATE USING (bucket_id = 'products' AND public.is_admin());

CREATE POLICY "Solo admins pueden borrar imagenes" 
  ON storage.objects FOR DELETE USING (bucket_id = 'products' AND public.is_admin());

-- ¡Listo! Tu base de datos ahora está blindada contra ataques desde el navegador.
