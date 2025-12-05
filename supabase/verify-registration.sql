-- Verificar que el usuario se registró correctamente
-- Ver el perfil del usuario recién creado
SELECT id,
    email,
    full_name,
    role,
    created_at
FROM public.profiles
WHERE email = 'diegoaortiz73@gmail.com';
-- Ver todos los usuarios registrados recientemente
SELECT email,
    full_name,
    role,
    created_at
FROM public.profiles
ORDER BY created_at DESC
LIMIT 5;