export type MenuCategory = 'noodles' | 'drinks' | 'toppings'

export interface MenuItem {
    id: string
    name: string
    category: MenuCategory
    price: number
    description: string
    emoji: string
    isPopular?: boolean
    variants?: string[]
}

export interface Topping {
    id: string
    name: string
    price: number
    emoji: string
}

export const toppings: Topping[] = [
    { id: 'top-1', name: 'Telur (Egg)', price: 3000, emoji: '🥚' },
    { id: 'top-2', name: 'Kornet (Corned Beef)', price: 5000, emoji: '🥩' },
    { id: 'top-3', name: 'Keju (Cheese)', price: 4000, emoji: '🧀' },
    { id: 'top-4', name: 'Sawi (Mustard Greens)', price: 2000, emoji: '🥬' },
    { id: 'top-5', name: 'Sosis (Sausage)', price: 4000, emoji: '🌭' },
    { id: 'top-6', name: 'Ayam Suwir (Shredded Chicken)', price: 6000, emoji: '🍗' },
    { id: 'top-7', name: 'Bakso (Meatball)', price: 4000, emoji: '🍡' },
    { id: 'top-8', name: 'Tahu (Tofu)', price: 3000, emoji: '🧊' },
]

export const menuItems: MenuItem[] = [
    // Noodles
    { id: 'n-1', name: 'Indomie Goreng', category: 'noodles', price: 8000, description: 'Mi goreng klasik favorit semua orang', emoji: '🍜', isPopular: true },
    { id: 'n-2', name: 'Indomie Soto', category: 'noodles', price: 8000, description: 'Kuah soto gurih khas Nusantara', emoji: '🍲', isPopular: true },
    { id: 'n-3', name: 'Indomie Kuah', category: 'noodles', price: 7000, description: 'Mi kuah kaldu ayam hangat', emoji: '🥣' },
    { id: 'n-4', name: 'Indomie Rendang', category: 'noodles', price: 9000, description: 'Bumbu rendang pedas aromatik', emoji: '🌶️' },
    { id: 'n-5', name: 'Indomie Ayam Bawang', category: 'noodles', price: 8000, description: 'Cita rasa ayam bawang gurih', emoji: '🧅' },
    { id: 'n-6', name: 'Indomie Kari Ayam', category: 'noodles', price: 9000, description: 'Kari ayam kental dan harum', emoji: '🍛', isPopular: true },
    { id: 'n-7', name: 'Mie Sedaap Goreng', category: 'noodles', price: 7500, description: 'Alternatif mi goreng kriuk', emoji: '🍝' },
    { id: 'n-8', name: 'Mie Sedaap Soto', category: 'noodles', price: 7500, description: 'Soto mi yang bikin nagih', emoji: '🥘' },
    {
        id: 'n-9',
        name: 'Mie Nyemek',
        category: 'noodles',
        price: 12000,
        description: 'Mi nyemek spesial dengan kuah kental dan bumbu rahasia',
        emoji: '🥘',
        variants: ['Soto', 'Goreng', 'Rendang'],
    },

    // Drinks
    { id: 'd-1', name: 'Es Teh Manis', category: 'drinks', price: 5000, description: 'Teh manis dingin segar', emoji: '🧊' },
    { id: 'd-2', name: 'Es Jeruk', category: 'drinks', price: 6000, description: 'Jus jeruk segar dengan es', emoji: '🍊' },
    { id: 'd-3', name: 'Kopi Hitam', category: 'drinks', price: 5000, description: 'Kopi tubruk hitam pekat', emoji: '☕' },
    { id: 'd-4', name: 'Kopi Susu', category: 'drinks', price: 8000, description: 'Kopi susu creamy kekinian', emoji: '🥛' },
    { id: 'd-5', name: 'Air Mineral', category: 'drinks', price: 3000, description: 'Air mineral kemasan', emoji: '💧' },
    { id: 'd-6', name: 'Es Coklat', category: 'drinks', price: 8000, description: 'Coklat susu dingin premium', emoji: '🍫' },

    // Toppings (standalone)
    { id: 't-1', name: 'Extra Telur', category: 'toppings', price: 3000, description: 'Telur ceplok / rebus', emoji: '🥚' },
    { id: 't-2', name: 'Extra Kornet', category: 'toppings', price: 5000, description: 'Kornet sapi premium', emoji: '🥩' },
    { id: 't-3', name: 'Extra Keju', category: 'toppings', price: 4000, description: 'Keju cheddar leleh', emoji: '🧀' },
    { id: 't-4', name: 'Extra Sosis', category: 'toppings', price: 4000, description: 'Sosis ayam goreng', emoji: '🌭' },
    { id: 't-7', name: 'Extra Bakso', category: 'toppings', price: 4000, description: 'Bakso sapi asli', emoji: '🍡' },
    { id: 't-8', name: 'Extra Tahu', category: 'toppings', price: 3000, description: 'Tahu putih lembut', emoji: '🧊' },
]

export function formatRupiah(amount: number): string {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount)
}
