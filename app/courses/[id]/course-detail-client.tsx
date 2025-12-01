'use client'

import { useState } from 'react'
import { MaterialItem } from './material-item'
import { MaterialViewer } from './material-viewer'

interface Material {
    id: string
    title: string
    type: 'pdf' | 'word' | 'excel' | 'powerpoint' | 'video' | 'link'
    url: string
    file_name?: string
}

export function CourseDetailClient({ materials }: { materials: Material[] }) {
    const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(null)

    const handleMaterialClick = (material: Material) => {
        if (material.type === 'video' || material.type === 'pdf') {
            setSelectedMaterial(material)
        }
    }

    return (
        <>
            <div className="space-y-4">
                {materials.length > 0 ? (
                    materials.map((material) => (
                        <div key={material.id} onClick={() => handleMaterialClick(material)}>
                            <MaterialItem material={material} />
                        </div>
                    ))
                ) : (
                    <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                        <p className="text-gray-500">Este curso aún no tiene materiales disponibles</p>
                    </div>
                )}
            </div>

            <MaterialViewer
                material={selectedMaterial}
                onClose={() => setSelectedMaterial(null)}
            />
        </>
    )
}
