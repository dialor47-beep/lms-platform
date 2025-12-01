'use client'

import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import {
    LayoutDashboard,
    BookOpen,
    Users,
    LogOut,
    Menu,
    X
} from 'lucide-react'
import { useState } from 'react'

const navigation = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Cursos', href: '/admin/courses', icon: BookOpen },
    { name: 'Usuarios', href: '/admin/users', icon: Users },
]

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const pathname = usePathname()
    const router = useRouter()
    const supabase = createClientComponentClient()
    const [sidebarOpen, setSidebarOpen] = useState(false)

    const handleLogout = async () => {
        await supabase.auth.signOut()
        router.push('/auth/login')
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Mobile sidebar */}
            <div className={`fixed inset-0 z-50 lg:hidden ${sidebarOpen ? '' : 'hidden'}`}>
                <div className="fixed inset-0 bg-gray-900/80" onClick={() => setSidebarOpen(false)} />
                <div className="fixed inset-y-0 left-0 w-64 bg-white">
                    <div className="flex h-16 items-center justify-between px-6">
                        <h1 className="text-xl font-bold text-gray-900">Admin Panel</h1>
                        <button onClick={() => setSidebarOpen(false)}>
                            <X className="h-6 w-6 text-gray-500" />
                        </button>
                    </div>
                    <nav className="mt-6 px-3">
                        {navigation.map((item) => {
                            const isActive = pathname === item.href
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${isActive
                                            ? 'bg-blue-50 text-blue-600'
                                            : 'text-gray-700 hover:bg-gray-100'
                                        }`}
                                    onClick={() => setSidebarOpen(false)}
                                >
                                    <item.icon className="h-5 w-5" />
                                    {item.name}
                                </Link>
                            )
                        })}
                    </nav>
                    <div className="absolute bottom-0 w-full border-t border-gray-200 p-4">
                        <button
                            onClick={handleLogout}
                            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
                        >
                            <LogOut className="h-5 w-5" />
                            Cerrar sesión
                        </button>
                    </div>
                </div>
            </div>

            {/* Desktop sidebar */}
            <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
                <div className="flex flex-col flex-grow border-r border-gray-200 bg-white">
                    <div className="flex h-16 items-center px-6 border-b border-gray-200">
                        <h1 className="text-xl font-bold text-gray-900">Admin Panel</h1>
                    </div>
                    <nav className="flex-1 space-y-1 px-3 py-4">
                        {navigation.map((item) => {
                            const isActive = pathname === item.href
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${isActive
                                            ? 'bg-blue-50 text-blue-600'
                                            : 'text-gray-700 hover:bg-gray-100'
                                        }`}
                                >
                                    <item.icon className="h-5 w-5" />
                                    {item.name}
                                </Link>
                            )
                        })}
                    </nav>
                    <div className="border-t border-gray-200 p-4">
                        <button
                            onClick={handleLogout}
                            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
                        >
                            <LogOut className="h-5 w-5" />
                            Cerrar sesión
                        </button>
                    </div>
                </div>
            </div>

            {/* Main content */}
            <div className="lg:pl-64">
                {/* Mobile header */}
                <div className="sticky top-0 z-40 flex h-16 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm lg:hidden">
                    <button onClick={() => setSidebarOpen(true)}>
                        <Menu className="h-6 w-6 text-gray-500" />
                    </button>
                    <h1 className="text-lg font-semibold text-gray-900">Admin Panel</h1>
                </div>

                {/* Page content */}
                <main className="py-8 px-4 sm:px-6 lg:px-8">
                    {children}
                </main>
            </div>
        </div>
    )
}
