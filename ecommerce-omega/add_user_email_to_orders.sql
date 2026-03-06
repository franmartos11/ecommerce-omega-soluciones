-- Corre este script en el editor SQL de Supabase para añadir el soporte de cuentas de usuario a las compras

ALTER TABLE public.orders
ADD COLUMN IF NOT EXISTS user_email TEXT;

-- Opcional: Puedes indexar esta columna si vas a tener miles de ordenes para que la página de "Mis Compras" cargue más rápido
CREATE INDEX IF NOT EXISTS idx_orders_user_email ON public.orders(user_email);
