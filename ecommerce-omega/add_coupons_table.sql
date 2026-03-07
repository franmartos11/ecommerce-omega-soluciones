-- Script para crear la tabla de Cupones de Descuento
-- Ejecutar en el SQL Editor de Supabase

CREATE TABLE IF NOT EXISTS public.coupons (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT UNIQUE NOT NULL, -- Ej: 'VERANO20'
  discount_type TEXT NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
  discount_value NUMERIC NOT NULL CHECK (discount_value > 0),
  max_uses INTEGER, -- Nulo significa usos ilimitados
  times_used INTEGER DEFAULT 0,
  expires_at TIMESTAMP WITH TIME ZONE, -- Nulo significa que no vence
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW())
);

-- Row Level Security (RLS)
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;

-- Política: Cualquiera puede LEER los cupones activos (para que el checkout los valide)
CREATE POLICY "Permitir select a todos los cupones activos" 
ON public.coupons FOR SELECT 
USING (is_active = true);

-- Políticas de Admin (Para desarrollo permitimos todo, en prod se asocia a rol admin)
CREATE POLICY "Permitir todo a admin (desarrollo, tabla coupons)" 
ON public.coupons FOR ALL USING (true);
