'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { getSupabaseBrowserClient } from '@/lib/supabase-client'
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
    const supabase = getSupabaseBrowserClient()
    const [deletingId, setDeletingId] = useState<string | null>(null)

    const handleDeleteClick = (materialId: string) => {
        setDeletingId(materialId)
    }

    const handleConfirmDelete = async () => {
        if (!deletingId) return

        try {
            console.log('Deleting material:', deletingId)

            const { error } = await supabase
                .from('course_materials')
                .delete()
                .eq('id', deletingId)

            if (error) {
                console.error('Delete error:', error)
                throw new Error(`Error al eliminar: ${error.message}`)
            }

            console.log('Material deleted successfully')
            setDeletingId(null)
            router.refresh()
        } catch (error: any) {
            console.error('Error deleting material:', error)
            const errorMessage = error?.message || JSON.stringify(error)
            alert(`Error al eliminar el material: ${errorMessage}`)
            setDeletingId(null)
        }
    }

    const handleCancelDelete = () => {
        setDeletingId(null)
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

    const materialToDelete = materials.find(m => m.id === deletingId)

    return (
        <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Materiales del Curso ({materials.length})
            </h2>

            {deletingId && materialToDelete && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            Confirmar eliminación
                        </h3>
                        <p className="text-sm text-gray-600 mb-6">
                            ¿Estás seguro de eliminar "{materialToDelete.title}"?
                        </p>
                        <div className="flex gap-3 justify-end">
                            <button
                                onClick={handleCancelDelete}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleConfirmDelete}
                                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700"
                            >
                                Eliminar
                            </button>
                        </div>
                    </div>
                </div>
            )}

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
                                    onClick={() => handleDeleteClick(material.id)}
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
