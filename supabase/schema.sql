-- Esquema para Howard OS / Plataforma-qd

-- 1. Tabla de Credenciales
CREATE TABLE IF NOT EXISTS public.credentials (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    username TEXT,
    encrypted_value TEXT NOT NULL,
    category TEXT DEFAULT 'General',
    notes TEXT,
    icon TEXT DEFAULT 'Key',
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Habilitar RLS (Row Level Security)
ALTER TABLE public.credentials ENABLE ROW LEVEL SECURITY;

-- 3. Políticas de acceso (Por ahora permitimos acceso total para simplificar la corrección, 
-- pero en producción debería estar vinculado al user_id de Supabase Auth)
CREATE POLICY "Permitir todo a usuarios autenticados" 
ON public.credentials 
FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);

-- 4. Tabla de Proyectos (Opcional, según lo visto en el código)
CREATE TABLE IF NOT EXISTS public.projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    files JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Permitir todo en proyectos a usuarios autenticados" 
ON public.projects 
FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);
