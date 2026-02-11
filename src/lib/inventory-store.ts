import { inventoryData, type InventoryItem } from '@/data/inventory'

const INVENTORY_STORAGE_KEY = 'warmindo-inventory'

export function loadInventory(): InventoryItem[] {
    try {
        const stored = localStorage.getItem(INVENTORY_STORAGE_KEY)
        if (stored) return JSON.parse(stored)
    } catch { /* ignore */ }
    return inventoryData
}

export function saveInventory(items: InventoryItem[]) {
    localStorage.setItem(INVENTORY_STORAGE_KEY, JSON.stringify(items))
}

export function addInventoryItem(item: InventoryItem) {
    const current = loadInventory()
    const updated = [...current, item]
    saveInventory(updated)
    return updated
}
