'use client'

import { useRouter } from 'next/navigation'
import { createBrowserClient } from '@supabase/ssr'
import { FileText, Video, Link as LinkIcon, Trash2, Download } from 'lucide-react'

interface Material {
    id: string
    title: string
    type: string
    file_url: string | null
    external_link: string | null
    order: number
}

const getIcon = (type: string) => {
    switch (type) {
        case 'video':
            return Video
        case 'link':
            return LinkIcon
        default:
            return FileText
    }
}

const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
        pdf: 'PDF',
        word: 'Word',
        excel: 'Excel',
        ppt: 'PowerPoint',
        video: 'Video',
        link: 'Enlace',
    }
    return labels[type] || type
}

export function MaterialList({ materials, courseId }: { materials: Material[], courseId: string }) {
    const router = useRouter()
    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    const handleDelete = async (materialId: string, title: string) => {
        if (!confirm(`¿Estás seguro de eliminar "${title}"?`)) {
            return
        }

        try {
            const { error } = await supabase
                .from('course_materials')
                .delete()
                .eq('id', materialId)

            if (error) throw error

            router.refresh()
        } catch (error) {
            console.error('Error deleting material:', error)
            alert('Error al eliminar el material')
        }
    }

    if (!materials || materials.length === 0) {
        return (
            <div className="bg-white shadow rounded-lg p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                    Materiales del Curso
                </h2>
                <div className="text-center py-12">
                    <FileText className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">
                        No hay materiales
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                        Comienza agregando el primer material
                    </p>
                </div>
            </div>
        )
    }

    return (
        <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Materiales del Curso ({materials.length})
            </h2>

            <div className="space-y-3">
                {materials.map((material) => {
                    const Icon = getIcon(material.type)
                    const url = material.external_link || material.file_url

                    return (
                        <div
                            key={material.id}
                            className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                        >
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                                <div className="flex-shrink-0">
                                    <Icon className="h-5 w-5 text-gray-500" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-900 truncate">
                                        {material.title}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        {getTypeLabel(material.type)}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 ml-4">
                                {url && (
                                    <a
                                        href={url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1 rounded-lg bg-blue-100 px-3 py-1.5 text-sm font-medium text-blue-700 hover:bg-blue-200"
                                    >
                                        {material.type === 'video' || material.type === 'link' ? (
                                            <>
                                                <LinkIcon className="h-4 w-4" />
                                                Abrir
                                            </>
                                        ) : (
                                            <>
                                                <Download className="h-4 w-4" />
                                                Descargar
                                            </>
                                        )}
                                    </a>
                                )}
                                <button
                                    onClick={() => handleDelete(material.id, material.title)}
                                    className="inline-flex items-center gap-1 rounded-lg bg-red-100 px-3 py-1.5 text-sm font-medium text-red-700 hover:bg-red-200"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
