'use client'

import { useState } from 'react'
import { X } from 'lucide-react'

interface Material {
    id: string
    title: string
    type: 'pdf' | 'word' | 'excel' | 'powerpoint' | 'video' | 'link'
    url: string
}

interface MaterialViewerProps {
    material: Material | null
    onClose: () => void
}

export function MaterialViewer({ material, onClose }: MaterialViewerProps) {
    if (!material) return null

    const getYouTubeEmbedUrl = (url: string) => {
        const videoId = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/)?.[1]
        return videoId ? `https://www.youtube.com/embed/${videoId}` : null
    }

    const renderContent = () => {
        if (material.type === 'video') {
            const embedUrl = getYouTubeEmbedUrl(material.url)
            if (embedUrl) {
                return (
                    <div className="aspect-video w-full">
                        <iframe
                            src={embedUrl}
                            title={material.title}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            className="h-full w-full rounded-lg"
                        />
                    </div>
                )
            }
        }

        if (material.type === 'pdf') {
            return (
                <div className="h-[600px] w-full">
                    <iframe
                        src={material.url}
                        title={material.title}
                        className="h-full w-full rounded-lg border border-gray-300"
                    />
                </div>
            )
        }

        return (
            <div className="text-center py-12">
                <p className="text-gray-500">
                    Este tipo de archivo no se puede visualizar en el navegador.
                </p>
                <a
                    href={material.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-block rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                >
                    Descargar Archivo
                </a>
            </div>
        )
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="relative w-full max-w-5xl rounded-lg bg-white p-6 shadow-xl">
                <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-xl font-semibold text-gray-900">{material.title}</h3>
                    <button
                        onClick={onClose}
                        className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>
                {renderContent()}
            </div>
        </div>
    )
}
