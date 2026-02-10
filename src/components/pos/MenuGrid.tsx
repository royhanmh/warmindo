import { motion, AnimatePresence } from 'framer-motion'
import { type MenuItem, menuItems } from '@/data/menu'
import { MenuItemCard } from './MenuItemCard'
import type { MenuCategory } from '@/data/menu'

interface MenuGridProps {
    category: MenuCategory
    onItemClick: (item: MenuItem) => void
}

export function MenuGrid({ category, onItemClick }: MenuGridProps) {
    const filteredItems = menuItems.filter(item => item.category === category)

    return (
        <motion.div
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
            layout
        >
            <AnimatePresence mode="popLayout">
                {filteredItems.map((item, index) => (
                    <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{
                            type: 'spring',
                            stiffness: 300,
                            damping: 20,
                            delay: index * 0.05,
                        }}
                        layout
                    >
                        <MenuItemCard item={item} onClick={onItemClick} />
                    </motion.div>
                ))}
            </AnimatePresence>
        </motion.div>
    )
}
