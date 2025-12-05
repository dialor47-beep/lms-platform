-- Script para configurar Supabase Storage para archivos de cursos
-- Ejecuta esto en Supabase SQL Editor
-- Paso 1: Crear el bucket si no existe
-- NOTA: Esto debe hacerse desde la interfaz de Supabase Storage
-- Ve a: Storage → Create bucket → Nombre: "course-materials" → Public: YES
-- Paso 2: Crear políticas de storage para permitir subir/eliminar archivos
-- Permitir a todos ver archivos (público)
CREATE POLICY "Public Access" ON storage.objects FOR
SELECT USING (bucket_id = 'course-materials');
-- Permitir a usuarios autenticados subir archivos
CREATE POLICY "Authenticated users can upload" ON storage.objects FOR
INSERT WITH CHECK (
        bucket_id = 'course-materials'
        AND auth.role() = 'authenticated'
    );
-- Permitir a usuarios autenticados eliminar sus archivos
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