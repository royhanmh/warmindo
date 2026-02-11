import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

import { inventoryData, getStockStatus } from '@/data/inventory'
import { formatRupiah } from '@/data/menu'
import {
    TrendingUp,
    ShoppingBag,
    DollarSign,
    AlertTriangle,
    Flame,
    Clock,
    ChefHat,
    CheckCircle2,
} from 'lucide-react'

const mockDashData = {
    todaySales: 2450000,
    todayOrders: 47,
    avgOrderValue: 52128,
    bestSellers: [
        { name: 'Indomie Goreng + Telur', count: 23, emoji: '🍜' },
        { name: 'Indomie Soto + Kornet', count: 18, emoji: '🍲' },
        { name: 'Es Teh Manis', count: 35, emoji: '🧊' },
        { name: 'Kopi Susu', count: 14, emoji: '🥛' },
    ],
    activeOrders: [
        { id: '#047', items: 'Goreng + Telur, Es Teh', status: 'cooking', time: '2 min' },
        { id: '#046', items: 'Soto + Keju, Kopi Susu', status: 'pending', time: '4 min' },
        { id: '#045', items: 'Rendang + Kornet x2', status: 'served', time: '1 min' },
    ],
}

const statusConfig = {
    pending: { label: 'Pending', color: 'bg-accent text-accent-foreground', icon: Clock },
    cooking: { label: 'Cooking', color: 'bg-primary text-white', icon: ChefHat },
    served: { label: 'Served', color: 'bg-success text-white', icon: CheckCircle2 },
}

export function DashboardPage() {
    const lowStockItems = inventoryData.filter(i => getStockStatus(i) !== 'in-stock')

    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.08 },
        },
    }

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 },
    }

    return (
        <div className="p-6">
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
                <h1 className="font-heading text-2xl font-bold text-gray-900">
                    📊 Dashboard
                </h1>
                <p className="text-muted-foreground text-sm mt-1">
                    Ringkasan harian — {new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
            </motion.div>

            {/* Stats Grid */}
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6"
            >
                <motion.div variants={itemVariants}>
                    <Card className="border-l-4 border-l-success">
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs text-muted-foreground uppercase tracking-wider">Penjualan Hari Ini</p>
                                    <p className="text-2xl font-heading font-bold mt-1">{formatRupiah(mockDashData.todaySales)}</p>
                                </div>
                                <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center">
                                    <DollarSign className="w-6 h-6 text-success" />
                                </div>
                            </div>
                            <div className="flex items-center gap-1 mt-2 text-success text-xs font-medium">
                                <TrendingUp className="w-3 h-3" />
                                +12% dari kemarin
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                <motion.div variants={itemVariants}>
                    <Card className="border-l-4 border-l-primary">
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs text-muted-foreground uppercase tracking-wider">Total Pesanan</p>
                                    <p className="text-2xl font-heading font-bold mt-1">{mockDashData.todayOrders}</p>
                                </div>
                                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                                    <ShoppingBag className="w-6 h-6 text-primary" />
                                </div>
                            </div>
                            <p className="text-xs text-muted-foreground mt-2">
                                Rata-rata {formatRupiah(mockDashData.avgOrderValue)} / order
                            </p>
                        </CardContent>
                    </Card>
                </motion.div>

                <motion.div variants={itemVariants}>
                    <Card className="border-l-4 border-l-accent">
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs text-muted-foreground uppercase tracking-wider">Low Stock Alert</p>
                                    <p className="text-2xl font-heading font-bold mt-1 text-accent-600">{lowStockItems.length}</p>
                                </div>
                                <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center">
                                    <AlertTriangle className="w-6 h-6 text-accent-600" />
                                </div>
                            </div>
                            <p className="text-xs text-muted-foreground mt-2">
                                Items perlu restock
                            </p>
                        </CardContent>
                    </Card>
                </motion.div>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                {/* Best Sellers */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="flex items-center gap-2 text-base">
                                <Flame className="w-5 h-5 text-primary" />
                                Menu Terlaris
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {mockDashData.bestSellers.map((item, i) => (
                                    <div key={i} className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <span className="text-sm font-bold text-muted-foreground w-5">#{i + 1}</span>
                                            <span className="text-xl">{item.emoji}</span>
                                            <span className="text-sm font-medium">{item.name}</span>
                                        </div>
                                        <Badge variant="secondary">{item.count}x</Badge>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Active Orders */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                >
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="flex items-center gap-2 text-base">
                                <Clock className="w-5 h-5 text-accent-600" />
                                Order Aktif
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {mockDashData.activeOrders.map((order) => {
                                    const config = statusConfig[order.status as keyof typeof statusConfig]
                                    const StatusIcon = config.icon
                                    return (
                                        <div key={order.id} className="flex items-center justify-between p-2 rounded-lg bg-gray-50">
                                            <div className="flex items-center gap-3">
                                                <span className="font-heading font-bold text-sm">{order.id}</span>
                                                <span className="text-xs text-muted-foreground">{order.items}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs text-muted-foreground">{order.time}</span>
                                                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${config.color}`}>
                                                    <StatusIcon className="w-3 h-3" />
                                                    {config.label}
                                                </span>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>

            {/* Low Stock Alerts */}
            {lowStockItems.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="mt-6"
                >
                    <Card className="border-accent/50">
                        <CardHeader className="pb-3">
                            <CardTitle className="flex items-center gap-2 text-base text-accent-600">
                                <AlertTriangle className="w-5 h-5" />
                                Low Stock Alerts
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                {lowStockItems.map((item) => (
                                    <div key={item.id} className="flex items-center justify-between p-2 rounded-lg bg-accent/5 border border-accent/20">
                                        <span className="text-sm font-medium">{item.name}</span>
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm font-heading font-bold text-accent-600">
                                                {item.stock} {item.unit}
                                            </span>
                                            <Badge variant={item.stock === 0 ? 'destructive' : 'warning'} className="text-[10px]">
                                                {item.stock === 0 ? 'HABIS' : 'LOW'}
                                            </Badge>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            )}
        </div>
    )
}
