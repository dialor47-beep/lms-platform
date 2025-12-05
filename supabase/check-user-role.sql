-- DIAGNÓSTICO: Verificar el rol del usuario actual
-- Ejecuta este script en Supabase SQL Editor para ver tu información de usuario
-- 1. Ver tu ID de usuario actual
SELECT auth.uid() as mi_user_id;
-- 2. Ver tu perfil completo
SELECT id,
    email,
    full_name,
    role,
    created_at
FROM public.profiles
WHERE id = auth.uid();
-- 3. Ver TODOS los perfiles (para debugging)
SELECT id,
    email,
    full_name,
    role,
    created_at
FROM public.profiles
ORDER BY created_at DESC;
-- 4. Si tu usuario NO tiene rol 'admin', ejecuta esto para arreglarlo:
-- DESCOMENTA LA SIGUIENTE LÍNEA Y REEMPLAZA 'tu-email@ejemplo.com' con tu email real
-- UPDATE public.profiles SET role = 'admin' WHERE email = 'tu-email@ejemplo.com';