import { useState } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader2, ChefHat, AlertCircle } from 'lucide-react'

export function LoginPage() {
    const { login } = useAuth()
    const [username, setUsername] = useState('')
    const [pin, setPin] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setIsLoading(true)

        try {
            const success = await login(username, pin)
            if (!success) {
                setError('PIN salah. Silakan coba lagi. (Hint: 1234)')
            }
        } catch {
            setError('Terjadi kesalahan. Silakan coba lagi.')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <main className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, type: 'spring' }}
                className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden"
            >
                {/* Header Section */}
                <div className="bg-primary/5 p-8 text-center border-b border-gray-100 relative overflow-hidden">
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="relative z-10"
                    >
                        <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-primary/20">
                            <ChefHat className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="font-heading font-bold text-2xl text-gray-900">Warmindo Ops</h1>
                        <p className="text-gray-600 text-sm mt-1">Masuk untuk memulai shift</p>
                    </motion.div>
                </div>

                {/* Form Section */}
                <div className="p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="username" className="text-gray-600">Nama Pengguna</Label>
                            <Input
                                id="username"
                                type="text"
                                placeholder="Cth: Budi Santoso"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="h-11 bg-gray-50"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="pin" className="text-gray-600">PIN Keamanan</Label>
                            <Input
                                id="pin"
                                type="password"
                                placeholder="••••"
                                value={pin}
                                onChange={(e) => setPin(e.target.value)}
                                className="h-11 bg-gray-50 text-center tracking-widest text-lg font-bold"
                                maxLength={4}
                                required
                            />
                        </div>

                        {error && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                className="flex items-center gap-2 text-destructive text-sm bg-destructive/10 p-3 rounded-lg"
                            >
                                <AlertCircle className="w-4 h-4 shrink-0" />
                                {error}
                            </motion.div>
                        )}

                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="w-full h-12 text-lg font-bold shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all bg-primary hover:bg-primary/90"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                    Memproses...
                                </>
                            ) : (
                                'Masuk ke POS'
                            )}
                        </Button>
                    </form>

                    <div className="mt-8 text-center border-t pt-6">
                        <p className="text-xs text-muted-foreground">
                            Warmindo Ops v1.0 • Built with ❤️ using React
                        </p>
                    </div>
                </div>
            </motion.div>
        </main>
    )
}
