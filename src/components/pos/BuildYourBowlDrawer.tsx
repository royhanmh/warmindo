import { useState } from 'react'
import { motion } from 'framer-motion'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
    DrawerDescription,
    DrawerFooter,
    DrawerClose,
} from '@/components/ui/drawer'
import { ShoppingCart, Plus, Minus } from 'lucide-react'
import { type MenuItem, toppings, formatRupiah } from '@/data/menu'
import { useCart, type CartTopping } from '@/contexts/CartContext'

interface BuildYourBowlDrawerProps {
    item: MenuItem | null
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function BuildYourBowlDrawer({ item, open, onOpenChange }: BuildYourBowlDrawerProps) {
    const [selectedToppings, setSelectedToppings] = useState<string[]>([])
    const [selectedVariant, setSelectedVariant] = useState<string | null>(null)
    const [quantity, setQuantity] = useState(1)
    const [note, setNote] = useState('')
    const { addItem } = useCart()

    // Reset variant when item changes
    if (item && item.variants && !selectedVariant) {
        // Optional: auto-select first variant? No, force user to choose.
    }

    if (!item) return null

    const selectedToppingObjects = toppings.filter(t => selectedToppings.includes(t.id))
    const toppingsTotal = selectedToppingObjects.reduce((sum, t) => sum + t.price, 0)
    const unitPrice = item.price + toppingsTotal
    const totalPrice = unitPrice * quantity

    const handleToppingToggle = (toppingId: string) => {
        setSelectedToppings(prev =>
            prev.includes(toppingId)
                ? prev.filter(id => id !== toppingId)
                : [...prev, toppingId]
        )
    }

    const handleAddToCart = () => {
        const cartToppings: CartTopping[] = selectedToppingObjects.map(t => ({
            id: t.id,
            name: t.name,
            price: t.price,
        }))

        addItem({
            id: item.id,
            cartItemId: `${item.id}-${Date.now()}`,
            baseNoodleName: item.variants && selectedVariant ? `${item.name} (${selectedVariant})` : item.name,
            toppings: cartToppings,
            totalPrice: unitPrice,
            quantity,
            emoji: item.emoji,
            note: note.trim() || undefined
        })

        // Reset and close
        setSelectedToppings([])
        setSelectedVariant(null)
        setQuantity(1)
        setNote('')
        onOpenChange(false)
    }

    const handleClose = () => {
        setSelectedToppings([])
        setSelectedVariant(null)
        setQuantity(1)
        setNote('')
        onOpenChange(false)
    }

    return (
        <Drawer open={open} onOpenChange={handleClose}>
            <DrawerContent className="max-h-[85vh]">
                <DrawerHeader className="text-left">
                    <div className="flex items-center gap-3">
                        <span className="text-4xl">{item.emoji}</span>
                        <div>
                            <DrawerTitle className="text-xl">{item.name}</DrawerTitle>
                            <DrawerDescription>{item.description}</DrawerDescription>
                        </div>
                    </div>
                    <div className="mt-2">
                        <span className="text-2xl font-heading font-bold text-primary">
                            {formatRupiah(item.price)}
                        </span>
                        <span className="text-sm text-muted-foreground ml-2">base price</span>
                    </div>
                </DrawerHeader>

                <div className="px-4 overflow-y-auto">
                    <Separator className="mb-4" />

                    {/* Variant Section */}
                    {item.variants && (
                        <div className="mb-6">
                            <h3 className="font-heading font-bold text-sm uppercase tracking-wider text-muted-foreground mb-3">
                                🍜 Pilih Jenis Mie
                            </h3>
                            <div className="grid grid-cols-3 gap-2">
                                {item.variants.map((variant) => {
                                    const isSelected = selectedVariant === variant
                                    return (
                                        <motion.div
                                            key={variant}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => setSelectedVariant(variant)}
                                            className={`
                                                cursor-pointer rounded-xl border-2 p-3 text-center transition-all
                                                ${isSelected
                                                    ? 'border-primary bg-primary/10 text-primary font-bold shadow-sm'
                                                    : 'border-gray-100 bg-gray-50 text-gray-600 hover:border-gray-200'}
                                            `}
                                        >
                                            {variant}
                                        </motion.div>
                                    )
                                })}
                            </div>
                            <Separator className="my-4" />
                        </div>
                    )}

                    {/* Toppings Section - Only for Noodles */}
                    {item.category === 'noodles' && (
                        <>
                            <h3 className="font-heading font-bold text-sm uppercase tracking-wider text-muted-foreground mb-3">
                                🧑‍🍳 Pilih Topping
                            </h3>
                            <div className="grid gap-2">
                                {toppings.map((topping) => {
                                    const isSelected = selectedToppings.includes(topping.id)
                                    return (
                                        <motion.div
                                            key={topping.id}
                                            whileTap={{ scale: 0.98 }}
                                            className={`flex items-center justify-between p-3 rounded-xl border-2 cursor-pointer transition-all duration-150 ${isSelected
                                                ? 'border-primary bg-primary-50 shadow-sm'
                                                : 'border-gray-100 hover:border-gray-200 bg-gray-50/50'
                                                }`}
                                            onClick={() => handleToppingToggle(topping.id)}
                                        >
                                            <div className="flex items-center gap-3">
                                                <Checkbox
                                                    checked={isSelected}
                                                    onCheckedChange={() => handleToppingToggle(topping.id)}
                                                />
                                                <span className="text-xl">{topping.emoji}</span>
                                                <Label className="cursor-pointer font-medium">{topping.name}</Label>
                                            </div>
                                            <span className={`font-semibold text-sm ${isSelected ? 'text-primary' : 'text-muted-foreground'
                                                }`}>
                                                +{formatRupiah(topping.price)}
                                            </span>
                                        </motion.div>
                                    )
                                })}
                            </div>
                            <Separator className="my-4" />
                        </>
                    )}

                    {/* Note Input */}
                    <div className="mb-4">
                        <Label htmlFor="item-note" className="block font-heading font-bold text-sm uppercase tracking-wider text-muted-foreground mb-2">
                            📝 Catatan (Opsional)
                        </Label>
                        <Input
                            id="item-note"
                            placeholder="Contoh: Pedas, Tanpa Sayur, Kuah Pisah..."
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            className="bg-white"
                        />
                    </div>

                    <Separator className="my-4" />

                    {/* Quantity */}
                    <div className="flex items-center justify-between">
                        <span className="font-heading font-bold text-sm uppercase tracking-wider text-muted-foreground">
                            Jumlah
                        </span>
                        <div className="flex items-center gap-3">
                            <Button
                                variant="outline"
                                size="icon"
                                className="h-9 w-9 rounded-lg"
                                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                            >
                                <Minus className="h-4 w-4" />
                            </Button>
                            <span className="font-heading font-bold text-xl w-8 text-center">{quantity}</span>
                            <Button
                                variant="outline"
                                size="icon"
                                className="h-9 w-9 rounded-lg"
                                onClick={() => setQuantity(quantity + 1)}
                            >
                                <Plus className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Live Price */}
                <DrawerFooter>
                    <div className="flex items-center justify-between mb-2">
                        <div>
                            <p className="text-sm text-muted-foreground">Total Harga</p>
                            <motion.p
                                key={totalPrice}
                                initial={{ scale: 1.1, color: '#D71920' }}
                                animate={{ scale: 1, color: '#1a1a1a' }}
                                className="text-2xl font-heading font-bold"
                            >
                                {formatRupiah(totalPrice)}
                            </motion.p>
                        </div>
                        {selectedToppings.length > 0 && (
                            <p className="text-xs text-muted-foreground">
                                {formatRupiah(item.price)} + {formatRupiah(toppingsTotal)} toppings
                            </p>
                        )}
                    </div>
                    <Button
                        size="xl"
                        className="w-full text-lg gap-2"
                        onClick={handleAddToCart}
                        disabled={!!item.variants && !selectedVariant}
                    >
                        <ShoppingCart className="w-5 h-5" />
                        Tambah ke Keranjang
                    </Button>
                    <DrawerClose asChild>
                        <Button variant="outline" className="w-full">
                            Batal
                        </Button>
                    </DrawerClose>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    )
}
