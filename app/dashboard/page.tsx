'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { supabase } from '@/lib/supabase/client'

type Course = {
    id: string
    title: string
    description: string
    category: string
    thumbnail_url: string | null
}

export default function DashboardPage() {
    const { user, loading: authLoading, signOut } = useAuth()
    const router = useRouter()
    const [courses, setCourses] = useState<Course[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/auth/login')
        }
    }, [user, authLoading, router])

    useEffect(() => {
        if (user) {
            loadCourses()
        }
    }, [user])

    const loadCourses = async () => {
        try {
            const { data, error } = await supabase
                .from('courses')
                .select('*')
                .eq('is_published', true)
                .order('created_at', { ascending: false })

            if (error) throw error
            setCourses(data || [])
        } catch (error) {
            console.error('Error loading courses:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleSignOut = async () => {
        await signOut()
        router.push('/auth/login')
    }

    if (authLoading || !user) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Cargando...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex justify-between items-center">
                        <h1 className="text-2xl font-bold text-gray-900">
                            Plataforma LMS
                        </h1>
                        <div className="flex items-center gap-4">
                            <span className="text-sm text-gray-600">
                                {user.email}
                            </span>
                            <button
                                onClick={handleSignOut}
                                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                Cerrar sesión
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8">
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">
                        Mis Cursos
                    </h2>
                    <p className="text-gray-600">
                        Explora y accede a tus cursos de capacitación
                    </p>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="bg-white rounded-xl shadow-sm p-6 animate-pulse">
                                <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                                <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
                                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                            </div>
                        ))}
                    </div>
                ) : courses.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="text-gray-400 mb-4">
                            <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                            No hay cursos disponibles
                        </h3>
                        <p className="text-gray-600">
                            Los cursos aparecerán aquí cuando estén publicados
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {courses.map((course) => (
                            <div
                                key={course.id}
                                className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden cursor-pointer"
                                onClick={() => router.push(`/dashboard/courses/${course.id}`)}
                            >
                                <div className="h-48 bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                                    <svg className="h-16 w-16 text-white opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                    </svg>
                                </div>
                                <div className="p-6">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded">
                                            {course.category}
                                        </span>
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                        {course.title}
                                    </h3>
                                    <p className="text-sm text-gray-600 line-clamp-2">
                                        {course.description}
                                    </p>
                                    <div className="mt-4 flex items-center justify-between">
                                        <span className="text-sm text-gray-500">
                                            Ver curso
                                        </span>
                                        <svg className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    )
}
