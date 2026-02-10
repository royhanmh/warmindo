import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth, type Cashier } from '@/contexts/AuthContext'
import { Plus, Trash2, Pencil, User } from 'lucide-react'
import { ScrollArea } from '@/components/ui/scroll-area'

interface UserSettingsDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function UserSettingsDialog({ open, onOpenChange }: UserSettingsDialogProps) {
    const { cashiers, addCashier, updateCashier, deleteCashier } = useAuth()
    const [mode, setMode] = useState<'list' | 'add' | 'edit'>('list')
    const [editingId, setEditingId] = useState<string | null>(null)
    const [username, setUsername] = useState('')
    const [pin, setPin] = useState('')
    const [error, setError] = useState<string | null>(null)

    const resetForm = () => {
        setUsername('')
        setPin('')
        setEditingId(null)
        setMode('list')
        setError(null)
    }

    const handleAdd = () => {
        if (!username || pin.length < 4) return
        if (username.trim() === pin.trim()) {
            setError('Username dan PIN tidak boleh sama!')
            return
        }
        addCashier(username, pin)
        resetForm()
    }

    const handleEdit = (cashier: Cashier) => {
        setEditingId(cashier.id)
        setUsername(cashier.username)
        setPin(cashier.pin)
        setMode('edit')
        setError(null)
    }

    const handleUpdate = () => {
        if (!username || pin.length < 4 || !editingId) return
        if (username.trim() === pin.trim()) {
            setError('Username dan PIN tidak boleh sama!')
            return
        }
        updateCashier(editingId, username, pin)
        resetForm()
    }

    return (
        <Dialog open={open} onOpenChange={(val) => {
            onOpenChange(val)
            if (!val) resetForm()
        }}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>
                        {mode === 'list' && 'Manajemen Akun Kasir'}
                        {mode === 'add' && 'Tambah Kasir Baru'}
                        {mode === 'edit' && 'Edit Akun Kasir'}
                    </DialogTitle>
                    <DialogDescription>
                        {mode === 'list' && 'Kelola akses untuk kasir.'}
                        {mode === 'add' && 'Buat akun login baru untuk kasir.'}
                        {mode === 'edit' && 'Perbarui username atau PIN kasir.'}
                    </DialogDescription>
                </DialogHeader>

                {mode === 'list' ? (
                    <div className="py-4">
                        <ScrollArea className="h-[300px] pr-4">
                            <div className="space-y-3">
                                {cashiers.map((cashier) => (
                                    <div key={cashier.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-primary">
                                                <User className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <p className="font-bold text-sm text-gray-900">{cashier.username}</p>
                                                <p className="font-mono text-xs text-muted-foreground tracking-wider">PIN: {cashier.pin}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                                onClick={() => handleEdit(cashier)}
                                            >
                                                <Pencil className="w-4 h-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="text-red-500 hover:text-red-600 hover:bg-red-50"
                                                onClick={() => deleteCashier(cashier.id)}
                                                disabled={cashiers.length <= 1}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </ScrollArea>

                        <Button className="w-full mt-4 gap-2" onClick={() => setMode('add')}>
                            <Plus className="w-4 h-4" />
                            Tambah Kasir Baru
                        </Button>
                    </div>
                ) : (
                    <div className="py-4 space-y-4">
                        <div className="space-y-2">
                            <Label>Nama Kasir</Label>
                            <Input
                                placeholder="Cth: Siti Aminah"
                                value={username}
                                onChange={(e) => {
                                    setUsername(e.target.value)
                                    setError(null)
                                }}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>PIN Akses</Label>
                            <Input
                                placeholder="4 digit angka"
                                maxLength={4}
                                value={pin}
                                onChange={(e) => {
                                    setPin(e.target.value)
                                    setError(null)
                                }}
                                className="font-mono tracking-widest"
                            />
                        </div>

                        {error && (
                            <p className="text-sm text-red-500 text-center font-medium animate-pulse">
                                {error}
                            </p>
                        )}

                        <div className="flex gap-2 pt-2">
                            <Button variant="outline" className="flex-1" onClick={resetForm}>
                                Batal
                            </Button>
                            <Button
                                className="flex-1"
                                onClick={mode === 'add' ? handleAdd : handleUpdate}
                                disabled={!username || pin.length < 4}
                            >
                                {mode === 'add' ? 'Simpan Baru' : 'Perbarui'}
                            </Button>
                        </div>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    )
}
