-- Script para descontar stock automáticamente tras cada venta (orders)
-- Ejecutar en el SQL Editor de Supabase

-- 1. Crear la función del trigger
CREATE OR REPLACE FUNCTION public.deduct_stock_on_order()
RETURNS trigger AS $$
DECLARE
    item jsonb;
    item_id text;
    item_quantity integer;
    item_variant_id text;
BEGIN
    -- Recorremos cada objeto dentro del array JSONB 'items' de la orden insertada
    FOR item IN SELECT * FROM jsonb_array_elements(NEW.items)
    LOOP
        -- Extraemos el ID del producto, la cantidad comprada, y la variante (si existe)
        item_id := item->>'id';
        item_quantity := (item->>'quantity')::integer;
        item_variant_id := item->>'variantId';
        
        -- Si el ID no es el ítem ficticio del cupón de descuento, descontamos el stock
        IF item_id IS NOT NULL AND item_id != 'discount' THEN
            -- Descuento en producto principal
            UPDATE public.products
            SET stock = GREATEST(0, stock - item_quantity) -- Evita valores negativos
            WHERE id = item_id::uuid;

            -- Descuento en la variante asociada (si el usuario compró una variante específica)
            IF item_variant_id IS NOT NULL THEN
                UPDATE public.product_variants
                SET stock = GREATEST(0, stock - item_quantity)
                WHERE id = item_variant_id::uuid;
            END IF;
        END IF;
    END LOOP;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 2. Eliminar el trigger si ya existía (por las dudas)
DROP TRIGGER IF EXISTS tr_deduct_stock_on_order ON public.orders;

-- 3. Crear el trigger que dispara la función CADA vez que se inserta una row (AFTER INSERT)
CREATE TRIGGER tr_deduct_stock_on_order
AFTER INSERT ON public.orders
FOR EACH ROW
EXECUTE FUNCTION public.deduct_stock_on_order();
