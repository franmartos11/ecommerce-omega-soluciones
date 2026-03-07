-- add_product_variants.sql

-- 1. Create the product_variants table
CREATE TABLE IF NOT EXISTS public.product_variants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    name TEXT NOT NULL, -- e.g., "Color: Rojo", "Talle: XL"
    sku TEXT,
    price DECIMAL(10, 2), -- Optional specific price, if null, fallback to product price
    stock INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for product_variants
ALTER TABLE public.product_variants ENABLE ROW LEVEL SECURITY;

-- Allow everything for now to match local development settings
DROP POLICY IF EXISTS "Public profiles are viewable by everyone." ON public.product_variants;
DROP POLICY IF EXISTS "Users can insert variants" ON public.product_variants;
DROP POLICY IF EXISTS "Users can update variants" ON public.product_variants;
DROP POLICY IF EXISTS "Users can delete variants" ON public.product_variants;

CREATE POLICY "Enable read access for all users" ON public.product_variants FOR SELECT USING (true);
CREATE POLICY "Enable insert for all users" ON public.product_variants FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for all users" ON public.product_variants FOR UPDATE USING (true);
CREATE POLICY "Enable delete for all users" ON public.product_variants FOR DELETE USING (true);
