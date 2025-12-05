-- Script para cambiar el rol del usuario dialor47@gmail.com a admin
-- Ejecuta este script COMPLETO en Supabase SQL Editor
-- Paso 1: Verificar el usuario actual
SELECT id,
    email,
    full_name,
    role,
    created_at
FROM public.profiles
WHERE email = 'dialor47@gmail.com';
-- Paso 2: Actualizar el rol a admin
UPDATE public.profiles
SET role = 'admin'::user_role
WHERE email = 'dialor47@gmail.com';
-- Paso 3: Verificar que el cambio se aplicó
SELECT id,
    email,
    full_name,
    role,
    created_at
FROM public.profiles
WHERE email = 'dialor47@gmail.com';
-- Deberías ver que el rol ahora es 'admin' en el resultado del Paso 3