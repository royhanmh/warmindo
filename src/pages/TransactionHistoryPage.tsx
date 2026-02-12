import { useState, useMemo, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
    DrawerDescription,
    DrawerFooter,
    DrawerClose,
} from '@/components/ui/drawer'
import { formatRupiah, menuItems, toppings } from '@/data/menu'
import { Search, RotateCcw, Printer, Receipt, CheckCircle2, ArrowLeftRight, User, Clock, Banknote, QrCode, ChevronLeft } from 'lucide-react'
import { type Transaction, useTransactions } from '@/contexts/TransactionContext'
import { ReceiptDialog } from '@/components/pos/ReceiptDialog'

type ClosePayStep = 'select' | 'cash-input' | 'qr-display' | 'success'

export function TransactionHistoryPage() {
    const { transactions, updateTransaction } = useTransactions()
    const [search, setSearch] = useState('')
    const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null)

    // Close Bill drawer state
    const [closingBill, setClosingBill] = useState<Transaction | null>(null)
    const [closePayStep, setClosePayStep] = useState<ClosePayStep>('select')
    const [cashInput, setCashInput] = useState('')

    const [cashChange, setCashChange] = useState(0)
    const [closeMethod, setCloseMethod] = useState('')

    const filtered = transactions.filter(t =>
        t.id.toLowerCase().includes(search.toLowerCase()) ||
        t.customerName.toLowerCase().includes(search.toLowerCase()) ||
        t.items.map(i => i.name).join(' ').toLowerCase().includes(search.toLowerCase())
    )

    const totalRevenue = transactions
        .filter(t => t.status === 'completed')
        .reduce((sum, t) => sum + t.total, 0)

    const getItemEmoji = (itemName: string) => {
        const menuItem = menuItems.find(m => itemName.startsWith(m.name))
        if (menuItem) return menuItem.emoji
        const topping = toppings.find(t => itemName.startsWith(t.name))
        if (topping) return topping.emoji
        return '🍜'
    }

    const handleCloseBill = (txn: Transaction) => {
        setClosingBill(txn)
        setClosePayStep('select')
        setCashInput('')
        setCashChange(0)
        setCloseMethod('')
    }

    const handleCloseSelectMethod = (method: string) => {
        setCloseMethod(method)
        if (method === 'Cash') {
            setCashInput('')
            setCashChange(0)
            setClosePayStep('cash-input')
        } else {
            // QRIS - close immediately
            if (closingBill) {
                updateTransaction(closingBill.id, { status: 'completed', payment: 'QRIS' })
            }
            setClosePayStep('success')
        }
    }

    const handleCloseCashConfirm = () => {
        if (!closingBill) return
        const paid = parseInt(cashInput)
        if (isNaN(paid) || paid < closingBill.total) return
        const change = paid - closingBill.total
        setCashChange(change)
        updateTransaction(closingBill.id, {
            status: 'completed',
            payment: 'Cash',
            cashPaid: paid,
            change: change,
        })
        setClosePayStep('success')
    }

    const handleCloseDrawerDone = () => {
        setClosingBill(null)
        setClosePayStep('select')
    }

    const getQuickAmounts = (total: number) => {
        const amounts = [total]
        const rounded = [20000, 50000, 100000, 150000, 200000]
        for (const r of rounded) {
            if (r > total && !amounts.includes(r)) amounts.push(r)
            if (amounts.length >= 4) break
        }
        return amounts.sort((a, b) => a - b)
    }

    return (
        <div className="p-4 md:p-6">
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

            {/* Summary Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                    <Card className="border-l-4 border-l-success shadow-sm">
                        <CardContent className="p-4 flex items-center justify-between">
                            <div>
                                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Total Revenue</p>
                                <p className="text-xl font-heading font-bold text-success">{formatRupiah(totalRevenue)}</p>
                            </div>
                            <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center">
                                <Banknote className="w-6 h-6 text-success" />
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
                    <Card className="border-l-4 border-l-primary shadow-sm">
                        <CardContent className="p-4 flex items-center justify-between">
                            <div>
                                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Transactions</p>
                                <p className="text-xl font-heading font-bold">{transactions.length}</p>
                            </div>
                            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                                <Receipt className="w-6 h-6 text-primary" />
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {transactions.filter(t => t.status === 'pending').length > 0 && (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                        <Card className="border-l-4 border-l-amber-500 shadow-sm">
                            <CardContent className="p-4 flex items-center justify-between">
                                <div>
                                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Open Bill</p>
                                    <p className="text-xl font-heading font-bold text-amber-500">
                                        {transactions.filter(t => t.status === 'pending').length}
                                    </p>
                                </div>
                                <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center">
                                    <Clock className="w-6 h-6 text-amber-600" />
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                )}
            </div>

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

            {/* Desktop Table View */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="hidden lg:block bg-white rounded-xl border overflow-hidden"
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
                                        {txn.items.map(i => `${i.name}${i.note ? ` (${i.note})` : ''} (x${i.quantity})`).join(', ')}
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
                                        ) : txn.status === 'pending' ? (
                                            <Badge variant="outline" className="gap-1.5 pl-2 pr-2.5 py-1 border-amber-300 bg-amber-50 text-amber-700">
                                                <Clock className="w-3.5 h-3.5" />
                                                <span>Open Bill</span>
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
                                            {txn.status === 'pending' && (
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-8 gap-1 px-2 text-xs text-success hover:text-success hover:bg-success/10"
                                                    onClick={() => handleCloseBill(txn)}
                                                >
                                                    <Banknote className="w-3.5 h-3.5" />
                                                    Close Bill
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

            {/* Mobile Card View */}
            <div className="lg:hidden grid grid-cols-1 md:grid-cols-2 gap-4">
                {filtered.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground bg-white rounded-xl border p-4 col-span-full">
                        Tidak ada transaksi ditemukan
                    </div>
                ) : (
                    filtered.map((txn, index) => (
                        <motion.div
                            key={txn.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.03 }}
                            className="bg-white rounded-xl border p-4 shadow-sm"
                        >
                            <div className="flex justify-between items-start mb-3">
                                <div>
                                    <div className="flex items-center gap-2">
                                        <span className="font-heading font-bold text-sm">{txn.id}</span>
                                        <span className="text-xs text-muted-foreground">• {txn.time}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 mt-1">
                                        <User className="w-3.5 h-3.5 text-muted-foreground" />
                                        <span className="text-sm font-medium">{txn.customerName}</span>
                                    </div>
                                </div>
                                <div>
                                    {txn.status === 'completed' ? (
                                        <Badge variant="success" className="gap-1 px-2 py-0.5 text-[10px]">
                                            <CheckCircle2 className="w-3 h-3" />
                                            Selesai
                                        </Badge>
                                    ) : txn.status === 'pending' ? (
                                        <Badge variant="outline" className="gap-1 px-2 py-0.5 text-[10px] border-amber-300 bg-amber-50 text-amber-700">
                                            <Clock className="w-3 h-3" />
                                            Open Bill
                                        </Badge>
                                    ) : (
                                        <Badge variant="destructive" className="gap-1 px-2 py-0.5 text-[10px]">
                                            Refund
                                        </Badge>
                                    )}
                                </div>
                            </div>

                            <div className="py-2 border-t border-b border-dashed my-2">
                                <details className="group">
                                    <summary className="flex items-center justify-between cursor-pointer list-none text-sm font-medium text-gray-700">
                                        <span className="flex items-center gap-2">
                                            <Receipt className="w-3.5 h-3.5 text-muted-foreground" />
                                            {txn.items.length} Items
                                        </span>
                                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                            Lihat detail
                                            <ChevronLeft className="w-4 h-4 transition-transform -rotate-90 group-open:rotate-90" />
                                        </div>
                                    </summary>
                                    <div className="mt-2 space-y-1.5 pl-1">
                                        {txn.items.map((item, i) => (
                                            <div key={i} className="flex justify-between text-xs">
                                                <span className="text-muted-foreground">
                                                    {getItemEmoji(item.name)} {item.name} x{item.quantity}
                                                    {item.note && <span className="block text-[10px] italic text-gray-500 pl-4">{item.note}</span>}
                                                </span>
                                                <span className="font-medium">{formatRupiah(item.price * item.quantity)}</span>
                                            </div>
                                        ))}
                                    </div>
                                </details>
                            </div>

                            <div className="flex items-center justify-between mt-3">
                                <div>
                                    <p className="text-xs text-muted-foreground">Total</p>
                                    <p className="font-heading font-bold text-lg text-primary">{formatRupiah(txn.total)}</p>
                                </div>
                                <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="h-8 w-8 p-0"
                                        onClick={() => setSelectedTransaction(txn)}
                                    >
                                        <Printer className="w-4 h-4" />
                                    </Button>
                                    {txn.status === 'pending' && (
                                        <Button
                                            size="sm"
                                            className="h-8 gap-1.5 px-3 text-xs bg-success/10 text-success hover:bg-success hover:text-white border border-success/20"
                                            onClick={() => handleCloseBill(txn)}
                                        >
                                            <Banknote className="w-3.5 h-3.5" />
                                            Bayar
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    ))
                )}
            </div>

            {/* Close Bill Payment Drawer */}
            <Drawer open={!!closingBill} onOpenChange={(open) => !open && handleCloseDrawerDone()}>
                <DrawerContent>
                    <AnimatePresence mode="wait">
                        {closePayStep === 'select' && closingBill && (
                            <motion.div
                                key="select"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.2 }}
                            >
                                <DrawerHeader className="text-left">
                                    <DrawerTitle className="text-xl">💰 Close Bill — {closingBill.id}</DrawerTitle>
                                    <DrawerDescription>
                                        {closingBill.customerName} · {formatRupiah(closingBill.total)}
                                    </DrawerDescription>
                                </DrawerHeader>

                                {/* Payment Method Selection */}
                                <div className="px-4 pb-2 space-y-2">
                                    <div className="grid grid-cols-2 gap-3">
                                        <motion.button
                                            whileHover={{ scale: 1.03 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => handleCloseSelectMethod('QRIS')}
                                            className="flex flex-col items-center gap-3 p-6 rounded-xl border-2 border-gray-100 bg-gray-50/50 hover:border-primary hover:bg-primary/5 transition-all duration-200 group"
                                        >
                                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:shadow-blue-500/40 transition-shadow">
                                                <QrCode className="w-8 h-8 text-white" />
                                            </div>
                                            <div className="text-center">
                                                <p className="font-heading font-bold text-base">QRIS</p>
                                            </div>
                                        </motion.button>
                                        <motion.button
                                            whileHover={{ scale: 1.03 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => handleCloseSelectMethod('Cash')}
                                            className="flex flex-col items-center gap-3 p-6 rounded-xl border-2 border-gray-100 bg-gray-50/50 hover:border-success hover:bg-success/5 transition-all duration-200 group"
                                        >
                                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center shadow-lg shadow-green-500/20 group-hover:shadow-green-500/40 transition-shadow">
                                                <Banknote className="w-8 h-8 text-white" />
                                            </div>
                                            <div className="text-center">
                                                <p className="font-heading font-bold text-base">Cash</p>
                                            </div>
                                        </motion.button>
                                    </div>
                                </div>

                                {/* Ringkasan Pesanan */}
                                <div className="px-4 py-3">
                                    <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-1">
                                        <Receipt className="w-3.5 h-3.5" />
                                        Ringkasan Pesanan
                                    </div>
                                    <div className="bg-gray-50 rounded-xl p-3 space-y-1.5">
                                        {closingBill.items.map((item, i) => (
                                            <div key={i} className="flex justify-between text-sm">
                                                <span className="text-muted-foreground">
                                                    {getItemEmoji(item.name)} {item.name} x{item.quantity}
                                                </span>
                                                <span className="font-medium">{formatRupiah(item.price * item.quantity)}</span>
                                            </div>
                                        ))}
                                        <div className="border-t pt-2 mt-2 flex justify-between font-heading font-bold">
                                            <span>Total</span>
                                            <span className="text-primary">{formatRupiah(closingBill.total)}</span>
                                        </div>
                                    </div>
                                </div>

                                <DrawerFooter>
                                    <DrawerClose asChild>
                                        <Button variant="outline" className="w-full">Batal</Button>
                                    </DrawerClose>
                                </DrawerFooter>
                            </motion.div>
                        )}

                        {closePayStep === 'cash-input' && closingBill && (
                            <motion.div
                                key="cash-input"
                                initial={{ opacity: 0, x: 40 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -40 }}
                                transition={{ duration: 0.25 }}
                                className="flex flex-col max-h-[85vh]"
                            >
                                <DrawerHeader className="text-left">
                                    <div className="flex items-center gap-2">
                                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => setClosePayStep('select')}>
                                            <ChevronLeft className="w-4 h-4" />
                                        </Button>
                                        <div>
                                            <DrawerTitle className="text-lg">💵 Pembayaran Cash</DrawerTitle>
                                            <DrawerDescription>
                                                Silahkan masukkan nominal pembayaran
                                            </DrawerDescription>
                                        </div>
                                    </div>
                                </DrawerHeader>

                                <div className="px-4 space-y-4 pb-4 flex-1 overflow-y-auto">
                                    {/* Status Display - Top */}
                                    <div className="grid grid-cols-2 gap-3 mb-4">
                                        <div className="bg-orange-50 border border-orange-200 rounded-xl p-3 text-center">
                                            <p className="text-xs text-orange-700/80 font-medium mb-1">Total Tagihan</p>
                                            <p className="font-heading font-bold text-xl text-orange-700">{formatRupiah(closingBill.total)}</p>
                                        </div>
                                        <div className={`border rounded-xl p-3 text-center ${cashInput && parseInt(cashInput) >= closingBill.total ? 'bg-emerald-50 border-emerald-200' : 'bg-gray-50 border-gray-200'}`}>
                                            <p className={`text-xs font-medium mb-1 ${cashInput && parseInt(cashInput) >= closingBill.total ? 'text-emerald-700/80' : 'text-gray-500'}`}>Kembalian</p>
                                            <p className={`font-heading font-bold text-xl ${cashInput && parseInt(cashInput) >= closingBill.total ? 'text-emerald-700' : 'text-gray-400'}`}>
                                                {cashInput && parseInt(cashInput) >= closingBill.total ? formatRupiah(parseInt(cashInput) - closingBill.total) : '-'}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="close-cash-input" className="text-sm font-medium">Jumlah Uang Pelanggan</Label>
                                        <Input
                                            id="close-cash-input"
                                            type="number"
                                            placeholder="Masukkan jumlah..."
                                            value={cashInput}
                                            onChange={(e) => {
                                                setCashInput(e.target.value)
                                                const val = parseInt(e.target.value)
                                                if (!isNaN(val)) setCashChange(val - closingBill.total)
                                            }}
                                            className="text-lg font-bold h-12 text-center bg-gray-50"
                                            onKeyDown={(e) => { if (e.key === 'Enter') (e.target as HTMLInputElement).blur() }}
                                        />
                                    </div>

                                    {/* Quick Amounts */}
                                    <div className="grid grid-cols-2 gap-2">
                                        {getQuickAmounts(closingBill.total).map((amount) => (
                                            <Button
                                                key={amount}
                                                variant="outline"
                                                size="sm"
                                                className={`font-heading font-bold ${amount === closingBill.total ? 'border-primary text-primary' : ''}`}
                                                onClick={() => {
                                                    (document.activeElement as HTMLElement)?.blur()
                                                    setCashInput(amount.toString())
                                                    setCashChange(amount - closingBill.total)
                                                }}
                                            >
                                                {amount === closingBill.total ? 'Uang Pas' : formatRupiah(amount)}
                                            </Button>
                                        ))}
                                    </div>


                                </div>

                                <DrawerFooter>
                                    <Button
                                        size="lg"
                                        className="w-full gap-2 shadow-lg shadow-primary/20"
                                        disabled={!cashInput || parseInt(cashInput) < closingBill.total}
                                        onClick={handleCloseCashConfirm}
                                    >
                                        <CheckCircle2 className="w-5 h-5" />
                                        Konfirmasi Pembayaran
                                    </Button>
                                    <Button variant="ghost" size="sm" className="w-full" onClick={() => setClosePayStep('select')}>
                                        Kembali
                                    </Button>
                                </DrawerFooter>
                            </motion.div>
                        )}

                        {closePayStep === 'success' && closingBill && (
                            <motion.div
                                key="success"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.35 }}
                                className="flex flex-col items-center justify-center py-10 px-6"
                            >
                                <motion.div
                                    initial={{ scale: 0.5, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ type: 'spring', stiffness: 200, damping: 18, delay: 0.1 }}
                                    className="w-20 h-20 rounded-full bg-success/10 flex items-center justify-center mb-4"
                                >
                                    <CheckCircle2 className="w-10 h-10 text-success" />
                                </motion.div>
                                <h3 className="font-heading font-bold text-xl text-gray-900">Bill Closed!</h3>
                                <div className="mt-2 text-center text-sm mb-6">
                                    <p className="text-muted-foreground mb-1">
                                        {closingBill.customerName} — {closingBill.id}
                                    </p>
                                    <p className="text-muted-foreground">
                                        via <span className="font-semibold text-foreground">{closeMethod}</span> — {formatRupiah(closingBill.total)}
                                    </p>
                                    {cashChange > 0 && (
                                        <div className="mt-3 bg-gray-50 rounded-lg p-3 space-y-1">
                                            <div className="flex justify-between text-xs">
                                                <span className="text-muted-foreground">Dibayar</span>
                                                <span className="font-semibold">{formatRupiah(parseInt(cashInput))}</span>
                                            </div>
                                            <div className="flex justify-between text-xs">
                                                <span className="text-muted-foreground">Kembalian</span>
                                                <span className="font-semibold text-success">{formatRupiah(cashChange)}</span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <Button className="w-full" onClick={handleCloseDrawerDone}>
                                    Selesai
                                </Button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </DrawerContent>
            </Drawer>
        </div>
    )
}
