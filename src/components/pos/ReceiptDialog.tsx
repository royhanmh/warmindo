import {
    Dialog,
    DialogContent,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Printer } from "lucide-react"
import { formatRupiah } from "@/data/menu"
import { type Transaction } from "@/contexts/TransactionContext"
import { useRef } from "react"

interface ReceiptDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    transaction: Transaction | null
}

export function ReceiptDialog({ open, onOpenChange, transaction }: ReceiptDialogProps) {
    const receiptRef = useRef<HTMLDivElement>(null)

    if (!transaction) return null

    const handlePrint = () => {
        if (!receiptRef.current) return

        const printWindow = window.open('', '_blank', 'width=400,height=600')
        if (!printWindow) return

        const receiptHTML = receiptRef.current.innerHTML

        printWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Struk - ${transaction.id}</title>
                <style>
                    * { margin: 0; padding: 0; box-sizing: border-box; }
                    body {
                        font-family: 'Courier New', monospace;
                        font-size: 12px;
                        line-height: 1.4;
                        color: #000;
                        background: #f5f5f5;
                        display: flex;
                        justify-content: center;
                        padding: 24px;
                    }
                    .receipt {
                        background: #fff;
                        width: 72mm;
                        padding: 16px;
                        border: 1px solid #ddd;
                        box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                    }
                    .receipt-header { text-align: center; padding-bottom: 10px; border-bottom: 2px dashed #333; margin-bottom: 10px; }
                    .receipt-header h2 { font-size: 18px; font-weight: bold; text-transform: uppercase; letter-spacing: 2px; }
                    .receipt-header p { font-size: 10px; color: #555; margin-top: 3px; }
                    .receipt-meta { font-size: 11px; padding-bottom: 10px; border-bottom: 2px dashed #333; margin-bottom: 10px; }
                    .receipt-meta .row { display: flex; justify-content: space-between; margin-bottom: 3px; }
                    .receipt-meta .bold { font-weight: bold; text-transform: uppercase; }
                    .receipt-items { padding-bottom: 10px; border-bottom: 2px dashed #333; margin-bottom: 10px; }
                    .receipt-item { margin-bottom: 6px; }
                    .receipt-item .name { font-weight: bold; }
                    .receipt-item .detail { display: flex; justify-content: space-between; padding-left: 10px; font-size: 11px; color: #555; }
                    .receipt-totals { padding-bottom: 10px; border-bottom: 2px dashed #333; margin-bottom: 10px; }
                    .receipt-totals .total-row { display: flex; justify-content: space-between; font-weight: bold; font-size: 15px; margin-bottom: 4px; }
                    .receipt-totals .sub-row { display: flex; justify-content: space-between; font-size: 11px; color: #555; }
                    .receipt-footer { text-align: center; padding-top: 6px; }
                    .receipt-footer .lunas { font-weight: bold; text-transform: uppercase; margin-bottom: 6px; font-size: 13px; }
                    .receipt-footer .thanks { font-size: 10px; color: #555; }
                    .receipt-footer .powered { font-size: 9px; color: #999; margin-top: 6px; }
                    @media print {
                        body { background: #fff; padding: 0; display: flex; justify-content: center; }
                        .receipt { border: none; box-shadow: none; }
                        @page { margin: 10mm; size: A4; }
                    }
                </style>
            </head>
            <body>
                <div class="receipt">
                <div class="receipt-header">
                    <h2>WARMINDO 88</h2>
                    <p>Jl. Contoh No. 123, Jakarta</p>
                    <p>Telp: 0812-3456-7890</p>
                </div>
                <div class="receipt-meta">
                    <div class="row"><span>Tgl:</span><span>${transaction.date} ${transaction.time}</span></div>
                    <div class="row"><span>No:</span><span>${transaction.id}</span></div>
                    <div class="row"><span>Plg:</span><span class="bold">${transaction.customerName}</span></div>
                    <div class="row"><span>Kasir:</span><span>${transaction.cashierName || 'Admin'}</span></div>
                </div>
                <div class="receipt-items">
                    ${transaction.items.map(item => `
                        <div class="receipt-item">
                            <div class="name">${item.name}</div>
                            <div class="detail">
                                <span>${item.quantity} x ${formatRupiah(item.price / item.quantity)}</span>
                                <span>${formatRupiah(item.price)}</span>
                            </div>
                        </div>
                    `).join('')}
                </div>
                <div class="receipt-totals">
                    <div class="total-row"><span>TOTAL</span><span>${formatRupiah(transaction.total)}</span></div>
                    <div class="sub-row"><span>Bayar (${transaction.payment})</span><span>${formatRupiah(transaction.cashPaid || transaction.total)}</span></div>
                    <div class="sub-row"><span>Kembali</span><span>${formatRupiah(transaction.change || 0)}</span></div>
                </div>
                <div class="receipt-footer">
                    <div class="lunas">${transaction.status === 'pending' ? '*** BELUM LUNAS ***' : '*** LUNAS ***'}</div>
                    <div class="thanks">Terima Kasih atas Kunjungan Anda!</div>
                    <div class="powered">Powered by WarmindoPOS</div>
                </div>
                </div>
            </body>
            </html>
        `)

        printWindow.document.close()
        printWindow.focus()

        setTimeout(() => {
            printWindow.print()
            printWindow.close()
        }, 300)
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[380px] p-0 overflow-hidden bg-white gap-0" aria-describedby={undefined}>
                <DialogTitle className="sr-only">Struk Pembayaran</DialogTitle>
                <div ref={receiptRef} className="printable-receipt p-6 space-y-4 bg-white text-gray-900 text-sm font-mono leading-tight max-h-[70vh] overflow-y-auto">
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
                            <span>{formatRupiah(transaction.cashPaid || transaction.total)}</span>
                        </div>
                        <div className="flex justify-between text-xs text-gray-600">
                            <span>Kembali</span>
                            <span>{formatRupiah(transaction.change || 0)}</span>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="text-center space-y-2 pt-2">
                        <p className="font-bold uppercase">
                            {transaction.status === 'pending' ? '*** BELUM LUNAS ***' : '*** LUNAS ***'}
                        </p>
                        <p className="text-xs text-gray-500">Terima Kasih atas Kunjungan Anda!</p>
                        <p className="text-[10px] text-gray-400">Powered by WarmindoPOS</p>
                    </div>
                </div>

                {/* Info / Action - Not Printed */}
                <div className="bg-gray-50 p-4 border-t flex justify-between items-center">
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
