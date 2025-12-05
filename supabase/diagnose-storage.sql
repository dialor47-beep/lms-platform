-- Script de diagnóstico para Storage
-- Ejecuta esto en Supabase SQL Editor para ver qué está pasando
-- 1. Verificar que el bucket existe
SELECT *
FROM storage.buckets
WHERE name = 'course-materials';
-- 2. Ver todas las políticas de storage
SELECT policyname,
    cmd,
    qual,
    with_check
FROM pg_policies
WHERE schemaname = 'storage'
    AND tablename = 'objects';
-- 3. Verificar RLS en course_materials
SELECT tablename,
    rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
    AND tablename = 'course_materials';
-- 4. Ver archivos actuales en el bucket (si hay)
SELECT *
FROM storage.objects
WHERE bucket_id = 'course-materials'
LIMIT 10;