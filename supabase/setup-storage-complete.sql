-- ============================================
-- SCRIPT COMPLETO: Configurar Storage y Arreglar Eliminación
-- ============================================
-- Ejecuta este script DESPUÉS de crear el bucket en Supabase
-- PASO 1: Verificar que RLS sigue deshabilitado en course_materials
ALTER TABLE public.course_materials DISABLE ROW LEVEL SECURITY;
-- PASO 2: Crear políticas de Storage para el bucket 'course-materials'
-- Eliminar políticas existentes si las hay
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update" ON storage.objects;
-- Permitir a todos ver archivos (público)
CREATE POLICY "Public Access" ON storage.objects FOR
SELECT USING (bucket_id = 'course-materials');
-- Permitir a usuarios autenticados subir archivos
CREATE POLICY "Authenticated users can upload" ON storage.objects FOR
INSERT WITH CHECK (
        bucket_id = 'course-materials'
        AND auth.role() = 'authenticated'
    );
-- Permitir a usuarios autenticados eliminar archivos
CREATE POLICY "Authenticated users can delete" ON storage.objects FOR DELETE USING (
    bucket_id = 'course-materials'
    AND auth.role() = 'authenticated'
);
-- Permitir a usuarios autenticados actualizar
CREATE POLICY "Authenticated users can update" ON storage.objects FOR
UPDATE USING (
        bucket_id = 'course-materials'
        AND auth.role() = 'authenticated'
    );
-- PASO 3: Verificar que las políticas se crearon
SELECT policyname,
    cmd,
    qual,
    with_check
FROM pg_policies
WHERE schemaname = 'storage'
    AND tablename = 'objects'
    AND policyname LIKE '%course-materials%'
    OR policyname LIKE '%Public Access%'
    OR policyname LIKE '%Authenticated%';
-- Deberías ver 4 políticas creadas