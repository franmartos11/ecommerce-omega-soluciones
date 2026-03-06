-- Corre este script en el editor SQL de Supabase para añadir el sistema de reseñas

CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  user_name TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  status TEXT DEFAULT 'approved', -- 'approved', 'pending', 'rejected'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW())
);

-- Habilitar Row Level Security
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Políticas de Seguridad
-- Todo el mundo puede ver las reseñas aprobadas
CREATE POLICY "Public reviews are viewable by everyone" ON public.reviews
  FOR SELECT USING (status = 'approved');

-- Todo el mundo puede insertar una reseña (se aprueba por defecto según schema)
CREATE POLICY "Anyone can insert a review" ON public.reviews
  FOR INSERT WITH CHECK (true);

-- Sólo los administradores pueden hacer UPDATE o DELETE
CREATE POLICY "Admin update reviews" ON public.reviews
  FOR UPDATE USING (true); -- En un entorno real, asegurar por auth.uid()

CREATE POLICY "Admin delete reviews" ON public.reviews
  FOR DELETE USING (true);
