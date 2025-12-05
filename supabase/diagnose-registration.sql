-- Script de diagnóstico para verificar registro de usuarios
-- 1. Ver políticas de la tabla profiles
SELECT policyname,
    cmd,
    qual,
    with_check
FROM pg_policies
WHERE schemaname = 'public'
    AND tablename = 'profiles'
ORDER BY policyname;
-- 2. Verificar que el trigger existe
SELECT tgname as trigger_name,
    tgenabled as enabled
FROM pg_trigger
WHERE tgname = 'on_auth_user_created';
-- 3. Ver la función del trigger
SELECT proname as function_name,
    prosrc as source_code
FROM pg_proc
WHERE proname = 'handle_new_user';
-- 4. Ver usuarios registrados recientemente
SELECT p.id,
    p.email,
    p.full_name,
    p.role,
    p.created_at
FROM public.profiles p
ORDER BY p.created_at DESC
LIMIT 10;
-- 5. Verificar RLS en profiles
SELECT tablename,
    rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
    AND tablename = 'profiles';