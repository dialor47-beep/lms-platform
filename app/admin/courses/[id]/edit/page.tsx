import { createClient } from '@/lib/supabase/server'
import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { EditCourseForm } from './edit-course-form'

export default async function EditCoursePage({
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
        .single()

    if (!course) {
        notFound()
    }

    return (
        <div className="max-w-3xl">
            <div className="mb-6">
                <Link
                    href="/admin/courses"
                    className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Volver a cursos
                </Link>
            </div>

            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Editar Curso</h1>
                <p className="mt-2 text-gray-600">Modifica la información del curso</p>
            </div>

            <EditCourseForm course={course} />
        </div>
    )
}
