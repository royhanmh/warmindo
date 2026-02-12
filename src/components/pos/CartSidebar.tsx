import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
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
import { useCart } from '@/contexts/CartContext'
import { useTransactions, type Transaction } from '@/contexts/TransactionContext'
import { formatRupiah } from '@/data/menu'
import { ReceiptDialog } from '@/components/pos/ReceiptDialog'
import {
    ShoppingCart,
    Trash2,
    Plus,
    Minus,
    CreditCard,
    ShoppingBag,
    QrCode,
    Banknote,
    CheckCircle2,
    Receipt,
    User,
    AlertCircle,
    Printer,
    Clock,
    ListPlus,
    Pencil,
    X,
    Check
} from 'lucide-react'
import { format } from 'date-fns'

type PaymentStep = 'select' | 'cash-input' | 'success'

export function CartSidebar() {
    const { items, bounceKey, removeItem, updateQuantity, updateNote, clearCart, getTotal, getItemCount, customerName, setCustomerName } = useCart()
    const { addTransaction, transactions, updateTransaction } = useTransactions()
    const [payDrawerOpen, setPayDrawerOpen] = useState(false)
    const [paymentStep, setPaymentStep] = useState<PaymentStep>('select')
    const [selectedMethod, setSelectedMethod] = useState<string | null>(null)
    const [nameError, setNameError] = useState(false)
    const [cashInput, setCashInput] = useState('')
    const [cashChange, setCashChange] = useState(0)
    const [openBillDrawerOpen, setOpenBillDrawerOpen] = useState(false)

    // Note editing state
    const [editingNoteId, setEditingNoteId] = useState<string | null>(null)
    const [noteText, setNoteText] = useState('')

    // Receipt & Auto-close State
    const [lastTransaction, setLastTransaction] = useState<Transaction | null>(null)
    const [showReceipt, setShowReceipt] = useState(false)
    const autoCloseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

    const itemCount = getItemCount()
    const total = getTotal()
    const openBills = transactions.filter(t => t.status === 'pending')

    const handleOpenPayment = () => {
        if (!customerName || customerName.trim() === '') {
            setNameError(true)
            document.getElementById('customer-name')?.focus()
            return
        }
        setPaymentStep('select')
        setSelectedMethod(null)
        setCashInput('')
        setCashChange(0)
        setPayDrawerOpen(true)
    }

    const handleSelectMethod = (method: string) => {
        setSelectedMethod(method)
        if (method === 'Cash') {
            setCashInput('')
            setCashChange(0)
            setPaymentStep('cash-input')
            return
        }
        // For non-cash methods (QRIS), process immediately
        processPayment(method)
    }

    const handleOpenBill = () => {
        if (!customerName || customerName.trim() === '') {
            setNameError(true)
            document.getElementById('customer-name')?.focus()
            return
        }
        addTransaction({
            items: items.map(i => ({
                name: `${i.baseNoodleName} ${i.toppings.length > 0 ? '+' + i.toppings.map(t => t.name).join(' +') : ''}`,
                quantity: i.quantity,
                price: i.totalPrice,
                note: i.note
            })),
            total,
            payment: 'Open Bill',
            status: 'pending',
            customerName,
        })
        clearCart()
    }

    const handleAddToOpenBill = (billId: string) => {
        const bill = transactions.find(t => t.id === billId)
        if (!bill) return
        const newItems = items.map(i => ({
            name: `${i.baseNoodleName} ${i.toppings.length > 0 ? '+' + i.toppings.map(t => t.name).join(' +') : ''}`,
            quantity: i.quantity,
            price: i.totalPrice
        }))
        const addedTotal = items.reduce((sum, i) => sum + i.totalPrice * i.quantity, 0)
        updateTransaction(billId, {
            items: [...bill.items, ...newItems],
            total: bill.total + addedTotal,
        })
        setOpenBillDrawerOpen(false)
        clearCart()
    }

    const handleCashConfirm = () => {
        const paid = parseInt(cashInput)
        if (isNaN(paid) || paid < total) return
        setCashChange(paid - total)
        processPayment('Cash', paid, paid - total)
    }

    const processPayment = (method: string, cashPaid?: number, change?: number, status: 'completed' | 'pending' = 'completed') => {

        const now = new Date()
        const txData = {
            items: items.map(i => ({
                name: `${i.baseNoodleName} ${i.toppings.length > 0 ? '+' + i.toppings.map(t => t.name).join(' +') : ''}`,
                quantity: i.quantity,
                price: i.totalPrice,
                note: i.note
            })),
            total: total,
            payment: method,
            status: status,
            customerName: customerName,
            ...(cashPaid !== undefined && { cashPaid }),
            ...(change !== undefined && { change }),
        }

        // eslint-disable-next-line react-hooks/purity
        const trxId = `TRX-${Date.now().toString().slice(-4)}`

        setLastTransaction({
            id: trxId,
            date: format(now, 'yyyy-MM-dd'),
            time: format(now, 'HH:mm'),
            ...txData
        })

        addTransaction(txData)
        setPaymentStep('success')

        // Restore Auto-Close Logic
        // Clear previous timer if any
        if (autoCloseTimerRef.current) clearTimeout(autoCloseTimerRef.current)

        // Set new timer
        autoCloseTimerRef.current = setTimeout(() => {
            setPayDrawerOpen(false)
            clearCart()
            setPaymentStep('select')
            setSelectedMethod(null)
            setCashInput('')
            setCashChange(0)
        }, 4000) // 4 seconds to view success/print
    }

    const handlePrintClick = () => {
        // Cancel auto-close if user clicks print
        if (autoCloseTimerRef.current) {
            clearTimeout(autoCloseTimerRef.current)
            autoCloseTimerRef.current = null
        }
        setShowReceipt(true)
    }

    const handleManualClose = () => {
        if (autoCloseTimerRef.current) clearTimeout(autoCloseTimerRef.current)
        setPayDrawerOpen(false)
        clearCart()
        setTimeout(() => {
            setPaymentStep('select')
            setSelectedMethod(null)
        }, 300)
    }

    const handleCancelClose = () => {
        if (autoCloseTimerRef.current) clearTimeout(autoCloseTimerRef.current)
        setPayDrawerOpen(false)
        setTimeout(() => {
            setPaymentStep('select')
            setSelectedMethod(null)
            setCashInput('')
            setCashChange(0)
        }, 300)
    }

    const handleDrawerClose = (open: boolean) => {
        if (!open) {
            if (paymentStep === 'success') {
                handleManualClose()
            } else {
                handleCancelClose()
            }
        }
    }

    // Capture drawer close event properly
    useEffect(() => {
        if (!payDrawerOpen) {
            // Ensure timer is cleared if drawer is closed via other means (e.g. dragging)
            if (autoCloseTimerRef.current) clearTimeout(autoCloseTimerRef.current)
        }
    }, [payDrawerOpen])

    return (
        <div className="flex flex-col h-full">
            <ReceiptDialog
                open={showReceipt}
                onOpenChange={setShowReceipt}
                transaction={lastTransaction}
            />

            {/* Header */}
            <div className="p-4 border-b">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <motion.div
                            key={bounceKey}
                            initial={{ scale: 1.15, rotate: -5 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                        >
                            <ShoppingCart className="w-5 h-5 text-primary" />
                        </motion.div>
                        <h2 className="font-heading font-bold text-lg">Keranjang</h2>
                    </div>
                    <motion.div
                        key={itemCount}
                        initial={{ scale: 1.2 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 22 }}
                        className="bg-primary text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center"
                    >
                        {itemCount}
                    </motion.div>
                </div>
            </div>

            {/* Items */}
            <ScrollArea className="flex-1">
                <div className="p-4 space-y-3">
                    <AnimatePresence initial={false}>
                        {items.length === 0 ? (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="flex flex-col items-center justify-center py-12 text-muted-foreground"
                            >
                                <ShoppingBag className="w-16 h-16 mb-3 opacity-20" />
                                <p className="text-sm font-medium">Keranjang kosong</p>
                                <p className="text-xs mt-1">Pilih menu untuk memulai</p>
                            </motion.div>
                        ) : (
                            items.map((item) => (
                                <motion.div
                                    key={item.cartItemId}
                                    initial={{ opacity: 0, x: 30, height: 0 }}
                                    animate={{ opacity: 1, x: 0, height: 'auto' }}
                                    exit={{ opacity: 0, x: -30, height: 0 }}
                                    transition={{ type: 'spring', stiffness: 220, damping: 24, mass: 0.8 }}
                                    layout
                                    className="bg-gray-50 rounded-xl p-3 border border-gray-100"
                                >
                                    <div className="flex items-start gap-3">
                                        <span className="text-2xl">{item.emoji}</span>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-semibold text-sm truncate">{item.baseNoodleName}</h4>
                                            {item.toppings.length > 0 && (
                                                <p className="text-xs text-muted-foreground mt-0.5">
                                                    + {item.toppings.map(t => t.name).join(', ')}
                                                </p>
                                            )}

                                            {/* Note UI */}
                                            <div className="mt-1.5">
                                                {editingNoteId === item.cartItemId ? (
                                                    <div className="flex gap-1.5 items-center">
                                                        <Input
                                                            value={noteText}
                                                            onChange={(e) => setNoteText(e.target.value)}
                                                            placeholder="Catatan..."
                                                            className="h-7 text-xs px-2"
                                                            autoFocus
                                                            onKeyDown={(e) => {
                                                                if (e.key === 'Enter') {
                                                                    updateNote(item.cartItemId, noteText)
                                                                    setEditingNoteId(null)
                                                                }
                                                            }}
                                                        />
                                                        <Button size="icon" className="h-7 w-7 shrink-0 bg-green-500 hover:bg-green-600" onClick={() => {
                                                            updateNote(item.cartItemId, noteText)
                                                            setEditingNoteId(null)
                                                        }}>
                                                            <Check className="w-3.5 h-3.5" />
                                                        </Button>
                                                        <Button size="icon" variant="ghost" className="h-7 w-7 shrink-0 text-red-400 hover:text-red-500 hover:bg-red-50" onClick={() => setEditingNoteId(null)}>
                                                            <X className="w-3.5 h-3.5" />
                                                        </Button>
                                                    </div>
                                                ) : (
                                                    <button
                                                        onClick={() => {
                                                            setEditingNoteId(item.cartItemId)
                                                            setNoteText(item.note || '')
                                                        }}
                                                        className={`text-xs flex items-center gap-1 px-1.5 py-0.5 rounded transition-colors ${item.note ? 'text-amber-600 bg-amber-50 font-medium' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'}`}
                                                    >
                                                        <Pencil className="w-3 h-3" />
                                                        {item.note || 'Tambah Catatan'}
                                                    </button>
                                                )}
                                            </div>

                                            <p className="font-heading font-bold text-primary text-sm mt-1">
                                                {formatRupiah(item.totalPrice)}
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => removeItem(item.cartItemId)}
                                            className="text-gray-400 hover:text-red-500 transition-colors p-1"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>

                                    {/* Quantity Controls */}
                                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-200">
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                                                className="w-7 h-7 rounded-lg bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-100 active:scale-90 transition-all"
                                            >
                                                <Minus className="w-3 h-3" />
                                            </button>
                                            <span className="font-bold text-sm w-6 text-center">{item.quantity}</span>
                                            <button
                                                onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                                                className="w-7 h-7 rounded-lg bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-100 active:scale-90 transition-all"
                                            >
                                                <Plus className="w-3 h-3" />
                                            </button>
                                        </div>
                                        <span className="font-heading font-bold text-sm">
                                            {formatRupiah(item.totalPrice * item.quantity)}
                                        </span>
                                    </div>
                                </motion.div>
                            ))
                        )}
                    </AnimatePresence>
                </div>
            </ScrollArea>

            {/* Footer */}
            {items.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                    className="border-t p-4 space-y-3 bg-white"
                >
                    {/* Customer Input */}
                    <div className="space-y-1.5 mb-2">
                        <Label htmlFor="customer-name" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                            <User className="w-3.5 h-3.5" />
                            Nama Pelanggan <span className="text-red-500">*</span>
                        </Label>
                        <div className="relative">
                            <Input
                                id="customer-name"
                                placeholder="Cth: Meja 5 / Budi"
                                value={customerName}
                                onChange={(e) => {
                                    setCustomerName(e.target.value)
                                    if (e.target.value) setNameError(false)
                                }}
                                className={`bg-gray-50 border-gray-200 focus:bg-white transition-colors font-medium ${nameError ? 'border-red-500 ring-1 ring-red-200' : ''}`}
                            />
                            {nameError && (
                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-red-500">
                                    <AlertCircle className="w-4 h-4" />
                                </span>
                            )}
                        </div>
                        {nameError && <p className="text-xs text-red-500 font-medium">Nama pelanggan wajib diisi!</p>}
                    </div>

                    <Separator />
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span>Subtotal ({itemCount} item)</span>
                        <span>{formatRupiah(total)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="font-heading font-bold text-lg">Total</span>
                        <motion.span
                            key={total}
                            initial={{ scale: 1.06 }}
                            animate={{ scale: 1 }}
                            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                            className="font-heading font-bold text-xl text-primary"
                        >
                            {formatRupiah(total)}
                        </motion.span>
                    </div>
                    <Button
                        size="xl"
                        className="w-full text-lg gap-2 shadow-lg shadow-primary/20"
                        onClick={handleOpenPayment}
                    >
                        <CreditCard className="w-5 h-5" />
                        Bayar — {formatRupiah(total)}
                    </Button>
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            className="flex-1 gap-1.5 border-amber-300 text-amber-700 hover:bg-amber-50 hover:text-amber-800"
                            onClick={handleOpenBill}
                        >
                            <Clock className="w-4 h-4" />
                            Open Bill
                        </Button>
                        {openBills.length > 0 && (
                            <Button
                                variant="outline"
                                size="sm"
                                className="flex-1 gap-1.5 border-blue-300 text-blue-700 hover:bg-blue-50 hover:text-blue-800"
                                onClick={() => setOpenBillDrawerOpen(true)}
                            >
                                <ListPlus className="w-4 h-4" />
                                Tambah ke Bill ({openBills.length})
                            </Button>
                        )}
                    </div>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="w-full text-muted-foreground"
                        onClick={clearCart}
                    >
                        <Trash2 className="w-4 h-4 mr-1" />
                        Kosongkan Keranjang
                    </Button>
                </motion.div>
            )}

            {/* Payment Drawer */}
            <Drawer open={payDrawerOpen} onOpenChange={handleDrawerClose}>
                <DrawerContent>
                    <AnimatePresence mode="wait">
                        {paymentStep === 'select' ? (
                            <motion.div
                                key="select"
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -8 }}
                                transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
                            >
                                <DrawerHeader className="text-left">
                                    <DrawerTitle className="text-xl">Pilih Metode Pembayaran</DrawerTitle>
                                    <DrawerDescription>
                                        Total: <span className="font-heading font-bold text-primary text-lg">{formatRupiah(total)}</span>
                                    </DrawerDescription>
                                </DrawerHeader>

                                <div className="px-4 pb-2 grid grid-cols-2 gap-3">
                                    <motion.button
                                        whileHover={{ scale: 1.03 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => handleSelectMethod('QRIS')}
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
                                        onClick={() => handleSelectMethod('Cash')}
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

                                {/* RESTORED: Order Summary */}
                                <div className="px-4 py-3">
                                    <div className="bg-gray-50 rounded-xl p-3 space-y-1.5">
                                        <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                                            <Receipt className="w-3.5 h-3.5" />
                                            Ringkasan Pesanan
                                        </div>

                                        <div className="flex items-center justify-between text-sm pb-2 border-b border-dashed mb-2">
                                            <span className="text-muted-foreground">Pelanggan</span>
                                            <span className="font-medium">{customerName || '-'}</span>
                                        </div>

                                        {items.map((item) => (
                                            <div key={item.cartItemId} className="flex items-center justify-between text-sm">
                                                <span className="text-muted-foreground">
                                                    {item.emoji} {item.baseNoodleName} x{item.quantity}
                                                </span>
                                                <span className="font-medium">{formatRupiah(item.totalPrice * item.quantity)}</span>
                                            </div>
                                        ))}
                                        <Separator className="my-2" />
                                        <div className="flex items-center justify-between font-heading font-bold">
                                            <span>Total</span>
                                            <span className="text-primary">{formatRupiah(total)}</span>
                                        </div>
                                    </div>
                                </div>

                                <DrawerFooter>
                                    <DrawerClose asChild>
                                        <Button variant="outline" className="w-full">Batal</Button>
                                    </DrawerClose>
                                </DrawerFooter>
                            </motion.div>
                        ) : paymentStep === 'cash-input' ? (
                            <motion.div
                                key="cash-input"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
                                className="flex flex-col max-h-[85vh]"
                            >
                                <DrawerHeader className="text-left">
                                    <DrawerTitle className="text-xl">💵 Pembayaran Cash</DrawerTitle>
                                    <DrawerDescription>
                                        Silahkan masukkan nominal pembayaran
                                    </DrawerDescription>
                                </DrawerHeader>

                                <div className="px-4 pb-4 space-y-4 flex-1 overflow-y-auto">
                                    {/* Status Display - Top */}
                                    <div className="grid grid-cols-2 gap-3 mb-4">
                                        <div className="bg-orange-50 border border-orange-200 rounded-xl p-3 text-center">
                                            <p className="text-xs text-orange-700/80 font-medium mb-1">Total Tagihan</p>
                                            <p className="font-heading font-bold text-xl text-orange-700">{formatRupiah(total)}</p>
                                        </div>
                                        <div className={`border rounded-xl p-3 text-center ${cashInput && parseInt(cashInput) >= total ? 'bg-emerald-50 border-emerald-200' : 'bg-gray-50 border-gray-200'}`}>
                                            <p className={`text-xs font-medium mb-1 ${cashInput && parseInt(cashInput) >= total ? 'text-emerald-700/80' : 'text-gray-500'}`}>Kembalian</p>
                                            <p className={`font-heading font-bold text-xl ${cashInput && parseInt(cashInput) >= total ? 'text-emerald-700' : 'text-gray-400'}`}>
                                                {cashInput && parseInt(cashInput) >= total ? formatRupiah(parseInt(cashInput) - total) : '-'}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-700">Uang Diterima</label>
                                        <Input
                                            type="number"
                                            value={cashInput}
                                            onChange={(e) => setCashInput(e.target.value)}
                                            placeholder="Masukkan jumlah uang..."
                                            className="text-lg h-12 font-heading font-bold"
                                            onKeyDown={(e) => { if (e.key === 'Enter') (e.target as HTMLInputElement).blur() }}
                                        />
                                    </div>

                                    {/* Quick amount buttons */}
                                    <div className="grid grid-cols-3 gap-2">
                                        {[
                                            { label: 'Uang Pas', value: total },
                                            ...[
                                                Math.ceil(total / 5000) * 5000,
                                                Math.ceil(total / 10000) * 10000,
                                                Math.ceil(total / 20000) * 20000,
                                                Math.ceil(total / 50000) * 50000,
                                                100000,
                                            ]
                                                .filter((v, i, arr) => v > total && arr.indexOf(v) === i)
                                                .slice(0, 5)
                                                .map(v => ({ label: formatRupiah(v), value: v }))
                                        ].map(({ label, value }) => (
                                            <Button
                                                key={value}
                                                variant={cashInput === value.toString() ? 'default' : 'outline'}
                                                size="sm"
                                                className="text-xs"
                                                onClick={() => {
                                                    (document.activeElement as HTMLElement)?.blur()
                                                    setCashInput(value.toString())
                                                }}
                                            >
                                                {label}
                                            </Button>
                                        ))}
                                    </div>


                                </div>

                                <DrawerFooter>
                                    <Button
                                        className="w-full"
                                        size="lg"
                                        onClick={handleCashConfirm}
                                        disabled={!cashInput || parseInt(cashInput) < total}
                                    >
                                        Bayar {formatRupiah(total)}
                                    </Button>
                                    <Button variant="outline" className="w-full" onClick={() => setPaymentStep('select')}>
                                        Kembali
                                    </Button>
                                </DrawerFooter>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="success"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
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
                                <motion.h3 className="font-heading font-bold text-xl text-gray-900">
                                    Pembayaran Berhasil!
                                </motion.h3>
                                <div className="mt-2 text-center text-sm mb-6">
                                    <p className="text-muted-foreground mb-1">Pelanggan: <span className="font-semibold text-foreground">{lastTransaction?.customerName}</span></p>
                                    <p className="text-muted-foreground">
                                        via <span className="font-semibold text-foreground">{selectedMethod}</span> — {formatRupiah(total)}
                                    </p>
                                    {lastTransaction?.cashPaid !== undefined && (
                                        <div className="mt-3 bg-gray-50 rounded-lg p-3 space-y-1">
                                            <div className="flex justify-between text-xs">
                                                <span className="text-muted-foreground">Dibayar</span>
                                                <span className="font-semibold">{formatRupiah(lastTransaction.cashPaid)}</span>
                                            </div>
                                            <div className="flex justify-between text-xs">
                                                <span className="text-muted-foreground">Kembalian</span>
                                                <span className="font-bold text-success">{formatRupiah(lastTransaction.change || 0)}</span>
                                            </div>
                                        </div>
                                    )}
                                    <p className="text-xs text-muted-foreground mt-4 animate-pulse">
                                        Menutup otomatis...
                                    </p>
                                </div>

                                <div className="flex flex-col gap-3 w-full">
                                    <Button
                                        className="w-full gap-2 shadow-lg shadow-primary/20"
                                        size="lg"
                                        onClick={handlePrintClick}
                                    >
                                        <Printer className="w-4 h-4" />
                                        Cetak Struk
                                    </Button>
                                    <Button
                                        variant="outline"
                                        className="w-full"
                                        onClick={handleManualClose}
                                    >
                                        Selesai & Tutup
                                    </Button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </DrawerContent>
            </Drawer>

            {/* Open Bill Selection Drawer */}
            <Drawer open={openBillDrawerOpen} onOpenChange={setOpenBillDrawerOpen}>
                <DrawerContent>
                    <DrawerHeader className="text-left">
                        <DrawerTitle className="text-xl">📋 Tambah ke Open Bill</DrawerTitle>
                        <DrawerDescription>
                            Pilih bill yang ingin ditambahkan pesanan
                        </DrawerDescription>
                    </DrawerHeader>
                    <div className="px-4 pb-4 space-y-2 max-h-[50vh] overflow-y-auto">
                        {openBills.map((bill) => (
                            <motion.button
                                key={bill.id}
                                whileHover={{ scale: 1.01 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => handleAddToOpenBill(bill.id)}
                                className="w-full flex items-center justify-between p-4 rounded-xl border-2 border-gray-100 bg-gray-50/50 hover:border-blue-400 hover:bg-blue-50/30 transition-all duration-200 group"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white font-bold text-sm shadow-md">
                                        {bill.id.slice(-3)}
                                    </div>
                                    <div className="text-left">
                                        <p className="font-heading font-bold text-sm">{bill.customerName}</p>
                                        <p className="text-xs text-muted-foreground">
                                            {bill.items.length} item · {bill.time}
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-heading font-bold text-sm text-primary">{formatRupiah(bill.total)}</p>
                                    <p className="text-xs text-blue-600 font-medium group-hover:underline">+ Tambah</p>
                                </div>
                            </motion.button>
                        ))}
                        {openBills.length === 0 && (
                            <div className="text-center py-8 text-muted-foreground text-sm">
                                Tidak ada Open Bill saat ini
                            </div>
                        )}
                    </div>
                    <DrawerFooter>
                        <DrawerClose asChild>
                            <Button variant="outline" className="w-full">Batal</Button>
                        </DrawerClose>
                    </DrawerFooter>
                </DrawerContent>
            </Drawer>
        </div>
    )
}
