import { motion } from 'framer-motion'
import { NAV_ITEMS, type PageType } from '@/config/nav'
import { useAuth } from '@/contexts/AuthContext'
import { cn } from '@/lib/utils'

interface MobileNavProps {
    activePage: PageType
    onPageChange: (page: PageType) => void
}

export function MobileNav({ activePage, onPageChange }: MobileNavProps) {
    const { user } = useAuth()
    const navItems = NAV_ITEMS.filter(item => user && item.roles.includes(user.role))

    return (
        <div className="fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-gray-200 flex items-center justify-around px-2 z-50 md:hidden pb-safe">
            {navItems.map(({ id, icon: Icon, label }) => {
                const isActive = activePage === id
                return (
                    <button
                        key={id}
                        onClick={() => onPageChange(id)}
                        className={cn(
                            'relative flex flex-col items-center justify-center w-16 h-full gap-1 transition-colors',
                            isActive ? 'text-primary' : 'text-gray-400 hover:text-gray-600'
                        )}
                    >
                        {isActive && (
                            <motion.div
                                layoutId="mobileNavActive"
                                className="absolute top-0 inset-x-0 mx-auto w-6 h-1 bg-primary rounded-b-full"
                            />
                        )}
                        <Icon className={cn("w-5 h-5", isActive && "fill-current/10")} />
                        <span className="text-[10px] font-medium">{label}</span>
                    </button>
                )
            })}
        </div>
    )
}
