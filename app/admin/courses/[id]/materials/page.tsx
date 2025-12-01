import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { MaterialUpload } from './material-upload'
import { MaterialList } from './material-list'

export default async function CourseMaterialsPage({
    params,
}: {
    params: { id: string }
}) {
    const supabase = await createClient()

    // Get course
    const { data: course } = await supabase
        .from('courses')
        .select('*')
        .eq('id', params.id)
        .single()

    if (!course) {
        notFound()
    }

    // Get materials
    const { data: materials } = await supabase
        .from('course_materials')
        .select('*')
        .eq('course_id', params.id)
        .order('order', { ascending: true })

    return (
        <div className="max-w-5xl">
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
                <h1 className="text-3xl font-bold text-gray-900">{course.title}</h1>
                <p className="mt-2 text-gray-600">Gestiona los materiales del curso</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Upload Section */}
                <div>
                    <MaterialUpload courseId={params.id} />
                </div>

                {/* Materials List */}
                <div>
                    <MaterialList materials={materials || []} courseId={params.id} />
                </div>
            </div>
        </div>
    )
}
