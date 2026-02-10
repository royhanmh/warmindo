import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import {
    User,
    Settings,
    LogOut,
    ChevronUp,
    ChefHat,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface UserProfileProps {
    collapsed?: boolean
}

import { UserSettingsDialog } from '@/components/admin/UserSettingsDialog'
import { AdminProfileDialog } from '@/components/admin/AdminProfileDialog'
import { CashierProfileDialog } from '@/components/layout/CashierProfileDialog'

export function UserProfile({ collapsed }: UserProfileProps) {
    const { user, logout } = useAuth()
    const [isOpen, setIsOpen] = useState(false)
    const [showSettings, setShowSettings] = useState(false)
    const [showProfile, setShowProfile] = useState(false)
    const [showCashierProfile, setShowCashierProfile] = useState(false)
    const menuRef = useRef<HTMLDivElement>(null)

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const handleProfileClick = () => {
        if (user?.role === 'admin') {
            setShowProfile(true)
        } else if (user?.role === 'cashier') {
            setShowCashierProfile(true)
        }
    }

    const menuItems = [
        {
            icon: User,
            label: 'Profile Saya',
            action: handleProfileClick
        },
        ...(user?.role === 'admin' ? [
            { icon: Settings, label: 'Kelola Akun Kasir', action: () => setShowSettings(true) },
        ] : []),
        { icon: LogOut, label: 'Keluar', action: () => logout(), variant: 'text-red-600 hover:text-red-700 hover:bg-red-50' },
    ]

    if (!user) return null

    return (
        <>
            <div className="relative" ref={menuRef}>
                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            transition={{ duration: 0.2, ease: 'easeOut' }}
                            className="absolute bottom-full left-0 mb-3 w-64 bg-white rounded-xl shadow-xl border border-gray-100 p-2 z-50 overflow-hidden"
                            style={{ marginLeft: collapsed ? '4rem' : '0' }}
                        >
                            {/* User Info Header */}
                            <div className="flex items-center gap-3 p-3 mb-2 bg-gray-50 rounded-lg">
                                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0 overflow-hidden">
                                    {user.avatar ? (
                                        <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <User className="w-5 h-5 text-primary" />
                                    )}
                                </div>
                                <div className="overflow-hidden">
                                    <h4 className="font-heading font-bold text-sm truncate">{user.name}</h4>
                                    <p className="text-xs text-muted-foreground truncate capitalize">{user.role}</p>
                                </div>
                            </div>

                            {/* Menu Items */}
                            <div className="space-y-1">
                                {menuItems.map((item, index) => (
                                    <button
                                        key={index}
                                        onClick={() => {
                                            item.action()
                                            setIsOpen(false)
                                        }}
                                        className={cn(
                                            "w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-colors",
                                            item.variant || "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                                        )}
                                    >
                                        <item.icon className="w-4 h-4" />
                                        {item.label}
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="group flex flex-col items-center gap-1 outline-none"
                >
                    <motion.div
                        className={cn(
                            "w-10 h-10 rounded-full bg-gray-100 border-2 border-transparent transition-all overflow-hidden",
                            isOpen ? "border-primary scale-110" : "group-hover:border-gray-300"
                        )}
                        whileTap={{ scale: 0.95 }}
                    >
                        {user?.avatar ? (
                            <img
                                src={user.avatar}
                                alt="User"
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-primary/10">
                                <User className="w-5 h-5 text-primary" />
                            </div>
                        )}
                    </motion.div>
                </button>
            </div>

            <UserSettingsDialog open={showSettings} onOpenChange={setShowSettings} />
            <AdminProfileDialog open={showProfile} onOpenChange={setShowProfile} />
            <CashierProfileDialog open={showCashierProfile} onOpenChange={setShowCashierProfile} />
        </>
    )
}
