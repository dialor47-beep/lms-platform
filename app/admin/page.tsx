import { createClient } from '@/lib/supabase/server'
import { BookOpen, Users, CheckCircle, FileText } from 'lucide-react'

export default async function AdminDashboard() {
    const supabase = await createClient()

    // Get statistics
    const [
        { count: totalCourses },
        { count: publishedCourses },
        { count: totalUsers },
        { count: totalMaterials },
    ] = await Promise.all([
        supabase.from('courses').select('*', { count: 'exact', head: true }),
        supabase.from('courses').select('*', { count: 'exact', head: true }).eq('is_published', true),
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
        supabase.from('course_materials').select('*', { count: 'exact', head: true }),
    ])

    const stats = [
        {
            name: 'Total de Cursos',
            value: totalCourses || 0,
            icon: BookOpen,
            color: 'bg-blue-500',
        },
        {
            name: 'Cursos Publicados',
            value: publishedCourses || 0,
            icon: CheckCircle,
            color: 'bg-green-500',
        },
        {
            name: 'Total de Usuarios',
            value: totalUsers || 0,
            icon: Users,
            color: 'bg-purple-500',
        },
        {
            name: 'Materiales Subidos',
            value: totalMaterials || 0,
            icon: FileText,
            color: 'bg-orange-500',
        },
    ]

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                <p className="mt-2 text-gray-600">
                    Bienvenido al panel de administración de la plataforma LMS
                </p>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat) => (
                    <div
                        key={stat.name}
                        className="overflow-hidden rounded-lg bg-white shadow"
                    >
                        <div className="p-6">
                            <div className="flex items-center">
                                <div className={`flex-shrink-0 rounded-md ${stat.color} p-3`}>
                                    <stat.icon className="h-6 w-6 text-white" />
                                </div>
                                <div className="ml-5 w-0 flex-1">
                                    <dl>
                                        <dt className="truncate text-sm font-medium text-gray-500">
                                            {stat.name}
                                        </dt>
                                        <dd className="text-3xl font-semibold text-gray-900">
                                            {stat.value}
                                        </dd>
                                    </dl>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
                <div className="rounded-lg bg-white p-6 shadow">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">
                        Acciones Rápidas
                    </h2>
                    <div className="space-y-3">
                        <a
                            href="/admin/courses/new"
                            className="block rounded-lg border border-gray-200 p-4 hover:bg-gray-50 transition-colors"
                        >
                            <div className="flex items-center">
                                <BookOpen className="h-5 w-5 text-blue-600" />
                                <span className="ml-3 font-medium text-gray-900">
                                    Crear Nuevo Curso
                                </span>
                            </div>
                        </a>
                        <a
                            href="/admin/courses"
                            className="block rounded-lg border border-gray-200 p-4 hover:bg-gray-50 transition-colors"
                        >
                            <div className="flex items-center">
                                <FileText className="h-5 w-5 text-green-600" />
                                <span className="ml-3 font-medium text-gray-900">
                                    Gestionar Cursos
                                </span>
                            </div>
                        </a>
                        <a
                            href="/admin/users"
                            className="block rounded-lg border border-gray-200 p-4 hover:bg-gray-50 transition-colors"
                        >
                            <div className="flex items-center">
                                <Users className="h-5 w-5 text-purple-600" />
                                <span className="ml-3 font-medium text-gray-900">
                                    Ver Usuarios
                                </span>
                            </div>
                        </a>
                    </div>
                </div>

                <div className="rounded-lg bg-white p-6 shadow">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">
                        Información del Sistema
                    </h2>
                    <div className="space-y-4">
                        <div>
                            <p className="text-sm text-gray-500">Plataforma</p>
                            <p className="text-base font-medium text-gray-900">LMS Empresarial v1.0</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Base de Datos</p>
                            <p className="text-base font-medium text-gray-900">Supabase PostgreSQL</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Almacenamiento</p>
                            <p className="text-base font-medium text-gray-900">Supabase Storage</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
