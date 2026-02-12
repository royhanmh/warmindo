import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { MenuGrid } from '@/components/pos/MenuGrid'
import { BuildYourBowlDrawer } from '@/components/pos/BuildYourBowlDrawer'
import {
    type MenuItem, type MenuCategory, type CategoryItem,
    menuItems as defaultMenuItems, defaultCategories,
} from '@/data/menu'
import { useCart } from '@/contexts/CartContext'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select } from '@/components/ui/native-select'
import {
    Dialog, DialogContent, DialogHeader, DialogTitle,
    DialogDescription, DialogFooter,
} from '@/components/ui/dialog'
import { Plus, Trash2, Settings2, Pencil } from 'lucide-react'
import { addInventoryItem } from '@/lib/inventory-store'

const MENU_STORAGE_KEY = 'warmindo-menu-items'
const CATEGORY_STORAGE_KEY = 'warmindo-categories'

function loadMenuItems(): MenuItem[] {
    try {
        const stored = localStorage.getItem(MENU_STORAGE_KEY)
        if (stored) return JSON.parse(stored)
    } catch { /* ignore */ }
    return defaultMenuItems
}

function saveMenuItems(items: MenuItem[]) {
    localStorage.setItem(MENU_STORAGE_KEY, JSON.stringify(items))
}

function loadCategories(): CategoryItem[] {
    try {
        const stored = localStorage.getItem(CATEGORY_STORAGE_KEY)
        if (stored) return JSON.parse(stored)
    } catch { /* ignore */ }
    return defaultCategories
}

function saveCategories(cats: CategoryItem[]) {
    localStorage.setItem(CATEGORY_STORAGE_KEY, JSON.stringify(cats))
}

export function POSPage() {
    const [categories, setCategories] = useState<CategoryItem[]>(loadCategories)
    const [activeCategory, setActiveCategory] = useState<MenuCategory>(() => {
        const cats = loadCategories()
        return cats.length > 0 ? cats[0].id : 'noodles'
    })
    const [swipeDirection, setSwipeDirection] = useState(0) // -1 = left, 1 = right
    const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null)
    const [drawerOpen, setDrawerOpen] = useState(false)
    const [menuItems, setMenuItems] = useState<MenuItem[]>(loadMenuItems)
    const { addItem } = useCart()
    const { user } = useAuth()
    const isAdmin = user?.role === 'admin'

    // Add menu dialog
    const [addDialogOpen, setAddDialogOpen] = useState(false)
    const [newItem, setNewItem] = useState({ name: '', category: categories[0]?.id || '', price: '' })

    // Edit menu dialog
    const [editDialogOpen, setEditDialogOpen] = useState(false)
    const [editingItem, setEditingItem] = useState<MenuItem | null>(null)
    const [editForm, setEditForm] = useState({ name: '', category: '', price: '' })

    // Category management dialog
    const [catDialogOpen, setCatDialogOpen] = useState(false)
    const [newCat, setNewCat] = useState({ label: '', emoji: '' })
    const [editingCat, setEditingCat] = useState<CategoryItem | null>(null)
    const [editCatForm, setEditCatForm] = useState({ label: '', emoji: '' })

    useEffect(() => {
        const main = document.getElementById('main-scroll-container')
        if (main) main.scrollTo({ top: 0, behavior: 'smooth' })
    }, [activeCategory])

    // Swipe gesture for category navigation
    const touchStartX = useRef<number | null>(null)
    const touchStartY = useRef<number | null>(null)

    const handleTouchStart = useCallback((e: React.TouchEvent) => {
        touchStartX.current = e.touches[0].clientX
        touchStartY.current = e.touches[0].clientY
    }, [])

    const handleTouchEnd = useCallback((e: React.TouchEvent) => {
        if (touchStartX.current === null || touchStartY.current === null) return
        const deltaX = e.changedTouches[0].clientX - touchStartX.current
        const deltaY = e.changedTouches[0].clientY - touchStartY.current
        touchStartX.current = null
        touchStartY.current = null

        // Only trigger if horizontal swipe is dominant and exceeds threshold
        if (Math.abs(deltaX) < 25 || Math.abs(deltaY) > Math.abs(deltaX)) return

        const currentIndex = categories.findIndex(c => c.id === activeCategory)
        if (deltaX < 0 && currentIndex < categories.length - 1) {
            // Swipe left → next category
            setSwipeDirection(1)
            setActiveCategory(categories[currentIndex + 1].id)
        } else if (deltaX > 0 && currentIndex > 0) {
            // Swipe right → previous category
            setSwipeDirection(-1)
            setActiveCategory(categories[currentIndex - 1].id)
        }
    }, [categories, activeCategory])

    const handleCategoryChange = useCallback((newCategory: string) => {
        const oldIndex = categories.findIndex(c => c.id === activeCategory)
        const newIndex = categories.findIndex(c => c.id === newCategory)
        setSwipeDirection(newIndex > oldIndex ? 1 : -1)
        setActiveCategory(newCategory)
    }, [categories, activeCategory])

    // --- Menu handlers ---
    const handleItemClick = (item: MenuItem) => {
        setSelectedItem(item)
        setDrawerOpen(true)
    }

    const handleAddMenu = () => {
        if (!newItem.name.trim() || !newItem.price) return
        const price = parseInt(newItem.price)
        if (isNaN(price) || price <= 0) return

        // Duplicate check
        const exists = menuItems.some(m => m.name.toLowerCase() === newItem.name.trim().toLowerCase())
        if (exists) {
            alert('Menu dengan nama tersebut sudah ada!')
            return
        }

        const cat = categories.find(c => c.id === newItem.category)
        const item: MenuItem = {
            id: `custom-${Date.now()}`,
            name: newItem.name.trim(),
            category: newItem.category,
            price,
            description: newItem.name.trim(),
            emoji: cat?.emoji || '🍽️',
        }
        const updated = [...menuItems, item]
        setMenuItems(updated)
        saveMenuItems(updated)

        // Auto-create inventory entry
        addInventoryItem({
            id: `inv-${Date.now()}`,
            name: newItem.name.trim(),
            category: cat?.label || 'Other',
            stock: 0,
            unit: 'pcs',
            threshold: 10,
            lastRestocked: new Date().toISOString().split('T')[0],
        })

        setNewItem({ name: '', category: categories[0]?.id || '', price: '' })
        setAddDialogOpen(false)
    }

    const handleEditItem = (item: MenuItem) => {
        setEditingItem(item)
        setEditForm({ name: item.name, category: item.category, price: item.price.toString() })
        setEditDialogOpen(true)
    }

    const handleSaveEdit = () => {
        if (!editingItem || !editForm.name.trim() || !editForm.price) return
        const price = parseInt(editForm.price)
        if (isNaN(price) || price <= 0) return
        const updated = menuItems.map(item =>
            item.id === editingItem.id
                ? { ...item, name: editForm.name.trim(), category: editForm.category, price, description: editForm.name.trim() }
                : item
        )
        setMenuItems(updated)
        saveMenuItems(updated)
        setEditDialogOpen(false)
        setEditingItem(null)
    }

    const handleDeleteItem = () => {
        if (!editingItem) return
        const updated = menuItems.filter(item => item.id !== editingItem.id)
        setMenuItems(updated)
        saveMenuItems(updated)
        setEditDialogOpen(false)
        setEditingItem(null)
    }

    // --- Category handlers ---
    const handleAddCategory = () => {
        if (!newCat.label.trim() || !newCat.emoji.trim()) return
        const id = newCat.label.trim().toLowerCase().replace(/\s+/g, '-')
        if (categories.some(c => c.id === id)) return // duplicate
        const updated = [...categories, { id, label: newCat.label.trim(), emoji: newCat.emoji.trim() }]
        setCategories(updated)
        saveCategories(updated)
        setNewCat({ label: '', emoji: '' })
    }

    const handleStartEditCat = (cat: CategoryItem) => {
        setEditingCat(cat)
        setEditCatForm({ label: cat.label, emoji: cat.emoji })
    }

    const handleSaveEditCat = () => {
        if (!editingCat || !editCatForm.label.trim() || !editCatForm.emoji.trim()) return
        const updated = categories.map(c =>
            c.id === editingCat.id
                ? { ...c, label: editCatForm.label.trim(), emoji: editCatForm.emoji.trim() }
                : c
        )
        setCategories(updated)
        saveCategories(updated)
        setEditingCat(null)
    }

    const handleDeleteCategory = (catId: string) => {
        const hasItems = menuItems.some(item => item.category === catId)
        if (hasItems) {
            alert('Tidak bisa menghapus kategori yang masih memiliki menu item!')
            return
        }
        const updated = categories.filter(c => c.id !== catId)
        setCategories(updated)
        saveCategories(updated)
        if (activeCategory === catId && updated.length > 0) {
            setActiveCategory(updated[0].id)
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
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="font-heading text-2xl font-bold text-gray-900">
                            🍜 Noodle Station
                        </h1>
                        <p className="text-muted-foreground text-sm mt-1">
                            Pilih menu dan buat pesanan dengan cepat
                        </p>
                    </div>
                    {isAdmin && (
                        <div className="flex items-center gap-2 w-full md:w-auto">
                            <Button variant="outline" onClick={() => setCatDialogOpen(true)} className="gap-2 flex-1 md:flex-initial">
                                <Settings2 className="w-4 h-4" />
                                <span>Edit Kategori</span>
                            </Button>
                            <Button onClick={() => setAddDialogOpen(true)} className="gap-2 flex-1 md:flex-initial">
                                <Plus className="w-4 h-4" />
                                <span>Tambah Menu</span>
                            </Button>
                        </div>
                    )}
                </div>
            </motion.div>

            {/* Category Tabs */}
            <Tabs
                value={activeCategory}
                onValueChange={handleCategoryChange}
            >
                <div className="sticky top-0 z-10 bg-background -mx-4 px-4 md:-mx-6 md:px-6 pb-4 pt-1">
                    <TabsList className="bg-white shadow-sm border w-full md:w-auto overflow-x-auto flex md:inline-flex">
                        {categories.map(cat => (
                            <TabsTrigger key={cat.id} value={cat.id} className="gap-1.5 md:gap-2 md:px-6 flex-1 md:flex-initial whitespace-nowrap">
                                <span>{cat.emoji}</span>
                                <span>{cat.label}</span>
                            </TabsTrigger>
                        ))}
                    </TabsList>
                </div>

                <div
                    onTouchStart={handleTouchStart}
                    onTouchEnd={handleTouchEnd}
                    className="overflow-hidden min-h-[50vh]"
                >
                    <AnimatePresence mode="wait" initial={false}>
                        <motion.div
                            key={activeCategory}
                            initial={{ x: swipeDirection * 100, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: swipeDirection * -100, opacity: 0 }}
                            transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
                        >
                            {categories.map(cat => (
                                <TabsContent key={cat.id} value={cat.id} forceMount={cat.id === activeCategory ? true : undefined}>
                                    {cat.id === activeCategory && (
                                        <MenuGrid
                                            category={cat.id}
                                            items={menuItems}
                                            onItemClick={handleItemClick}
                                            onEditItem={isAdmin ? handleEditItem : undefined}
                                        />
                                    )}
                                </TabsContent>
                            ))}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </Tabs>

            {/* Build Your Bowl Drawer */}
            <BuildYourBowlDrawer item={selectedItem} open={drawerOpen} onOpenChange={setDrawerOpen} />

            {/* ===== Add Menu Dialog ===== */}
            <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Tambah Menu Baru</DialogTitle>
                        <DialogDescription>Isi detail menu yang ingin ditambahkan</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="menu-name">Nama Menu</Label>
                            <Input id="menu-name" value={newItem.name} onChange={(e) => setNewItem(p => ({ ...p, name: e.target.value }))} placeholder="e.g. Indomie Goreng Spesial" />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="menu-category">Kategori</Label>
                            <Select id="menu-category" value={newItem.category} onChange={(e) => setNewItem(p => ({ ...p, category: e.target.value }))}>
                                {categories.map(c => <option key={c.id} value={c.id}>{c.emoji} {c.label}</option>)}
                            </Select>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="menu-price">Harga (Rp)</Label>
                            <Input id="menu-price" type="number" value={newItem.price} onChange={(e) => setNewItem(p => ({ ...p, price: e.target.value }))} placeholder="e.g. 10000" />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setAddDialogOpen(false)}>Batal</Button>
                        <Button onClick={handleAddMenu} disabled={!newItem.name.trim() || !newItem.price}>Tambah</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* ===== Edit Menu Dialog ===== */}
            <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Menu</DialogTitle>
                        <DialogDescription>Ubah detail menu atau hapus item ini</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="edit-name">Nama Menu</Label>
                            <Input id="edit-name" value={editForm.name} onChange={(e) => setEditForm(p => ({ ...p, name: e.target.value }))} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="edit-category">Kategori</Label>
                            <Select id="edit-category" value={editForm.category} onChange={(e) => setEditForm(p => ({ ...p, category: e.target.value }))}>
                                {categories.map(c => <option key={c.id} value={c.id}>{c.emoji} {c.label}</option>)}
                            </Select>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="edit-price">Harga (Rp)</Label>
                            <Input id="edit-price" type="number" value={editForm.price} onChange={(e) => setEditForm(p => ({ ...p, price: e.target.value }))} />
                        </div>
                    </div>
                    <DialogFooter className="flex-col sm:flex-row gap-2">
                        <Button variant="destructive" onClick={handleDeleteItem} className="gap-2 sm:mr-auto">
                            <Trash2 className="w-4 h-4" /> Hapus
                        </Button>
                        <Button variant="outline" onClick={() => setEditDialogOpen(false)}>Batal</Button>
                        <Button onClick={handleSaveEdit} disabled={!editForm.name.trim() || !editForm.price}>Simpan</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* ===== Category Management Dialog ===== */}
            <Dialog open={catDialogOpen} onOpenChange={(open) => { setCatDialogOpen(open); if (!open) setEditingCat(null) }}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>Kelola Kategori</DialogTitle>
                        <DialogDescription>Tambah, edit, atau hapus kategori menu</DialogDescription>
                    </DialogHeader>

                    {/* Existing categories list */}
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                        {categories.map(cat => (
                            <div key={cat.id} className="flex items-center gap-3 p-2.5 bg-gray-50 rounded-lg">
                                {editingCat?.id === cat.id ? (
                                    <>
                                        <Input
                                            value={editCatForm.emoji}
                                            onChange={(e) => setEditCatForm(p => ({ ...p, emoji: e.target.value }))}
                                            className="w-14 text-center text-lg h-9"
                                            placeholder="🍽️"
                                        />
                                        <Input
                                            value={editCatForm.label}
                                            onChange={(e) => setEditCatForm(p => ({ ...p, label: e.target.value }))}
                                            className="flex-1 h-9"
                                        />
                                        <Button size="sm" onClick={handleSaveEditCat}>Simpan</Button>
                                        <Button size="sm" variant="ghost" onClick={() => setEditingCat(null)}>×</Button>
                                    </>
                                ) : (
                                    <>
                                        <span className="text-xl w-8 text-center">{cat.emoji}</span>
                                        <span className="flex-1 font-medium text-sm">{cat.label}</span>
                                        <span className="text-xs text-muted-foreground">
                                            {menuItems.filter(i => i.category === cat.id).length} item
                                        </span>
                                        <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => handleStartEditCat(cat)}>
                                            <Pencil className="w-3.5 h-3.5" />
                                        </Button>
                                        <Button size="icon" variant="ghost" className="h-7 w-7 text-red-500 hover:text-red-700 hover:bg-red-50" onClick={() => handleDeleteCategory(cat.id)}>
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </Button>
                                    </>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Add new category */}
                    <div className="border-t pt-4 mt-2">
                        <p className="text-sm font-medium mb-2">Tambah Kategori Baru</p>
                        <div className="flex items-center gap-2">
                            <Input
                                value={newCat.emoji}
                                onChange={(e) => setNewCat(p => ({ ...p, emoji: e.target.value }))}
                                className="w-14 text-center text-lg"
                                placeholder="🍽️"
                            />
                            <Input
                                value={newCat.label}
                                onChange={(e) => setNewCat(p => ({ ...p, label: e.target.value }))}
                                placeholder="Nama kategori"
                                className="flex-1"
                            />
                            <Button onClick={handleAddCategory} disabled={!newCat.label.trim() || !newCat.emoji.trim()} className="gap-1.5">
                                <Plus className="w-4 h-4" /> Tambah
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}
