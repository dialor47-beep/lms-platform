-- Seed data for initial courses

-- Insert admin user (you'll need to create this user first in Supabase Auth)
-- Then update the UUID below with the actual user ID

-- Insert initial courses
INSERT INTO public.courses (title, description, category, is_published, created_by) VALUES
('Inducción y Reinducción', 'Curso de inducción para nuevos empleados y reinducción para personal existente', 'Inducción', true, NULL),
('Gobierno Digital', 'Capacitación en gobierno digital y transformación tecnológica del Estado', 'Tecnología', true, NULL),
('Seguridad y Salud en el Trabajo', 'Normativas y prácticas de seguridad y salud ocupacional', 'Seguridad', true, NULL),
('Gestión de Calidad', 'Sistemas de gestión de calidad y mejora continua', 'Calidad', true, NULL),
('Atención al Usuario', 'Técnicas y protocolos de atención y servicio al ciudadano', 'Servicio', true, NULL),
('Modelo Integrado de Planeación y Gestión (MIPG)', 'Implementación del MIPG en entidades públicas', 'Gestión Pública', true, NULL);

-- Note: After creating an admin user in Supabase Auth, update the created_by field:
-- UPDATE public.courses SET created_by = 'your-admin-user-uuid' WHERE created_by IS NULL;
