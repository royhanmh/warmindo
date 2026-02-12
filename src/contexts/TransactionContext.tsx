/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import { format } from 'date-fns'

export interface TransactionItem {
    name: string
    quantity: number
    price: number
    note?: string
}

export interface Transaction {
    id: string
    date: string
    time: string
    items: TransactionItem[]
    total: number
    payment: string
    status: 'completed' | 'refunded' | 'pending'
    customerName: string
    cashierName?: string
    cashPaid?: number
    change?: number
}

interface TransactionContextType {
    transactions: Transaction[]
    addTransaction: (transaction: Omit<Transaction, 'id' | 'date' | 'time'>) => void
    updateTransaction: (id: string, updates: Partial<Transaction>) => void
}

const TransactionContext = createContext<TransactionContextType | undefined>(undefined)

const MOCK_TRANSACTIONS: Transaction[] = [
    {
        id: 'TRX-047', date: '2026-02-10', time: '11:32',
        items: [{ name: 'Goreng +Telur', quantity: 1, price: 12000 }, { name: 'Es Teh Manis', quantity: 1, price: 4000 }],
        total: 16000, payment: 'Cash', status: 'completed', customerName: 'Budi'
    },
    {
        id: 'TRX-046', date: '2026-02-10', time: '11:15',
        items: [{ name: 'Soto +Kornet +Keju', quantity: 1, price: 18000 }, { name: 'Kopi Susu', quantity: 2, price: 15000 }],
        total: 33000, payment: 'QRIS', status: 'completed', customerName: 'Meja 3'
    },
    {
        id: 'TRX-045', date: '2026-02-10', time: '10:58',
        items: [{ name: 'Rendang +Kornet', quantity: 2, price: 24000 }, { name: 'Es Jeruk', quantity: 1, price: 5000 }],
        total: 34000, payment: 'Cash', status: 'completed', customerName: 'Siti'
    },
]

export function TransactionProvider({ children }: { children: ReactNode }) {
    const [transactions, setTransactions] = useState<Transaction[]>(() => {
        const stored = localStorage.getItem('warmindo_transactions')
        return stored ? JSON.parse(stored) : MOCK_TRANSACTIONS
    })

    useEffect(() => {
        localStorage.setItem('warmindo_transactions', JSON.stringify(transactions))
    }, [transactions])

    const addTransaction = (data: Omit<Transaction, 'id' | 'date' | 'time'>) => {
        const now = new Date()
        const newTransaction: Transaction = {
            id: `TRX-${(transactions.length + 50).toString().padStart(3, '0')}`,
            date: format(now, 'yyyy-MM-dd'),
            time: format(now, 'HH:mm'),
            ...data
        }
        setTransactions(prev => [newTransaction, ...prev])
    }

    const updateTransaction = (id: string, updates: Partial<Transaction>) => {
        setTransactions(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t))
    }

    return (
        <TransactionContext.Provider value={{ transactions, addTransaction, updateTransaction }}>
            {children}
        </TransactionContext.Provider>
    )
}

export function useTransactions(): TransactionContextType {
    const context = useContext(TransactionContext)
    if (!context) {
        throw new Error('useTransactions must be used within a TransactionProvider')
    }
    return context
}
