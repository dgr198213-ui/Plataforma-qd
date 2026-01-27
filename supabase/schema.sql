-- Esquema Seguro para Howard OS / Plataforma-qd
-- Este esquema vincula los datos a cada usuario de Supabase Auth para máxima seguridad.

-- 1. Tabla de Credenciales
CREATE TABLE IF NOT EXISTS public.credentials (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID DEFAULT auth.uid() NOT NULL, -- Vinculado al usuario autenticado
    name TEXT NOT NULL,
    username TEXT,
    encrypted_value TEXT NOT NULL,
    category TEXT DEFAULT 'General',
    notes TEXT,
    icon TEXT DEFAULT 'Key',
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.credentials ENABLE ROW LEVEL SECURITY;

-- Eliminar políticas antiguas si existen
DROP POLICY IF EXISTS "Permitir todo a usuarios autenticados" ON public.credentials;

-- Políticas Seguras (Solo el dueño puede ver/editar sus propios datos)
CREATE POLICY "Usuarios pueden ver sus propias credenciales" 
ON public.credentials FOR SELECT 
TO authenticated 
USING (auth.uid() = user_id);

CREATE POLICY "Usuarios pueden insertar sus propias credenciales" 
ON public.credentials FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuarios pueden actualizar sus propias credenciales" 
ON public.credentials FOR UPDATE 
TO authenticated 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuarios pueden eliminar sus propias credenciales" 
ON public.credentials FOR DELETE 
TO authenticated 
USING (auth.uid() = user_id);


-- 2. Tabla de Proyectos
CREATE TABLE IF NOT EXISTS public.projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID DEFAULT auth.uid() NOT NULL, -- Vinculado al usuario autenticado
    name TEXT NOT NULL,
    description TEXT,
    files JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- Eliminar políticas antiguas si existen
DROP POLICY IF EXISTS "Permitir todo en proyectos a usuarios autenticados" ON public.projects;

-- Políticas Seguras para Proyectos
CREATE POLICY "Usuarios pueden ver sus propios proyectos" 
ON public.projects FOR SELECT 
TO authenticated 
USING (auth.uid() = user_id);

CREATE POLICY "Usuarios pueden insertar sus propios proyectos" 
ON public.projects FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuarios pueden actualizar sus propios proyectos" 
ON public.projects FOR UPDATE 
TO authenticated 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuarios pueden eliminar sus propios proyectos" 
ON public.projects FOR DELETE 
TO authenticated 
USING (auth.uid() = user_id);
