export interface InventoryItem {
    id: string
    name: string
    category: string
    stock: number
    unit: string
    threshold: number
    lastRestocked: string
}

export const inventoryData: InventoryItem[] = [
    { id: 'inv-1', name: 'Indomie Goreng', category: 'Noodles', stock: 150, unit: 'packs', threshold: 30, lastRestocked: '2026-02-09' },
    { id: 'inv-2', name: 'Indomie Soto', category: 'Noodles', stock: 120, unit: 'packs', threshold: 30, lastRestocked: '2026-02-09' },
    { id: 'inv-3', name: 'Indomie Kuah', category: 'Noodles', stock: 80, unit: 'packs', threshold: 25, lastRestocked: '2026-02-08' },
    { id: 'inv-4', name: 'Indomie Rendang', category: 'Noodles', stock: 60, unit: 'packs', threshold: 20, lastRestocked: '2026-02-08' },
    { id: 'inv-5', name: 'Indomie Ayam Bawang', category: 'Noodles', stock: 45, unit: 'packs', threshold: 20, lastRestocked: '2026-02-07' },
    { id: 'inv-6', name: 'Indomie Kari Ayam', category: 'Noodles', stock: 90, unit: 'packs', threshold: 25, lastRestocked: '2026-02-09' },
    { id: 'inv-7', name: 'Mie Sedaap Goreng', category: 'Noodles', stock: 15, unit: 'packs', threshold: 20, lastRestocked: '2026-02-06' },
    { id: 'inv-8', name: 'Mie Sedaap Soto', category: 'Noodles', stock: 5, unit: 'packs', threshold: 20, lastRestocked: '2026-02-05' },
    { id: 'inv-9', name: 'Telur', category: 'Toppings', stock: 200, unit: 'pcs', threshold: 50, lastRestocked: '2026-02-10' },
    { id: 'inv-10', name: 'Kornet', category: 'Toppings', stock: 8, unit: 'cans', threshold: 10, lastRestocked: '2026-02-07' },
    { id: 'inv-11', name: 'Keju', category: 'Toppings', stock: 25, unit: 'slices', threshold: 15, lastRestocked: '2026-02-09' },
    { id: 'inv-12', name: 'Sawi', category: 'Toppings', stock: 3, unit: 'kg', threshold: 2, lastRestocked: '2026-02-09' },
    { id: 'inv-13', name: 'Sosis', category: 'Toppings', stock: 40, unit: 'pcs', threshold: 15, lastRestocked: '2026-02-08' },
    { id: 'inv-14', name: 'Es Teh', category: 'Drinks', stock: 50, unit: 'sachets', threshold: 20, lastRestocked: '2026-02-09' },
    { id: 'inv-15', name: 'Kopi', category: 'Drinks', stock: 30, unit: 'sachets', threshold: 15, lastRestocked: '2026-02-08' },
    { id: 'inv-16', name: 'Air Mineral', category: 'Drinks', stock: 100, unit: 'bottles', threshold: 30, lastRestocked: '2026-02-10' },
]

export function getStockStatus(item: InventoryItem): 'in-stock' | 'low-stock' | 'out-of-stock' {
    if (item.stock === 0) return 'out-of-stock'
    if (item.stock <= item.threshold) return 'low-stock'
    return 'in-stock'
}
