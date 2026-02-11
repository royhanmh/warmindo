import { motion, AnimatePresence } from 'framer-motion'
import { type MenuItem } from '@/data/menu'
import { MenuItemCard } from './MenuItemCard'
import type { MenuCategory } from '@/data/menu'

interface MenuGridProps {
    category: MenuCategory
    items: MenuItem[]
    onItemClick: (item: MenuItem) => void
    onEditItem?: (item: MenuItem) => void
}

export function MenuGrid({ category, items, onItemClick, onEditItem }: MenuGridProps) {
    const filteredItems = items.filter(item => item.category === category)

    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <AnimatePresence initial={false}>
                {filteredItems.map((item) => (
                    <motion.div
                        key={item.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.2, ease: 'easeOut' }}
                    >
                        <MenuItemCard
                            item={item}
                            onClick={onItemClick}
                            onEdit={onEditItem}
                        />
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    )
}
