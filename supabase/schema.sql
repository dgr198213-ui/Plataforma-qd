-- Esquema Idempotente y Seguro para Howard OS / Plataforma-qd
-- Este script se puede ejecutar varias veces sin causar errores.

-- 1. Limpieza de políticas previas (Idempotencia robusta)
-- Este bloque busca y elimina cualquier política con los nombres que usamos, sin importar la tabla.
DO $$ 
DECLARE
    pol RECORD;
BEGIN
    FOR pol IN
        SELECT policyname, tablename
        FROM pg_policies
        WHERE schemaname = 'public' AND policyname IN (
            'Usuarios pueden ver sus propias credenciales',
            'Usuarios pueden insertar sus propias credenciales',
            'Usuarios pueden actualizar sus propias credenciales',
            'Usuarios pueden eliminar sus propias credenciales',
            'Permitir todo a usuarios autenticados',
            'Usuarios pueden ver sus propios proyectos',
            'Usuarios pueden insertar sus propios proyectos',
            'Usuarios pueden actualizar sus propios proyectos',
            'Usuarios pueden eliminar sus propios proyectos',
            'Permitir todo en proyectos a usuarios autenticados',
            'Usuarios pueden ver archivos de sus proyectos',
            'Usuarios pueden insertar archivos en sus proyectos',
            'Usuarios pueden actualizar archivos de sus proyectos',
            'Usuarios pueden eliminar archivos de sus proyectos'
        )
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', pol.policyname, pol.tablename);
    END LOOP;
END $$;

-- 2. Creación/Actualización de la Tabla de Credenciales
CREATE TABLE IF NOT EXISTS public.credentials (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID DEFAULT auth.uid() NOT NULL,
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

-- Aplicar Políticas Seguras
CREATE POLICY "Usuarios pueden ver sus propias credenciales" ON public.credentials FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Usuarios pueden insertar sus propias credenciales" ON public.credentials FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Usuarios pueden actualizar sus propias credenciales" ON public.credentials FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Usuarios pueden eliminar sus propias credenciales" ON public.credentials FOR DELETE TO authenticated USING (auth.uid() = user_id);


-- 3. Creación/Actualización de la Tabla de Proyectos
CREATE TABLE IF NOT EXISTS public.projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID DEFAULT auth.uid() NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    files JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- Aplicar Políticas Seguras
CREATE POLICY "Usuarios pueden ver sus propios proyectos" ON public.projects FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Usuarios pueden insertar sus propios proyectos" ON public.projects FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Usuarios pueden actualizar sus propios proyectos" ON public.projects FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Usuarios pueden eliminar sus propios proyectos" ON public.projects FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- 4. Creación de la Tabla de Archivos (Para el CodeEditor)
CREATE TABLE IF NOT EXISTS public.files (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    path TEXT NOT NULL,
    language TEXT NOT NULL,
    content TEXT DEFAULT '',
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Habilitar RLS en files
ALTER TABLE public.files ENABLE ROW LEVEL SECURITY;

-- Políticas para files (Basadas en el acceso al proyecto)
CREATE POLICY "Usuarios pueden ver archivos de sus proyectos" 
ON public.files FOR SELECT 
TO authenticated 
USING (EXISTS (SELECT 1 FROM public.projects WHERE id = files.project_id AND user_id = auth.uid()));

CREATE POLICY "Usuarios pueden insertar archivos en sus proyectos" 
ON public.files FOR INSERT 
TO authenticated 
WITH CHECK (EXISTS (SELECT 1 FROM public.projects WHERE id = files.project_id AND user_id = auth.uid()));

CREATE POLICY "Usuarios pueden actualizar archivos de sus proyectos" 
ON public.files FOR UPDATE 
TO authenticated 
USING (EXISTS (SELECT 1 FROM public.projects WHERE id = files.project_id AND user_id = auth.uid()))
WITH CHECK (EXISTS (SELECT 1 FROM public.projects WHERE id = files.project_id AND user_id = auth.uid()));

CREATE POLICY "Usuarios pueden eliminar archivos de sus proyectos" 
ON public.files FOR DELETE 
TO authenticated 
USING (EXISTS (SELECT 1 FROM public.projects WHERE id = files.project_id AND user_id = auth.uid()));
