import {
    Dialog,
    DialogContent,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Printer } from "lucide-react"
import { formatRupiah } from "@/data/menu"
import { type Transaction } from "@/contexts/TransactionContext"

interface ReceiptDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    transaction: Transaction | null
}

export function ReceiptDialog({ open, onOpenChange, transaction }: ReceiptDialogProps) {
    if (!transaction) return null

    const handlePrint = () => {
        // Create a hidden iframe or new window for printing could be better, 
        // but for simplicity, we'll rely on user browser print feature or 
        // future 'react-to-print' implementation if needed. 
        // For now, let's just trigger window.print() and assume global CSS handles it 
        // OR just show the dialog and let them screenshot/print.
        window.print()
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[380px] p-0 overflow-hidden bg-white gap-0">
                <div className="printable-receipt p-6 space-y-4 bg-white text-gray-900 text-sm font-mono leading-tight">
                    {/* Header */}
                    <div className="text-center space-y-1 pb-4 border-b-2 border-dashed border-gray-200">
                        <h2 className="text-xl font-bold uppercase tracking-wider">WARMINDO 88</h2>
                        <p className="text-xs text-gray-500">Jl. Contoh No. 123, Jakarta</p>
                        <p className="text-xs text-gray-500">Telp: 0812-3456-7890</p>
                    </div>

                    {/* Meta Info */}
                    <div className="flex flex-col gap-1 text-xs text-gray-600 pb-4 border-b-2 border-dashed border-gray-200">
                        <div className="flex justify-between">
                            <span>Tgl:</span>
                            <span>{transaction.date} {transaction.time}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>No:</span>
                            <span>{transaction.id}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Plg:</span>
                            <span className="font-bold uppercase">{transaction.customerName}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Kasir:</span>
                            <span>{transaction.cashierName || 'Admin'}</span>
                        </div>
                    </div>

                    {/* Items */}
                    <div className="space-y-2 pb-4 border-b-2 border-dashed border-gray-200 min-h-[100px]">
                        {transaction.items.map((item, index) => (
                            <div key={index} className="flex flex-col">
                                <span className="font-bold">{item.name}</span>
                                <div className="flex justify-between pl-2 text-xs text-gray-600">
                                    <span>{item.quantity} x {formatRupiah(item.price / item.quantity)}</span>
                                    <span>{formatRupiah(item.price)}</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Totals */}
                    <div className="space-y-1 pb-4 border-b-2 border-dashed border-gray-200">
                        <div className="flex justify-between font-bold text-base">
                            <span>TOTAL</span>
                            <span>{formatRupiah(transaction.total)}</span>
                        </div>
                        <div className="flex justify-between text-xs text-gray-600">
                            <span>Bayar ({transaction.payment})</span>
                            <span>{formatRupiah(transaction.total)}</span>
                        </div>
                        <div className="flex justify-between text-xs text-gray-600">
                            <span>Kembali</span>
                            <span>{formatRupiah(0)}</span>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="text-center space-y-2 pt-2">
                        <p className="font-bold uppercase">*** LUNAS ***</p>
                        <p className="text-xs text-gray-500">Terima Kasih atas Kunjungan Anda!</p>
                        <p className="text-[10px] text-gray-400">Powered by WarmindoPOS</p>
                    </div>
                </div>

                {/* Info / Action - Not Printed */}
                <div className="bg-gray-50 p-4 border-t flex justify-between items-center print:hidden">
                    <span className="text-xs text-muted-foreground">Thermal 58mm Preview</span>
                    <Button size="sm" onClick={handlePrint} className="gap-2">
                        <Printer className="w-4 h-4" />
                        Cetak Struk
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
