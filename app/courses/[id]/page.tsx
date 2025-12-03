import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, BookOpen } from 'lucide-react'
import { CourseDetailClient } from './course-detail-client'

export default async function CourseDetailPage({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params
    const supabase = await createClient()

    // Get course
    const { data: course } = await supabase
        .from('courses')
        .select('*')
        .eq('id', id)
        .eq('is_published', true)
        .single()

    if (!course) {
        notFound()
    }

    // Get materials
    const { data: materials } = await supabase
        .from('course_materials')
        .select('*')
        .eq('course_id', id)
        .order('order', { ascending: true })

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <Link
                        href="/courses"
                        className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-4"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Volver a Cursos
                    </Link>

                    <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 rounded-lg bg-blue-100 p-4">
                            <BookOpen className="h-8 w-8 text-blue-600" />
                        </div>
                        <div className="flex-1">
                            <h1 className="text-3xl font-bold text-gray-900">{course.title}</h1>
                            <p className="mt-2 text-gray-600">{course.description}</p>
                            <div className="mt-4">
                                <span className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700">
                                    {course.category}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-6">
                    <h2 className="text-xl font-semibold text-gray-900">Materiales del Curso</h2>
                    <p className="mt-1 text-sm text-gray-600">
                        {materials?.length || 0} {materials?.length === 1 ? 'material disponible' : 'materiales disponibles'}
                    </p>
                </div>

                <CourseDetailClient materials={materials || []} />
            </div>
        </div>
    )
}
