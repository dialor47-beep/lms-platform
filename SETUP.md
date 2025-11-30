# Configuración de Supabase

## Paso 1: Crear Proyecto en Supabase

1. Ve a [supabase.com](https://supabase.com)
2. Crea una cuenta o inicia sesión
3. Click en "New Project"
4. Completa los datos:
   - **Name**: LMS Platform
   - **Database Password**: (guarda esta contraseña)
   - **Region**: Elige la más cercana
5. Click en "Create new project"
6. Espera 2-3 minutos mientras se crea el proyecto

## Paso 2: Obtener Credenciales

1. En tu proyecto, ve a **Settings** → **API**
2. Copia estos valores:
   - **Project URL** (ej: `https://xxxxx.supabase.co`)
   - **anon public** key (la clave larga que empieza con `eyJ...`)

## Paso 3: Configurar Variables de Entorno

1. En el proyecto LMS, copia el archivo de ejemplo:
   ```bash
   cd /Users/macminidiego/.gemini/antigravity/playground/lms-platform
   cp env.example .env.local
   ```

2. Edita `.env.local` y pega tus credenciales:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...tu-clave-aqui
   ```

## Paso 4: Ejecutar Migraciones SQL

1. En Supabase, ve a **SQL Editor**
2. Click en "New query"
3. Copia y pega el contenido de `supabase/schema.sql`
4. Click en "Run" para ejecutar
5. Verifica que no haya errores

6. Repite el proceso con `supabase/seed.sql` para agregar los cursos iniciales

## Paso 5: Configurar Autenticación

1. En Supabase, ve a **Authentication** → **Providers**
2. Asegúrate de que **Email** esté habilitado
3. En **Email Templates**, personaliza los mensajes si lo deseas

## Paso 6: Configurar Storage (Opcional)

1. Ve a **Storage**
2. Crea los siguientes buckets:
   - `course-materials` (público)
   - `certificates` (privado)
   - `avatars` (público)

## Paso 7: Ejecutar la Aplicación

```bash
cd /Users/macminidiego/.gemini/antigravity/playground/lms-platform
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000)

## Paso 8: Crear Usuario Administrador

1. Regístrate en la aplicación
2. En Supabase, ve a **Authentication** → **Users**
3. Encuentra tu usuario y copia el UUID
4. Ve a **SQL Editor** y ejecuta:
   ```sql
   UPDATE public.profiles 
   SET role = 'admin' 
   WHERE id = 'tu-uuid-aqui';
   ```

5. Actualiza los cursos para asignarlos a tu usuario:
   ```sql
   UPDATE public.courses 
   SET created_by = 'tu-uuid-aqui' 
   WHERE created_by IS NULL;
   ```

## Verificación

- ✅ Proyecto creado en Supabase
- ✅ Variables de entorno configuradas
- ✅ Migraciones SQL ejecutadas
- ✅ Autenticación habilitada
- ✅ Storage configurado (opcional)
- ✅ Aplicación corriendo en localhost:3000
- ✅ Usuario admin creado

## Solución de Problemas

**Error: "Invalid API key"**
- Verifica que copiaste correctamente la anon key
- Asegúrate de que no haya espacios extra

**Error: "relation does not exist"**
- Ejecuta el schema.sql en el SQL Editor
- Verifica que todas las tablas se crearon

**No puedo registrarme**
- Verifica que Email Auth esté habilitado
- Revisa la consola del navegador para errores

---

**¡Listo!** Tu plataforma LMS está configurada y lista para usar.
