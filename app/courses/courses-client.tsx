'use client'

import { useState, useMemo } from 'react'
import { Search } from 'lucide-react'
import { CourseCard } from './course-card'
import { CategoryFilter } from './category-filter'

interface Course {
    id: string
    title: string
    description: string
    category: string
    material_count?: number
}

interface CoursesClientProps {
    courses: Course[]
    categories: string[]
}

export function CoursesClient({ courses, categories }: CoursesClientProps) {
    const [selectedCategory, setSelectedCategory] = useState('all')
    const [searchQuery, setSearchQuery] = useState('')

    const filteredCourses = useMemo(() => {
        return courses.filter((course) => {
            const matchesCategory = selectedCategory === 'all' || course.category === selectedCategory
            const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                course.description.toLowerCase().includes(searchQuery.toLowerCase())
            return matchesCategory && matchesSearch
        })
    }, [courses, selectedCategory, searchQuery])

    return (
        <div className="space-y-6">
            {/* Search */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <input
                    type="text"
                    placeholder="Buscar cursos..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 pl-10 pr-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
                />
            </div>

            {/* Category Filter */}
            <CategoryFilter
                categories={categories}
                selectedCategory={selectedCategory}
                onSelectCategory={setSelectedCategory}
            />

            {/* Results count */}
            <p className="text-sm text-gray-600">
                {filteredCourses.length} {filteredCourses.length === 1 ? 'curso encontrado' : 'cursos encontrados'}
            </p>

            {/* Courses Grid */}
            {filteredCourses.length > 0 ? (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {filteredCourses.map((course) => (
                        <CourseCard key={course.id} course={course} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-12">
                    <p className="text-gray-500">No se encontraron cursos</p>
                </div>
            )}
        </div>
    )
}
