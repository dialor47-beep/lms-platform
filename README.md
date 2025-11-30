# Plataforma LMS Empresarial

Sistema de gestión de aprendizaje (LMS) para capacitación empresarial.

## 🚀 Estado del Proyecto

**Fase actual**: Desarrollo inicial - Infraestructura base completada

Ver [PROGRESS.md](./PROGRESS.md) para detalles completos del progreso.

## 📋 Características Principales

- 🔐 **Autenticación** - Login, registro, recuperación de contraseña
- 📚 **Gestión de Cursos** - CRUD completo con materiales multimedia
- 📄 **Documentos** - Soporte para PDF, Word, Excel, PowerPoint
- 🎥 **Videos** - Reproductor integrado y enlaces de YouTube
- ✅ **Quizzes** - Evaluaciones con calificación automática
- 🎓 **Certificados** - Generación automática al aprobar
- 📅 **Calendario** - Eventos de clases y reuniones
- 🎯 **Google Meet** - Integración para reuniones virtuales
- 👨‍💼 **Panel Admin** - Gestión completa de usuarios y cursos
- 📊 **Reportes** - Estadísticas y progreso de estudiantes

## 🛠️ Stack Tecnológico

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **Estado**: Zustand
- **Formularios**: React Hook Form + Zod
- **UI**: Lucide React (iconos)
- **Deployment**: Vercel (frontend), Supabase Cloud (backend)

## 📦 Instalación

```bash
# Clonar el repositorio
cd lms-platform

# Instalar dependencias
npm install

# Configurar variables de entorno
cp env.example .env.local
# Editar .env.local con tus credenciales de Supabase

# Ejecutar en desarrollo
npm run dev
```

Abrir [http://localhost:3000](http://localhost:3000)

## 🗄️ Configuración de Supabase

1. Crear cuenta en [supabase.com](https://supabase.com)
2. Crear nuevo proyecto
3. Copiar URL y anon key a `.env.local`
4. Ejecutar migraciones SQL (próximamente)

## 📁 Estructura del Proyecto

```
lms-platform/
├── app/                    # App Router de Next.js
│   ├── (auth)/            # Rutas de autenticación
│   ├── (dashboard)/       # Dashboard de estudiante
│   ├── (admin)/           # Panel administrativo
│   └── api/               # API routes
├── components/            # Componentes React
│   ├── ui/               # Componentes UI base
│   ├── auth/             # Componentes de autenticación
│   ├── course/           # Componentes de cursos
│   ├── quiz/             # Componentes de quizzes
│   └── calendar/         # Componentes de calendario
├── lib/                   # Utilidades y configuración
│   ├── supabase/         # Clientes de Supabase
│   ├── utils/            # Funciones auxiliares
│   └── hooks/            # Custom hooks
└── public/               # Archivos estáticos
```

## 🎯 Cursos Iniciales

1. Inducción y Reinducción
2. Gobierno Digital
3. Seguridad y Salud en el Trabajo
4. Gestión de Calidad
5. Atención al Usuario
6. Modelo Integrado de Planeación y Gestión (MIPG)

## 🔗 Integración en Sitios Web

### Iframe
```html
<iframe src="https://tu-lms.vercel.app/embed/course/123" 
        width="100%" height="600px"></iframe>
```

### Enlace Directo
```
https://tu-lms.vercel.app/courses/induccion
```

## 📝 Próximos Pasos

- [ ] Implementar autenticación completa
- [ ] Crear schema de base de datos
- [ ] Desarrollar componentes UI base
- [ ] Construir dashboard de estudiante
- [ ] Implementar gestión de cursos
- [ ] Agregar sistema de quizzes
- [ ] Integrar calendario y reuniones

## 📄 Licencia

Proyecto privado para uso empresarial.

## 👤 Desarrollador

Desarrollado por Antigravity AI

---

**Versión**: 0.1.0 (En desarrollo)  
**Última actualización**: 30 de noviembre de 2025
