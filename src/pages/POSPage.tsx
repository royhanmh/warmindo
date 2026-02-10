import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { MenuGrid } from '@/components/pos/MenuGrid'
import { BuildYourBowlDrawer } from '@/components/pos/BuildYourBowlDrawer'
import { type MenuItem, type MenuCategory } from '@/data/menu'
import { useCart } from '@/contexts/CartContext'
import { UtensilsCrossed, GlassWater, Cherry } from 'lucide-react'

export function POSPage() {
    const [activeCategory, setActiveCategory] = useState<MenuCategory>('noodles')
    const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null)
    const [drawerOpen, setDrawerOpen] = useState(false)
    const { addItem } = useCart()

    useEffect(() => {
        const main = document.getElementById('main-scroll-container')
        if (main) main.scrollTo({ top: 0, behavior: 'smooth' })
    }, [activeCategory])

    const handleItemClick = (item: MenuItem) => {
        if (item.category === 'noodles') {
            // Open Build-Your-Bowl drawer for noodles
            setSelectedItem(item)
            setDrawerOpen(true)
        } else {
            // Direct add for drinks and toppings
            addItem({
                id: item.id,
                cartItemId: `${item.id}-${Date.now()}`,
                baseNoodleName: item.name,
                toppings: [],
                totalPrice: item.price,
                quantity: 1,
                emoji: item.emoji,
            })
        }
    }

    return (
        <div className="p-4 md:p-6">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6"
            >
                <h1 className="font-heading text-2xl font-bold text-gray-900">
                    🍜 Noodle Station
                </h1>
                <p className="text-muted-foreground text-sm mt-1">
                    Pilih menu dan buat pesanan dengan cepat
                </p>
            </motion.div>

            {/* Category Tabs */}
            <Tabs
                value={activeCategory}
                onValueChange={(val) => setActiveCategory(val as MenuCategory)}
            >
                <TabsList className="mb-6 bg-white shadow-sm border">
                    <TabsTrigger value="noodles" className="gap-2 px-6">
                        <UtensilsCrossed className="w-4 h-4" />
                        Mi Instan
                    </TabsTrigger>
                    <TabsTrigger value="drinks" className="gap-2 px-6">
                        <GlassWater className="w-4 h-4" />
                        Minuman
                    </TabsTrigger>
                    <TabsTrigger value="toppings" className="gap-2 px-6">
                        <Cherry className="w-4 h-4" />
                        Topping
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="noodles">
                    <MenuGrid category="noodles" onItemClick={handleItemClick} />
                </TabsContent>
                <TabsContent value="drinks">
                    <MenuGrid category="drinks" onItemClick={handleItemClick} />
                </TabsContent>
                <TabsContent value="toppings">
                    <MenuGrid category="toppings" onItemClick={handleItemClick} />
                </TabsContent>
            </Tabs>

            {/* Build Your Bowl Drawer */}
            <BuildYourBowlDrawer
                item={selectedItem}
                open={drawerOpen}
                onOpenChange={setDrawerOpen}
            />
        </div>
    )
}
