-- Script para verificar y corregir el rol del usuario actual
-- Ejecuta este script en Supabase SQL Editor
-- 1. Ver TODOS los usuarios y sus roles
SELECT id,
    email,
    full_name,
    role,
    created_at
FROM public.profiles
ORDER BY created_at DESC;
-- 2. Si tu usuario NO aparece con role = 'admin', copia su email de arriba
-- y ejecuta este comando (reemplaza 'tu-email@ejemplo.com' con tu email real):
-- UPDATE public.profiles 
-- SET role = 'admin'::user_role
-- WHERE email = 'tu-email@ejemplo.com';
-- 3. Verificar que el cambio se aplicó:
-- SELECT email, role FROM public.profiles WHERE email = 'tu-email@ejemplo.com';