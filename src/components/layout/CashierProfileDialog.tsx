import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useAuth } from '@/contexts/AuthContext'
import { User, Calendar, Shield } from 'lucide-react'
import { format } from 'date-fns'
import { id } from 'date-fns/locale'

interface CashierProfileDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function CashierProfileDialog({ open, onOpenChange }: CashierProfileDialogProps) {
    const { user } = useAuth()

    if (!user) return null

    const formatDate = (dateString?: string) => {
        if (!dateString) return '-'
        try {
            return format(new Date(dateString), 'dd MMMM yyyy', { locale: id })
        } catch (e) {
            return dateString
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-center text-xl">Kartu Identitas Karyawan</DialogTitle>
                </DialogHeader>

                <div className="flex flex-col items-center py-6 space-y-6">
                    {/* Avatar */}
                    <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden border-4 border-white shadow-xl">
                        {user.avatar ? (
                            <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                        ) : (
                            <User className="w-10 h-10 text-primary" />
                        )}
                    </div>

                    <div className="text-center space-y-1">
                        <h2 className="text-2xl font-bold text-gray-900">{user.name}</h2>
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary/10 text-primary text-sm font-medium rounded-full">
                            <Shield className="w-3.5 h-3.5" />
                            {user.role === 'admin' ? 'Administrator' : 'Kasir / Staff'}
                        </span>
                    </div>

                    <div className="w-full grid grid-cols-1 gap-2 border-t pt-6 bg-gray-50/50 p-4 rounded-xl">
                        <div className="flex flex-col items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                                <Calendar className="w-4 h-4" />
                            </div>
                            <div className="text-center">
                                <p className="text-xs text-muted-foreground uppercase tracking-widest font-semibold">Tanggal Bergabung</p>
                                <p className="font-heading font-medium text-gray-900 mt-1">
                                    {formatDate(user.joinDate)}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
