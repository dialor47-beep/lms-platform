'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createBrowserClient } from '@supabase/ssr'
import Link from 'next/link'

interface Course {
    id: string
    title: string
    description: string
    category: string
    is_published: boolean
}

const categories = [
    'Inducción',
    'Tecnología',
    'Seguridad',
    'Calidad',
    'Servicio',
    'Gestión Pública',
]

export function EditCourseForm({ course }: { course: Course }) {
    const router = useRouter()
    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [formData, setFormData] = useState({
        title: course.title,
        description: course.description,
        category: course.category,
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)

        try {
            const { error } = await supabase
                .from('courses')
                .update({
                    title: formData.title,
                    description: formData.description,
                    category: formData.category,
                })
                .eq('id', course.id)

            if (error) throw error

            router.push('/admin/courses')
            router.refresh()
        } catch (error) {
            console.error('Error updating course:', error)
            alert('Error al actualizar el curso')
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-white shadow rounded-lg p-6 space-y-6">
                <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                        Título del Curso *
                    </label>
                    <input
                        type="text"
                        id="title"
                        required
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
                        placeholder="Ej: Inducción y Reinducción"
                    />
                </div>

                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                        Descripción *
                    </label>
                    <textarea
                        id="description"
                        required
                        rows={4}
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
                        placeholder="Describe el contenido y objetivos del curso..."
                    />
                </div>

                <div>
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                        Categoría *
                    </label>
                    <select
                        id="category"
                        required
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
                    >
                        {categories.map((cat) => (
                            <option key={cat} value={cat}>
                                {cat}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-sm text-blue-800">
                        <strong>Estado actual:</strong> {course.is_published ? 'Publicado' : 'Borrador'}
                    </p>
                    <p className="text-xs text-blue-600 mt-1">
                        Para cambiar el estado de publicación, usa el botón "Publicar/Despublicar" en la lista de cursos
                    </p>
                </div>
            </div>

            <div className="flex items-center justify-end gap-3">
                <Link
                    href="/admin/courses"
                    className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                    Cancelar
                </Link>
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
                >
                    {isSubmitting ? 'Guardando...' : 'Guardar Cambios'}
                </button>
            </div>
        </form>
    )
}
