-- SOLUCIÓN FINAL: Eliminar y recrear políticas de storage
-- Este script elimina TODAS las políticas existentes y crea nuevas
-- Paso 1: Eliminar TODAS las políticas de storage para course-materials
DO $$
DECLARE pol record;
BEGIN FOR pol IN
SELECT policyname
FROM pg_policies
WHERE schemaname = 'storage'
    AND tablename = 'objects' LOOP EXECUTE format(
        'DROP POLICY IF EXISTS %I ON storage.objects',
        pol.policyname
    );
END LOOP;
END $$;
-- Paso 2: Crear políticas completamente públicas
-- Permitir a TODOS ver archivos
CREATE POLICY "course_materials_select" ON storage.objects FOR
SELECT TO public USING (bucket_id = 'course-materials');
-- Permitir a TODOS subir archivos
CREATE POLICY "course_materials_insert" ON storage.objects FOR
INSERT TO public WITH CHECK (bucket_id = 'course-materials');
-- Permitir a TODOS actualizar archivos
CREATE POLICY "course_materials_update" ON storage.objects FOR
UPDATE TO public USING (bucket_id = 'course-materials');
-- Permitir a TODOS eliminar archivos
CREATE POLICY "course_materials_delete" ON storage.objects FOR DELETE TO public USING (bucket_id = 'course-materials');
-- Paso 3: Verificar las políticas creadas
SELECT policyname,
    cmd,
    qual,
    with_check
FROM pg_policies
WHERE schemaname = 'storage'
    AND tablename = 'objects'
ORDER BY policyname;
-- Deberías ver 4 políticas: course_materials_select, insert, update, delete