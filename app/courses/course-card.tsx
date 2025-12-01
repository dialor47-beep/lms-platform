'use client'

import Link from 'next/link'
import { BookOpen } from 'lucide-react'

interface Course {
    id: string
    title: string
    description: string
    category: string
    material_count?: number
}

export function CourseCard({ course }: { course: Course }) {
    return (
        <Link href={`/courses/${course.id}`}>
            <div className="group h-full rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md hover:border-blue-300">
                <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 rounded-lg bg-blue-100 p-3">
                        <BookOpen className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                            {course.title}
                        </h3>
                        <p className="mt-1 text-sm text-gray-500 line-clamp-2">
                            {course.description}
                        </p>
                        <div className="mt-4 flex items-center gap-4">
                            <span className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
                                {course.category}
                            </span>
                            {course.material_count !== undefined && (
                                <span className="text-xs text-gray-500">
                                    {course.material_count} {course.material_count === 1 ? 'material' : 'materiales'}
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    )
}
