import { useState } from 'react'
import { motion } from 'framer-motion'
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
    Dialog, DialogContent, DialogHeader, DialogTitle,
    DialogDescription, DialogFooter,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { getStockStatus, type InventoryItem } from '@/data/inventory'
import { loadInventory, saveInventory } from '@/lib/inventory-store'
import { Select } from '@/components/ui/native-select'
import { Search, Plus, Package, AlertTriangle, Clock } from 'lucide-react'

export function InventoryPage() {
    const [search, setSearch] = useState('')
    const [dialogOpen, setDialogOpen] = useState(false)
    const [inventory, setInventory] = useState<InventoryItem[]>(loadInventory)
    const [newItem, setNewItem] = useState({ name: '', quantity: '', unit: '' })

    const filtered = inventory.filter(item =>
        item.name.toLowerCase().includes(search.toLowerCase())
    )

    const lowStockCount = inventory.filter(i => getStockStatus(i) !== 'in-stock').length

    const handleAddStock = () => {
        if (!newItem.name || !newItem.quantity) return
        const qty = parseInt(newItem.quantity)
        if (isNaN(qty) || qty <= 0) return

        const today = new Date().toISOString().split('T')[0]
        const updated = inventory.map(item =>
            item.id === newItem.name
                ? { ...item, stock: item.stock + qty, lastRestocked: today }
                : item
        )
        setInventory(updated)
        saveInventory(updated)
        setNewItem({ name: '', quantity: '', unit: '' })
        setDialogOpen(false)
    }

    const statusBadge = (item: InventoryItem) => {
        const status = getStockStatus(item)
        switch (status) {
            case 'in-stock':
                return <Badge variant="success">In Stock</Badge>
            case 'low-stock':
                return <Badge variant="warning">⚠️ Low Stock</Badge>
            case 'out-of-stock':
                return <Badge variant="destructive">Out of Stock</Badge>
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
                            📦 Inventory Management
                        </h1>
                        <p className="text-muted-foreground text-sm mt-1">
                            Kelola stok bahan dan pantau ketersediaan
                        </p>
                    </div>
                    <Button onClick={() => setDialogOpen(true)} className="w-full md:w-auto gap-2">
                        <Plus className="w-4 h-4" />
                        Tambah Stok
                    </Button>
                </div>
            </motion.div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white rounded-xl border p-4"
                >
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
                            <Package className="w-5 h-5 text-success" />
                        </div>
                        <div>
                            <p className="text-2xl font-heading font-bold">{inventory.length}</p>
                            <p className="text-xs text-muted-foreground">Total Items</p>
                        </div>
                    </div>
                </motion.div>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white rounded-xl border p-4"
                >
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center">
                            <AlertTriangle className="w-5 h-5 text-accent-600" />
                        </div>
                        <div>
                            <p className="text-2xl font-heading font-bold text-accent-600">{lowStockCount}</p>
                            <p className="text-xs text-muted-foreground">Low / Out</p>
                        </div>
                    </div>
                </motion.div>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-white rounded-xl border p-4"
                >
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                            <Package className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                            <p className="text-2xl font-heading font-bold">
                                {inventory.reduce((sum, i) => sum + i.stock, 0)}
                            </p>
                            <p className="text-xs text-muted-foreground">Total Units</p>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Search */}
            <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                    placeholder="Cari item..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-10 bg-white"
                />
            </div>

            {/* Desktop Table */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="hidden md:block bg-white rounded-xl border overflow-hidden"
            >
                <Table>
                    <TableHeader>
                        <TableRow className="bg-gray-50">
                            <TableHead>Item</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead className="text-right">Stock</TableHead>
                            <TableHead>Unit</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Last Restocked</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filtered.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                                    Tidak ada item ditemukan
                                </TableCell>
                            </TableRow>
                        ) : (
                            filtered.map((item, index) => (
                                <motion.tr
                                    key={item.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.03 }}
                                    className="border-b transition-colors hover:bg-muted/50"
                                >
                                    <TableCell className="font-semibold">{item.name}</TableCell>
                                    <TableCell className="text-muted-foreground">{item.category}</TableCell>
                                    <TableCell className="text-right font-heading font-bold">
                                        {item.stock}
                                    </TableCell>
                                    <TableCell className="text-muted-foreground">{item.unit}</TableCell>
                                    <TableCell>{statusBadge(item)}</TableCell>
                                    <TableCell className="text-muted-foreground text-sm">{item.lastRestocked}</TableCell>
                                </motion.tr>
                            ))
                        )}
                    </TableBody>
                </Table>
            </motion.div>

            {/* Mobile Card View */}
            <div className="md:hidden space-y-4">
                {filtered.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground bg-white rounded-xl border p-4">
                        Tidak ada item ditemukan
                    </div>
                ) : (
                    filtered.map((item, index) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.03 }}
                            className="bg-white rounded-xl border p-4 shadow-sm"
                        >
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <h3 className="font-semibold text-lg">{item.name}</h3>
                                    <span className="text-xs text-muted-foreground bg-gray-100 px-2 py-0.5 rounded-full capitalize">
                                        {item.category}
                                    </span>
                                </div>
                                {statusBadge(item)}
                            </div>

                            <div className="flex justify-between items-end mt-4 pt-4 border-t border-dashed">
                                <div>
                                    <p className="text-xs text-muted-foreground mb-1">Last Restocked</p>
                                    <div className="flex items-center gap-1.5 text-sm font-medium">
                                        <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                                        {item.lastRestocked || '-'}
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs text-muted-foreground mb-1">Available Stock</p>
                                    <p className="text-2xl font-heading font-bold text-primary leading-none">
                                        {item.stock} <span className="text-sm font-normal text-muted-foreground ml-0.5">{item.unit}</span>
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    ))
                )}
            </div>

            {/* Add Stock Dialog */}
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Tambah Stok</DialogTitle>
                        <DialogDescription>
                            Pilih item dan masukkan jumlah stok yang ditambahkan
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="stock-item">Pilih Item</Label>
                            <Select
                                id="stock-item"
                                value={newItem.name}
                                onChange={(e) => {
                                    const selected = inventory.find(i => i.id === e.target.value)
                                    setNewItem(prev => ({
                                        ...prev,
                                        name: e.target.value,
                                        unit: selected?.unit || ''
                                    }))
                                }}
                            >
                                <option value="">-- Pilih item --</option>
                                {inventory.map(item => (
                                    <option key={item.id} value={item.id}>
                                        {item.name} (Stok: {item.stock} {item.unit})
                                    </option>
                                ))}
                            </Select>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="quantity">Jumlah Tambah</Label>
                                <Input
                                    id="quantity"
                                    type="number"
                                    value={newItem.quantity}
                                    onChange={(e) => setNewItem(prev => ({ ...prev, quantity: e.target.value }))}
                                    placeholder="50"
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="unit">Satuan</Label>
                                <Input
                                    id="unit"
                                    value={newItem.unit}
                                    disabled
                                    className="bg-muted"
                                />
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDialogOpen(false)}>Batal</Button>
                        <Button onClick={handleAddStock} disabled={!newItem.name || !newItem.quantity}>Tambah Stok</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
