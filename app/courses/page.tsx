import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { CoursesClient } from './courses-client'

export default async function CoursesPage() {
    const supabase = await createClient()

    // Get published courses with material count
    const { data: courses } = await supabase
        .from('courses')
        .select(`
      id,
      title,
      description,
      category,
      course_materials (count)
    `)
        .eq('is_published', true)
        .order('created_at', { ascending: false })

    // Transform data to include material count
    const coursesWithCount = courses?.map(course => ({
        id: course.id,
        title: course.title,
        description: course.description,
        category: course.category,
        material_count: course.course_materials?.[0]?.count || 0
    })) || []

    // Get unique categories
    const categories = Array.from(new Set(coursesWithCount.map(c => c.category)))

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Cursos Disponibles</h1>
                            <p className="mt-2 text-gray-600">
                                Explora y accede a todos los cursos de capacitación
                            </p>
                        </div>
                        <Link
                            href="/dashboard"
                            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                        >
                            Volver al Dashboard
                        </Link>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <CoursesClient courses={coursesWithCount} categories={categories} />
            </div>
        </div>
    )
}
