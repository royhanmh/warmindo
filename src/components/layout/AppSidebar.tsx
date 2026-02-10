import { useAuth } from '@/contexts/AuthContext'
import { motion } from 'framer-motion'
import {
    ChefHat,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { UserProfile } from './UserProfile'

import { NAV_ITEMS, type PageType } from '@/config/nav'

interface AppSidebarProps {
    activePage: PageType
    onPageChange: (page: PageType) => void
}

export function AppSidebar({ activePage, onPageChange }: AppSidebarProps) {
    const { user } = useAuth()
    const navItems = NAV_ITEMS.filter(item => user && item.roles.includes(user.role))
    return (
        <aside className="flex flex-col items-center w-20 bg-gradient-to-b from-gray-900 to-gray-800 py-6 gap-2 shrink-0">
            {/* Logo */}
            <motion.div
                className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary mb-6 shadow-lg shadow-primary/30"
                whileHover={{ scale: 1.06, rotate: 3 }}
                whileTap={{ scale: 0.96 }}
                transition={{ type: 'spring', stiffness: 260, damping: 20 }}
            >
                <ChefHat className="w-7 h-7 text-white" />
            </motion.div>

            {/* Nav Items */}
            <nav className="flex flex-col items-center gap-1 flex-1">
                {navItems.map(({ id, icon: Icon, label }) => {
                    const isActive = activePage === id
                    return (
                        <motion.button
                            key={id}
                            onClick={() => onPageChange(id)}
                            className={cn(
                                'relative flex flex-col items-center justify-center w-14 h-14 rounded-xl transition-all duration-200 group',
                                isActive
                                    ? 'text-white'
                                    : 'text-gray-400 hover:text-gray-200'
                            )}
                            whileHover={{ scale: 1.04 }}
                            whileTap={{ scale: 0.94 }}
                            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                        >
                            {isActive && (
                                <motion.div
                                    layoutId="activeNav"
                                    className="absolute inset-0 bg-primary rounded-xl shadow-lg shadow-primary/30"
                                    transition={{ type: 'spring', stiffness: 200, damping: 22, mass: 0.9 }}
                                />
                            )}
                            <Icon className="w-5 h-5 relative z-10" />
                            <span className="text-[10px] font-medium mt-1 relative z-10">{label}</span>
                        </motion.button>
                    )
                })}
            </nav>

            {/* Footer / User Profile */}
            <div className="mt-auto pb-4">
                <UserProfile />
            </div>
        </aside>
    )
}
