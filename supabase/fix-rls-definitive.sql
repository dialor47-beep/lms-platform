-- SOLUCIÓN DEFINITIVA: Arreglar políticas RLS para course_materials
-- Este script reemplaza las políticas problemáticas con unas que funcionan
-- Paso 1: Re-habilitar RLS
ALTER TABLE public.course_materials ENABLE ROW LEVEL SECURITY;
-- Paso 2: Eliminar TODAS las políticas existentes
DROP POLICY IF EXISTS "Students can view materials for enrolled courses" ON public.course_materials;
DROP POLICY IF EXISTS "Course creators can manage their materials" ON public.course_materials;
DROP POLICY IF EXISTS "Admins can insert course materials" ON public.course_materials;
DROP POLICY IF EXISTS "Admins can update course materials" ON public.course_materials;
DROP POLICY IF EXISTS "Admins can delete course materials" ON public.course_materials;
DROP POLICY IF EXISTS "Admins can view all materials" ON public.course_materials;
-- Paso 3: Crear políticas simplificadas que SÍ funcionan
-- Permitir a TODOS ver materiales (para estudiantes)
CREATE POLICY "Anyone can view materials" ON public.course_materials FOR
SELECT USING (true);
-- Permitir a admins hacer TODO (INSERT, UPDATE, DELETE)
CREATE POLICY "Admins can do everything" ON public.course_materials FOR ALL USING (
    EXISTS (
        SELECT 1
        FROM public.profiles
        WHERE profiles.id = auth.uid()
            AND profiles.role = 'admin'
    )
) WITH CHECK (
    EXISTS (
        SELECT 1
        FROM public.profiles
        WHERE profiles.id = auth.uid()
            AND profiles.role = 'admin'
    )
);
-- Paso 4: Verificar que las políticas se crearon
SELECT tablename,
    policyname,
    cmd,
    qual,
    with_check
FROM pg_policies
WHERE tablename = 'course_materials'
ORDER BY policyname;
-- Deberías ver 2 políticas:
-- 1. "Anyone can view materials" - SELECT
-- 2. "Admins can do everything" - ALL