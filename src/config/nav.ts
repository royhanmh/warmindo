import {
    UtensilsCrossed,
    Boxes,
    Receipt,
    BarChart3,
    type LucideIcon,
} from 'lucide-react'

export type PageType = 'pos' | 'inventory' | 'transactions' | 'dashboard'

export interface NavItem {
    id: PageType
    icon: LucideIcon
    label: string
    roles: string[]
}

export const NAV_ITEMS: NavItem[] = [
    { id: 'pos', icon: UtensilsCrossed, label: 'POS', roles: ['admin', 'cashier'] },
    { id: 'inventory', icon: Boxes, label: 'Stok', roles: ['admin'] },
    { id: 'transactions', icon: Receipt, label: 'Riwayat', roles: ['admin', 'cashier'] },
    { id: 'dashboard', icon: BarChart3, label: 'Laporan', roles: ['admin'] },
]
