import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { type MenuItem, formatRupiah } from '@/data/menu'

interface MenuItemCardProps {
    item: MenuItem
    onClick: (item: MenuItem) => void
}

export function MenuItemCard({ item, onClick }: MenuItemCardProps) {
    return (
        <motion.div
            whileHover={{ y: -4, scale: 1.02 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 400, damping: 17 }}
        >
            <Card
                className="cursor-pointer overflow-hidden group relative"
                onClick={() => onClick(item)}
            >
                {/* Emoji Header */}
                <div className="h-28 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center relative overflow-hidden">
                    <motion.span
                        className="text-5xl"
                        whileHover={{ scale: 1.2, rotate: 10 }}
                        transition={{ type: 'spring', stiffness: 300 }}
                    >
                        {item.emoji}
                    </motion.span>
                    {item.isPopular && (
                        <Badge className="absolute top-2 right-2 bg-accent text-accent-foreground text-[10px]">
                            🔥 Popular
                        </Badge>
                    )}
                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                </div>

                <CardContent className="p-3">
                    <h3 className="font-heading font-bold text-sm truncate">{item.name}</h3>
                    <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{item.description}</p>
                    <div className="flex items-center justify-between mt-2">
                        <span className="font-heading font-bold text-primary text-base">
                            {formatRupiah(item.price)}
                        </span>
                        <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
                            <span className="text-primary group-hover:text-white text-lg leading-none">+</span>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    )
}
