'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Upload, Link as LinkIcon, FileText, Video } from 'lucide-react'
import { getSupabaseBrowserClient } from '@/lib/supabase-client'

const materialTypes = [
    { value: 'pdf', label: 'PDF', icon: FileText },
    { value: 'word', label: 'Word', icon: FileText },
    { value: 'excel', label: 'Excel', icon: FileText },
    { value: 'ppt', label: 'PowerPoint', icon: FileText },
    { value: 'video', label: 'Video (YouTube)', icon: Video },
    { value: 'link', label: 'Enlace Externo', icon: LinkIcon },
]

export function MaterialUpload({ courseId }: { courseId: string }) {
    const router = useRouter()
    const supabase = getSupabaseBrowserClient()
    const [isUploading, setIsUploading] = useState(false)
    const [formData, setFormData] = useState({
        title: '',
        type: 'pdf' as string,
        file: null as File | null,
        external_link: '',
    })

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFormData({ ...formData, file: e.target.files[0] })
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsUploading(true)

        try {
            let fileUrl = formData.external_link

            // Upload file if it's a file type
            if (['pdf', 'word', 'excel', 'ppt'].includes(formData.type) && formData.file) {
                console.log('Uploading file:', formData.file.name)
                const fileExt = formData.file.name.split('.').pop()
                const fileName = `${Date.now()}.${fileExt}`
                const filePath = `${courseId}/${fileName}`

                console.log('Upload path:', filePath)

                const { data: uploadData, error: uploadError } = await supabase.storage
                    .from('course-materials')
                    .upload(filePath, formData.file)

                if (uploadError) {
                    console.error('Upload error details:', uploadError)
                    throw new Error(`Error al subir archivo: ${uploadError.message}`)
                }

                console.log('Upload successful:', uploadData)

                const { data: { publicUrl } } = supabase.storage
                    .from('course-materials')
                    .getPublicUrl(filePath)

                console.log('Public URL:', publicUrl)
                fileUrl = publicUrl
            }

            // Get current max order
            const { data: materials } = await supabase
                .from('course_materials')
                .select('order_index')
                .eq('course_id', courseId)
                .order('order_index', { ascending: false })
                .limit(1)

            const nextOrder = materials && materials.length > 0 ? materials[0].order_index + 1 : 1

            console.log('Inserting material with order:', nextOrder)

            // Insert material
            const { error } = await supabase
                .from('course_materials')
                .insert({
                    course_id: courseId,
                    title: formData.title,
                    type: formData.type,
                    file_url: fileUrl,
                    external_link: formData.type === 'video' || formData.type === 'link' ? formData.external_link : null,
                    order_index: nextOrder,
                })

            if (error) {
                console.error('Insert error:', error)
                throw new Error(`Error al guardar material: ${error.message}`)
            }

            // Reset form
            setFormData({
                title: '',
                type: 'pdf',
                file: null,
                external_link: '',
            })

            alert('Material agregado exitosamente')
            router.refresh()
        } catch (error: any) {
            console.error('Error uploading material:', error)
            const errorMessage = error?.message || JSON.stringify(error)
            alert(`Error al subir el material: ${errorMessage}`)
        } finally {
            setIsUploading(false)
        }
    }

    const isFileType = ['pdf', 'word', 'excel', 'ppt'].includes(formData.type)
    const isLinkType = ['video', 'link'].includes(formData.type)

    return (
        <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Agregar Material
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Título del Material *
                    </label>
                    <input
                        type="text"
                        required
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
                        placeholder="Ej: Manual de Usuario"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tipo de Material *
                    </label>
                    <select
                        required
                        value={formData.type}
                        onChange={(e) => setFormData({ ...formData, type: e.target.value, file: null, external_link: '' })}
                        className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
                    >
                        {materialTypes.map((type) => (
                            <option key={type.value} value={type.value}>
                                {type.label}
                            </option>
                        ))}
                    </select>
                </div>

                {isFileType && (
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Archivo *
                        </label>
                        <div className="flex items-center justify-center w-full">
                            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    <Upload className="w-8 h-8 mb-2 text-gray-500" />
                                    <p className="mb-2 text-sm text-gray-500">
                                        <span className="font-semibold">Click para subir</span> o arrastra el archivo
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        {formData.file ? formData.file.name : 'Máximo 50MB'}
                                    </p>
                                </div>
                                <input
                                    type="file"
                                    required
                                    onChange={handleFileChange}
                                    className="hidden"
                                    accept={
                                        formData.type === 'pdf' ? '.pdf' :
                                            formData.type === 'word' ? '.doc,.docx' :
                                                formData.type === 'excel' ? '.xls,.xlsx' :
                                                    '.ppt,.pptx'
                                    }
                                />
                            </label>
                        </div>
                    </div>
                )}

                {isLinkType && (
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            {formData.type === 'video' ? 'URL de YouTube *' : 'URL del Enlace *'}
                        </label>
                        <input
                            type="url"
                            required
                            value={formData.external_link}
                            onChange={(e) => setFormData({ ...formData, external_link: e.target.value })}
                            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
                            placeholder={formData.type === 'video' ? 'https://youtube.com/watch?v=...' : 'https://...'}
                        />
                    </div>
                )}

                <button
                    type="submit"
                    disabled={isUploading}
                    className="w-full rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
                >
                    {isUploading ? 'Subiendo...' : 'Agregar Material'}
                </button>
            </form>
        </div>
    )
}
