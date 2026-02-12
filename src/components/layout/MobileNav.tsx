import { useRef } from 'react'
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

    const touchStartX = useRef<number | null>(null)
    const touchStartY = useRef<number | null>(null)

    const handleTouchStart = (e: React.TouchEvent) => {
        touchStartX.current = e.touches[0].clientX
        touchStartY.current = e.touches[0].clientY
    }

    const handleTouchEnd = (e: React.TouchEvent) => {
        if (!touchStartX.current || !touchStartY.current) return

        const deltaX = e.changedTouches[0].clientX - touchStartX.current
        const deltaY = e.changedTouches[0].clientY - touchStartY.current
        touchStartX.current = null
        touchStartY.current = null

        // Threshold 30px, Horizontal dominant
        if (Math.abs(deltaX) > 30 && Math.abs(deltaX) > Math.abs(deltaY) * 1.5) {
            const currentIndex = navItems.findIndex(item => item.id === activePage)

            if (deltaX < 0 && currentIndex < navItems.length - 1) {
                // Swipe Left -> Next Page
                onPageChange(navItems[currentIndex + 1].id)
            } else if (deltaX > 0 && currentIndex > 0) {
                // Swipe Right -> Prev Page
                onPageChange(navItems[currentIndex - 1].id)
            }
        }
    }

    return (
        <div
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            className="fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-gray-200 flex items-center justify-around px-2 z-50 md:hidden pb-safe"
        >
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
