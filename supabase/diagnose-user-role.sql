-- DIAGNÓSTICO COMPLETO: Verificar por qué el rol no se actualiza
-- Ejecuta CADA sección paso a paso en Supabase SQL Editor
-- ============================================
-- PASO 1: Ver TODOS los usuarios en profiles
-- ============================================
SELECT id,
    email,
    full_name,
    role,
    created_at
FROM public.profiles
ORDER BY created_at DESC;
-- Busca dialor47@gmail.com en los resultados
-- ¿Aparece? ¿Qué rol tiene?
-- ============================================
-- PASO 2: Ver usuarios en auth.users (tabla de autenticación)
-- ============================================
SELECT id,
    email,
    raw_user_meta_data,
    created_at
FROM auth.users
ORDER BY created_at DESC;
-- Busca dialor47@gmail.com aquí también
-- ============================================
-- PASO 3: Forzar actualización del rol
-- ============================================
UPDATE public.profiles
SET role = 'admin'::user_role
WHERE email = 'dialor47@gmail.com'
RETURNING id,
    email,
    role;
-- Deberías ver: dialor47@gmail.com | admin
-- Si dice "0 rows affected", el usuario NO existe en profiles
-- ============================================
-- PASO 4: Si el usuario NO existe en profiles, créalo
-- ============================================
-- Primero obtén el UUID del usuario de auth.users (del PASO 2)
-- Luego ejecuta (reemplaza 'UUID-AQUI' con el ID real):
-- INSERT INTO public.profiles (id, email, full_name, role)
-- VALUES (
--     'UUID-AQUI'::uuid,
--     'dialor47@gmail.com',
--     'Diego Alor',
--     'admin'::user_role
-- );
-- ============================================
-- PASO 5: Verificación final
-- ============================================
SELECT email,
    role
FROM public.profiles
WHERE email = 'dialor47@gmail.com';
-- Debe mostrar: dialor47@gmail.com | admin