'use client'

import { FileText, Video, Link as LinkIcon, Download, ExternalLink } from 'lucide-react'

interface Material {
    id: string
    title: string
    type: 'pdf' | 'word' | 'excel' | 'powerpoint' | 'video' | 'link'
    url: string
    file_name?: string
}

const materialIcons = {
    pdf: FileText,
    word: FileText,
    excel: FileText,
    powerpoint: FileText,
    video: Video,
    link: LinkIcon,
}

const materialColors = {
    pdf: 'bg-red-100 text-red-600',
    word: 'bg-blue-100 text-blue-600',
    excel: 'bg-green-100 text-green-600',
    powerpoint: 'bg-orange-100 text-orange-600',
    video: 'bg-purple-100 text-purple-600',
    link: 'bg-gray-100 text-gray-600',
}

export function MaterialItem({ material }: { material: Material }) {
    const Icon = materialIcons[material.type]
    const colorClass = materialColors[material.type]

    const handleAction = () => {
        if (material.type === 'video') {
            // YouTube videos will be handled by MaterialViewer
            return
        } else if (material.type === 'link') {
            window.open(material.url, '_blank')
        } else {
            // Download file
            window.open(material.url, '_blank')
        }
    }

    const getActionText = () => {
        if (material.type === 'video') return 'Ver Video'
        if (material.type === 'link') return 'Abrir Enlace'
        return 'Descargar'
    }

    const getActionIcon = () => {
        if (material.type === 'video') return Video
        if (material.type === 'link') return ExternalLink
        return Download
    }

    const ActionIcon = getActionIcon()

    return (
        <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4 flex-1 min-w-0">
                <div className={`flex-shrink-0 rounded-lg p-3 ${colorClass}`}>
                    <Icon className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-gray-900 truncate">{material.title}</h4>
                    {material.file_name && (
                        <p className="text-sm text-gray-500 truncate">{material.file_name}</p>
                    )}
                </div>
            </div>
            <button
                onClick={handleAction}
                className="flex-shrink-0 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
            >
                <ActionIcon className="h-4 w-4" />
                {getActionText()}
            </button>
        </div>
    )
}
