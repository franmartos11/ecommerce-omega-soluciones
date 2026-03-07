-- Migración: Tabla de Libreta de Direcciones del Usuario
-- Relaciona una dirección con un usuario de auth.users de Supabase

CREATE TABLE IF NOT EXISTS public.user_addresses (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    address_line TEXT NOT NULL,
    city TEXT NOT NULL,
    province TEXT NOT NULL,
    postal_code TEXT NOT NULL,
    phone TEXT NOT NULL,
    is_default BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Índices para búsqueda rápida
CREATE INDEX IF NOT EXISTS idx_user_addresses_user_id ON public.user_addresses(user_id);

-- Función para asegurar que solo haya una dirección por defecto por usuario
CREATE OR REPLACE FUNCTION public.handle_default_user_address()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.is_default = true THEN
        UPDATE public.user_addresses 
        SET is_default = false 
        WHERE user_id = NEW.user_id 
        AND id <> NEW.id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para ejecutar la función antes de insertar o actualizar
DROP TRIGGER IF EXISTS ensure_single_default_address ON public.user_addresses;
CREATE TRIGGER ensure_single_default_address
BEFORE INSERT OR UPDATE OF is_default ON public.user_addresses
FOR EACH ROW
WHEN (NEW.is_default = true)
EXECUTE FUNCTION public.handle_default_user_address();

-- Políticas RLS (Row Level Security) para proteger los datos
ALTER TABLE public.user_addresses ENABLE ROW LEVEL SECURITY;

-- Los usuarios solo pueden ver y modificar sus propias direcciones
CREATE POLICY "Users can view their own addresses" 
ON public.user_addresses FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own addresses" 
ON public.user_addresses FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own addresses" 
ON public.user_addresses FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own addresses" 
ON public.user_addresses FOR DELETE 
USING (auth.uid() = user_id);
