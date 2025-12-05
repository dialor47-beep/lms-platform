-- SOLUCIÓN ALTERNATIVA: Hacer el bucket completamente público
-- Ya que no podemos deshabilitar RLS en storage.objects,
-- vamos a hacer que el bucket permita todas las operaciones
-- Paso 1: Eliminar todas las políticas restrictivas existentes
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update" ON storage.objects;
-- Paso 2: Crear políticas que permitan TODO a TODOS (para desarrollo)
-- Permitir a TODOS ver archivos
CREATE POLICY "Allow public read access" ON storage.objects FOR
SELECT TO public USING (bucket_id = 'course-materials');
-- Permitir a TODOS subir archivos
CREATE POLICY "Allow public insert" ON storage.objects FOR
INSERT TO public WITH CHECK (bucket_id = 'course-materials');
-- Permitir a TODOS actualizar archivos
CREATE POLICY "Allow public update" ON storage.objects FOR
UPDATE TO public USING (bucket_id = 'course-materials');
-- Permitir a TODOS eliminar archivos
CREATE POLICY "Allow public delete" ON storage.objects FOR DELETE TO public USING (bucket_id = 'course-materials');
-- Paso 3: Verificar las políticas
SELECT policyname,
    cmd,
    roles
FROM pg_policies
WHERE schemaname = 'storage'
    AND tablename = 'objects'
    AND policyname LIKE '%public%';
-- Deberías ver 4 políticas con roles = {public}