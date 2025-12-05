-- Script para verificar QUÉ está viendo Supabase cuando intentas insertar
-- Ejecuta esto en Supabase SQL Editor MIENTRAS ESTÁS LOGUEADO en localhost
-- 1. Ver qué usuario está autenticado actualmente
SELECT auth.uid() as current_user_id,
    auth.email() as current_email;
-- 2. Ver el perfil del usuario autenticado
SELECT id,
    email,
    full_name,
    role
FROM public.profiles
WHERE id = auth.uid();
-- 3. Probar si la política RLS permite insertar
-- Esto simula lo que pasa cuando intentas agregar un material
SELECT EXISTS (
        SELECT 1
        FROM public.profiles
        WHERE id = auth.uid()
            AND role = 'admin'
    ) as "¿Soy admin?";
-- Si el resultado es FALSE, entonces el problema es que:
-- a) No estás logueado
-- b) Tu sesión tiene un token viejo
-- c) El perfil no existe para tu usuario
-- 4. Ver TODAS las políticas activas en course_materials
SELECT schemaname,
    tablename,
    policyname,
    cmd,
    qual,
    with_check
FROM pg_policies
WHERE tablename = 'course_materials'
ORDER BY policyname;