-- 7. Tabla de Configuraciones del Sitio (Site Settings)
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
