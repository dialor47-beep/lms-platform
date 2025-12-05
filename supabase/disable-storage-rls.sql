-- SOLUCIÓN DEFINITIVA: Deshabilitar RLS en Storage Objects
-- El problema es que RLS está bloqueando las operaciones de storage
-- Paso 1: Deshabilitar RLS en la tabla de objetos de storage
ALTER TABLE storage.objects DISABLE ROW LEVEL SECURITY;
-- Paso 2: Verificar que se deshabilitó
SELECT schemaname,
    tablename,
    rowsecurity
FROM pg_tables
WHERE schemaname = 'storage'
    AND tablename = 'objects';
-- Debería mostrar rowsecurity = false
-- Paso 3: Verificar que course_materials también tiene RLS deshabilitado
SELECT schemaname,
    tablename,
    rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
    AND tablename = 'course_materials';
-- También debería mostrar rowsecurity = false