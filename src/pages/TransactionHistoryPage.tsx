import { useState } from 'react'
import { motion } from 'framer-motion'
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { formatRupiah } from '@/data/menu'
import { Search, RotateCcw, Printer, Receipt, CheckCircle2, ArrowLeftRight, User } from 'lucide-react'
import { type Transaction, useTransactions } from '@/contexts/TransactionContext'
import { ReceiptDialog } from '@/components/pos/ReceiptDialog'

export function TransactionHistoryPage() {
    const { transactions } = useTransactions()
    const [search, setSearch] = useState('')
    const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null)

    const filtered = transactions.filter(t =>
        t.id.toLowerCase().includes(search.toLowerCase()) ||
        t.customerName.toLowerCase().includes(search.toLowerCase()) ||
        t.items.map(i => i.name).join(' ').toLowerCase().includes(search.toLowerCase())
    )

    const totalRevenue = transactions
        .filter(t => t.status === 'completed')
        .reduce((sum, t) => sum + t.total, 0)

    return (
        <div className="p-6">
            <ReceiptDialog
                open={!!selectedTransaction}
                onOpenChange={(open) => !open && setSelectedTransaction(null)}
                transaction={selectedTransaction}
            />

            {/* Header */}
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
                <h1 className="font-heading text-2xl font-bold text-gray-900">
                    🧾 Riwayat Transaksi
                </h1>
                <p className="text-muted-foreground text-sm mt-1">
                    Lihat semua transaksi yang telah dilakukan
                </p>
            </motion.div>

            {/* Summary Bar */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="flex items-center justify-between bg-white rounded-xl border p-4 mb-6"
            >
                <div className="flex items-center gap-6">
                    <div>
                        <p className="text-xs text-muted-foreground uppercase tracking-wider">Total Revenue</p>
                        <p className="text-xl font-heading font-bold text-success">{formatRupiah(totalRevenue)}</p>
                    </div>
                    <div className="h-8 w-px bg-gray-200" />
                    <div>
                        <p className="text-xs text-muted-foreground uppercase tracking-wider">Transactions</p>
                        <p className="text-xl font-heading font-bold">{transactions.length}</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Receipt className="w-5 h-5 text-muted-foreground" />
                </div>
            </motion.div>

            {/* Search */}
            <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                    placeholder="Cari transaksi (ID, Pelanggan, atau Item)..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-10 bg-white"
                />
            </div>

            {/* Table */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-xl border overflow-hidden"
            >
                <Table>
                    <TableHeader>
                        <TableRow className="bg-gray-50">
                            <TableHead>Order ID</TableHead>
                            <TableHead>Tanggal</TableHead>
                            <TableHead>Pelanggan</TableHead>
                            <TableHead>Items</TableHead>
                            <TableHead className="text-right">Total</TableHead>
                            <TableHead>Pembayaran</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Aksi</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filtered.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                                    Tidak ada transaksi ditemukan
                                </TableCell>
                            </TableRow>
                        ) : (
                            filtered.map((txn, index) => (
                                <motion.tr
                                    key={txn.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.03 }}
                                    className="border-b transition-colors hover:bg-muted/50"
                                >
                                    <TableCell className="font-heading font-bold text-sm">{txn.id}</TableCell>
                                    <TableCell className="text-muted-foreground text-sm">
                                        {txn.date} <span className="text-xs opacity-70 block">{txn.time}</span>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                                <User className="w-3 h-3" />
                                            </div>
                                            <span className="font-medium text-sm">{txn.customerName}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-sm max-w-[200px] truncate text-muted-foreground">
                                        {txn.items.map(i => `${i.name} (x${i.quantity})`).join(', ')}
                                    </TableCell>
                                    <TableCell className="text-right font-heading font-bold">
                                        {formatRupiah(txn.total)}
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="secondary" className="text-xs">{txn.payment}</Badge>
                                    </TableCell>
                                    <TableCell>
                                        {txn.status === 'completed' ? (
                                            <Badge variant="success" className="gap-1.5 pl-2 pr-2.5 py-1">
                                                <CheckCircle2 className="w-3.5 h-3.5" />
                                                <span>Selesai</span>
                                            </Badge>
                                        ) : (
                                            <Badge variant="destructive" className="gap-1.5 pl-2 pr-2.5 py-1">
                                                <ArrowLeftRight className="w-3.5 h-3.5" />
                                                <span>Refund</span>
                                            </Badge>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex items-center justify-end gap-1">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-8 w-8 p-0"
                                                onClick={() => setSelectedTransaction(txn)}
                                            >
                                                <Printer className="w-4 h-4" />
                                            </Button>
                                            {txn.status === 'completed' && (
                                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-muted-foreground hover:text-primary">
                                                    <RotateCcw className="w-4 h-4" />
                                                </Button>
                                            )}
                                        </div>
                                    </TableCell>
                                </motion.tr>
                            ))
                        )}
                    </TableBody>
                </Table>
            </motion.div>
        </div>
    )
}
