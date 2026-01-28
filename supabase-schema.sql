-- Tabla para credenciales encriptadas
CREATE TABLE IF NOT EXISTS credentials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  username TEXT,
  encrypted_value TEXT NOT NULL,
  category TEXT,
  notes TEXT,
  icon TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabla para proyectos
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_credentials_name ON credentials(name);
CREATE INDEX IF NOT EXISTS idx_projects_name ON projects(name);
CREATE INDEX IF NOT EXISTS idx_credentials_created_at ON credentials(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_projects_updated_at ON projects(updated_at DESC);

-- Habilitar Row Level Security (RLS)
ALTER TABLE credentials ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Políticas de seguridad básicas (permitir todo para usuarios autenticados)
-- Nota: Ajusta estas políticas según tus necesidades de seguridad

-- Políticas para credentials
DROP POLICY IF EXISTS "Permitir lectura de credenciales" ON credentials;
CREATE POLICY "Permitir lectura de credenciales" 
  ON credentials FOR SELECT 
  USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Permitir inserción de credenciales" ON credentials;
CREATE POLICY "Permitir inserción de credenciales" 
  ON credentials FOR INSERT 
  WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Permitir actualización de credenciales" ON credentials;
CREATE POLICY "Permitir actualización de credenciales" 
  ON credentials FOR UPDATE 
  USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Permitir eliminación de credenciales" ON credentials;
CREATE POLICY "Permitir eliminación de credenciales" 
  ON credentials FOR DELETE 
  USING (auth.role() = 'authenticated');

-- Políticas para projects
DROP POLICY IF EXISTS "Permitir lectura de proyectos" ON projects;
CREATE POLICY "Permitir lectura de proyectos" 
  ON projects FOR SELECT 
  USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Permitir inserción de proyectos" ON projects;
CREATE POLICY "Permitir inserción de proyectos" 
  ON projects FOR INSERT 
  WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Permitir actualización de proyectos" ON projects;
CREATE POLICY "Permitir actualización de proyectos" 
  ON projects FOR UPDATE 
  USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Permitir eliminación de proyectos" ON projects;
CREATE POLICY "Permitir eliminación de proyectos" 
  ON projects FOR DELETE 
  USING (auth.role() = 'authenticated');

-- Trigger para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_credentials_updated_at ON credentials;
CREATE TRIGGER update_credentials_updated_at
  BEFORE UPDATE ON credentials
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_projects_updated_at ON projects;
CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
