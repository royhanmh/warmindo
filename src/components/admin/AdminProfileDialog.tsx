import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/contexts/AuthContext'
import { Save } from 'lucide-react'

interface AdminProfileDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function AdminProfileDialog({ open, onOpenChange }: AdminProfileDialogProps) {
    const { adminConfig, updateAdminConfig } = useAuth()
    const [username, setUsername] = useState('')
    const [pin, setPin] = useState('')
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)

    useEffect(() => {
        if (open) {
            setUsername(adminConfig.username)
            setPin(adminConfig.pin)
            setSuccess(false)
            setError(null)
        }
    }, [open, adminConfig])

    const handleSave = () => {
        if (!username || pin.length < 4) return
        if (username.trim() === pin.trim()) {
            setError('Username dan PIN tidak boleh sama!')
            return
        }
        updateAdminConfig(username, pin)
        setSuccess(true)
        setError(null)
        setTimeout(() => {
            onOpenChange(false)
        }, 1000)
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Profile Admin</DialogTitle>
                    <DialogDescription>
                        Ubah detail login untuk akun Administrator.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="admin-username" className="text-right">
                            Username
                        </Label>
                        <Input
                            id="admin-username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="col-span-3"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="admin-pin" className="text-right">
                            PIN
                        </Label>
                        <Input
                            id="admin-pin"
                            value={pin}
                            maxLength={4} // Admin PIN can be longer? Let's keep consistent 4 for now or minimal 4. Prompt didn't specify.
                            onChange={(e) => setPin(e.target.value)}
                            className="col-span-3 font-mono tracking-widest"
                            placeholder="4 digit"
                        />
                    </div>
                </div>
                {error && (
                    <p className="text-sm text-red-500 text-center mb-4 font-medium">
                        {error}
                    </p>
                )}
                <DialogFooter>
                    <Button type="submit" onClick={handleSave} disabled={success}>
                        {success ? 'Tersimpan!' : (
                            <>
                                <Save className="w-4 h-4 mr-2" />
                                Simpan Perubahan
                            </>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
