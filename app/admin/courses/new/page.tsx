'use client'

import { useRouter } from 'next/navigation'
import { getSupabaseBrowserClient } from '@/lib/supabase-client'
import { useState } from 'react'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function NewCoursePage() {
    const router = useRouter()
    const supabase = getSupabaseBrowserClient()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: 'Inducción',
    })

    const categories = [
        'Inducción',
        'Tecnología',
        'Seguridad',
        'Calidad',
        'Servicio',
        'Gestión Pública',
    ]

    const handleSubmit = async (e: React.FormEvent, publish: boolean = false) => {
        e.preventDefault()
        setIsSubmitting(true)

        try {
            const { data: { user } } = await supabase.auth.getUser()

            if (!user) throw new Error('No user found')

            const { data, error } = await supabase
                .from('courses')
                .insert({
                    title: formData.title,
                    description: formData.description,
                    category: formData.category,
                    is_published: publish,
                    created_by: user.id,
                })
                .select()
                .single()

            if (error) throw error

            router.push(`/admin/courses/${data.id}/materials`)
        } catch (error) {
            console.error('Error creating course:', error)
            alert('Error al crear el curso')
        } finally {
            setIsSubmitting(false)
        }
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
                <h1 className="text-3xl font-bold text-gray-900">Crear Nuevo Curso</h1>
                <p className="mt-2 text-gray-600">
                    Completa la información básica del curso
                </p>
            </div>

            <form onSubmit={(e) => handleSubmit(e, false)} className="space-y-6">
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
                        className="rounded-lg bg-gray-600 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-700 disabled:opacity-50"
                    >
                        {isSubmitting ? 'Guardando...' : 'Guardar como Borrador'}
                    </button>
                    <button
                        type="button"
                        onClick={(e) => handleSubmit(e, true)}
                        disabled={isSubmitting}
                        className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
                    >
                        {isSubmitting ? 'Publicando...' : 'Guardar y Publicar'}
                    </button>
                </div>
            </form>
        </div>
    )
}
