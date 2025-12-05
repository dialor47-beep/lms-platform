'use client'

import { useRouter } from 'next/navigation'
import { getSupabaseBrowserClient } from '@/lib/supabase-client'
import { Edit, Trash2, FileText, Eye, EyeOff } from 'lucide-react'
import { useState } from 'react'

interface Course {
    id: string
    title: string
    is_published: boolean
}

export function CourseActions({ course }: { course: Course }) {
    const router = useRouter()
    const supabase = getSupabaseBrowserClient()
    const [isDeleting, setIsDeleting] = useState(false)
    const [isToggling, setIsToggling] = useState(false)

    const handleDelete = async () => {
        if (!confirm(`¿Estás seguro de eliminar el curso "${course.title}"?`)) {
            return
        }

        setIsDeleting(true)
        try {
            const { error } = await supabase
                .from('courses')
                .delete()
                .eq('id', course.id)

            if (error) throw error

            router.refresh()
        } catch (error) {
            console.error('Error deleting course:', error)
            alert('Error al eliminar el curso')
        } finally {
            setIsDeleting(false)
        }
    }

    const handleTogglePublish = async () => {
        setIsToggling(true)
        try {
            const { error } = await supabase
                .from('courses')
                .update({ is_published: !course.is_published })
                .eq('id', course.id)

            if (error) throw error

            router.refresh()
        } catch (error) {
            console.error('Error toggling publish:', error)
            alert('Error al cambiar el estado del curso')
        } finally {
            setIsToggling(false)
        }
    }

    return (
        <div className="flex items-center justify-end gap-2">
            <button
                onClick={() => router.push(`/admin/courses/${course.id}/materials`)}
                className="inline-flex items-center gap-1 rounded-lg bg-purple-100 px-3 py-1.5 text-sm font-medium text-purple-700 hover:bg-purple-200"
                title="Gestionar materiales"
            >
                <FileText className="h-4 w-4" />
                Materiales
            </button>

            <button
                onClick={handleTogglePublish}
                disabled={isToggling}
                className={`inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm font-medium ${course.is_published
                    ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    : 'bg-green-100 text-green-700 hover:bg-green-200'
                    }`}
                title={course.is_published ? 'Despublicar' : 'Publicar'}
            >
                {course.is_published ? (
                    <><EyeOff className="h-4 w-4" /> Despublicar</>
                ) : (
                    <><Eye className="h-4 w-4" /> Publicar</>
                )}
            </button>

            <button
                onClick={() => router.push(`/admin/courses/${course.id}/edit`)}
                className="inline-flex items-center gap-1 rounded-lg bg-blue-100 px-3 py-1.5 text-sm font-medium text-blue-700 hover:bg-blue-200"
                title="Editar curso"
            >
                <Edit className="h-4 w-4" />
                Editar
            </button>

            <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="inline-flex items-center gap-1 rounded-lg bg-red-100 px-3 py-1.5 text-sm font-medium text-red-700 hover:bg-red-200 disabled:opacity-50"
                title="Eliminar curso"
            >
                <Trash2 className="h-4 w-4" />
                Eliminar
            </button>
        </div>
    )
}
