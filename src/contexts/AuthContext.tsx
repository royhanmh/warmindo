/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'

interface User {
    id: string
    name: string
    role: 'admin' | 'cashier'
    avatar?: string
    joinDate?: string
}

export interface Cashier {
    id: string
    username: string
    pin: string
    joinDate: string
}

interface AuthContextType {
    user: User | null
    isAuthenticated: boolean
    login: (username: string, pin: string) => Promise<boolean>
    logout: () => void
    cashiers: Cashier[]
    addCashier: (username: string, pin: string) => void
    updateCashier: (id: string, username: string, pin: string) => void
    deleteCashier: (id: string) => void
    adminConfig: { username: string; pin: string }
    updateAdminConfig: (username: string, pin: string) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null)

    // Admin Credential State
    const [adminConfig, setAdminConfig] = useState<{ username: string; pin: string }>(() => {
        const stored = localStorage.getItem('warmindo_admin_config')
        return stored ? JSON.parse(stored) : { username: 'Administrator', pin: '9999' }
    })

    // Cashier List State
    const [cashiers, setCashiers] = useState<Cashier[]>(() => {
        const stored = localStorage.getItem('warmindo_cashiers')
        if (stored) {
            const parsed = JSON.parse(stored)
            // Migration: Ensure joinDate exists
            return parsed.map((c: Record<string, unknown>) => ({
                ...c,
                joinDate: (c.joinDate as string) || new Date().toISOString()
            }))
        }

        // Default / Migration
        const oldConfig = localStorage.getItem('warmindo_cashier_config')
        if (oldConfig) {
            const { username, pin } = JSON.parse(oldConfig)
            return [{ id: 'c-1', username, pin, joinDate: new Date().toISOString() }]
        }

        return [{ id: 'c-1', username: 'Kasir 1', pin: '1234', joinDate: new Date().toISOString() }]
    })

    // Persist Admin Config
    useEffect(() => {
        localStorage.setItem('warmindo_admin_config', JSON.stringify(adminConfig))
    }, [adminConfig])

    // Persist Cashiers
    useEffect(() => {
        localStorage.setItem('warmindo_cashiers', JSON.stringify(cashiers))
    }, [cashiers])

    const updateAdminConfig = (username: string, pin: string) => {
        setAdminConfig({ username, pin })
        if (user && user.role === 'admin') {
            setUser(prev => prev ? { ...prev, name: username } : null)
        }
    }

    const addCashier = (username: string, pin: string) => {
        const newCashier: Cashier = {
            id: `c-${Date.now()}`,
            username,
            pin,
            joinDate: new Date().toISOString()
        }
        setCashiers([...cashiers, newCashier])
    }

    const updateCashier = (id: string, username: string, pin: string) => {
        setCashiers(cashiers.map(c => c.id === id ? { ...c, username, pin } : c))
    }

    const deleteCashier = (id: string) => {
        setCashiers(cashiers.filter(c => c.id !== id))
    }

    const login = async (username: string, pin: string): Promise<boolean> => {
        // Mock authentication logic
        await new Promise(resolve => setTimeout(resolve, 800))

        const foundCashier = cashiers.find(c => c.pin === pin)

        if (foundCashier) {
            setUser({
                id: foundCashier.id,
                name: foundCashier.username,
                role: 'cashier',
                avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${foundCashier.username}`,
                joinDate: foundCashier.joinDate
            })
            return true
        } else if (pin === adminConfig.pin) { // Admin
            setUser({
                id: 'u-2',
                name: adminConfig.username,
                role: 'admin',
                avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=Admin`,
                joinDate: new Date('2024-01-01').toISOString() // Admin founded date :)
            })
            return true
        }

        return false
    }

    const logout = () => {
        setUser(null)
    }

    return (
        <AuthContext.Provider value={{
            user,
            isAuthenticated: !!user,
            login,
            logout,
            cashiers,
            addCashier,
            updateCashier,
            deleteCashier,
            adminConfig,
            updateAdminConfig
        }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth(): AuthContextType {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}
