-- Script para arreglar la eliminación de materiales
-- El problema es que RLS puede estar bloqueando DELETE
-- Paso 1: Verificar si RLS está habilitado
SELECT tablename,
    rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
    AND tablename = 'course_materials';
-- Paso 2: Deshabilitar RLS (de nuevo)
ALTER TABLE public.course_materials DISABLE ROW LEVEL SECURITY;
-- Paso 3: Verificar que se deshabilitó
SELECT tablename,
    rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
    AND tablename = 'course_materials';
-- Debería mostrar rowsecurity = false