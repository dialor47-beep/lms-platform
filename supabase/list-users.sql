-- Script para ver todos los usuarios registrados en tu LMS
-- Ejecuta esto en Supabase SQL Editor
-- Ver todos los usuarios de la tabla profiles
SELECT id,
    email,
    full_name,
    role,
    created_at
FROM public.profiles
ORDER BY created_at ASC;
-- Esto te mostrará todos los usuarios que se han registrado
-- Busca tu email en la lista para confirmar que existe
-- Si no ves ningún usuario, significa que aún no te has registrado
-- NOTA: Las contraseñas NO se almacenan en esta tabla
-- Las contraseñas están en la tabla auth.users de Supabase
-- Solo tú sabes tu contraseña (la que usaste al registrarte)