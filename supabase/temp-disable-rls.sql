-- SOLUCIÓN TEMPORAL: Deshabilitar RLS en course_materials para probar
-- Ejecuta esto en Supabase SQL Editor
-- ADVERTENCIA: Esto permite a CUALQUIERA agregar materiales
-- Solo para debugging - NO dejar así en producción
ALTER TABLE public.course_materials DISABLE ROW LEVEL SECURITY;
-- Después de ejecutar esto, intenta agregar un material en localhost
-- Si funciona, el problema ES las políticas RLS o cómo se verifica el rol
-- Para volver a habilitar RLS después de probar:
-- ALTER TABLE public.course_materials ENABLE ROW LEVEL SECURITY;