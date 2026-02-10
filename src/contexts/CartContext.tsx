/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useReducer, useCallback, type ReactNode } from 'react'

export interface CartTopping {
    id: string
    name: string
    price: number
}

export interface CartItem {
    id: string
    cartItemId: string
    baseNoodleName: string
    toppings: CartTopping[]
    totalPrice: number
    quantity: number
    emoji: string
}

interface CartState {
    items: CartItem[]
    customerName: string
    bounceKey: number
}

type CartAction =
    | { type: 'ADD_ITEM'; payload: CartItem }
    | { type: 'REMOVE_ITEM'; payload: string }
    | { type: 'UPDATE_QUANTITY'; payload: { cartItemId: string; quantity: number } }
    | { type: 'SET_CUSTOMER_NAME'; payload: string }
    | { type: 'CLEAR_CART' }

function cartReducer(state: CartState, action: CartAction): CartState {
    switch (action.type) {
        case 'ADD_ITEM':
            return {
                ...state,
                items: [...state.items, action.payload],
                bounceKey: state.bounceKey + 1,
            }
        case 'REMOVE_ITEM':
            return {
                ...state,
                items: state.items.filter(item => item.cartItemId !== action.payload),
            }
        case 'UPDATE_QUANTITY': {
            const { cartItemId, quantity } = action.payload
            if (quantity <= 0) {
                return {
                    ...state,
                    items: state.items.filter(item => item.cartItemId !== cartItemId),
                }
            }
            return {
                ...state,
                items: state.items.map(item =>
                    item.cartItemId === cartItemId ? { ...item, quantity } : item
                ),
            }
        }
        case 'SET_CUSTOMER_NAME':
            return {
                ...state,
                customerName: action.payload,
            }
        case 'CLEAR_CART':
            return { items: [], customerName: '', bounceKey: state.bounceKey }
        default:
            return state
    }
}

interface CartContextType {
    items: CartItem[]
    customerName: string
    bounceKey: number
    addItem: (item: CartItem) => void
    removeItem: (cartItemId: string) => void
    updateQuantity: (cartItemId: string, quantity: number) => void
    setCustomerName: (name: string) => void
    clearCart: () => void
    getTotal: () => number
    getItemCount: () => number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
    const [state, dispatch] = useReducer(cartReducer, { items: [], customerName: '', bounceKey: 0 })

    const addItem = useCallback((item: CartItem) => {
        dispatch({ type: 'ADD_ITEM', payload: item })
    }, [])

    const removeItem = useCallback((cartItemId: string) => {
        dispatch({ type: 'REMOVE_ITEM', payload: cartItemId })
    }, [])

    const updateQuantity = useCallback((cartItemId: string, quantity: number) => {
        dispatch({ type: 'UPDATE_QUANTITY', payload: { cartItemId, quantity } })
    }, [])

    const setCustomerName = useCallback((name: string) => {
        dispatch({ type: 'SET_CUSTOMER_NAME', payload: name })
    }, [])

    const clearCart = useCallback(() => {
        dispatch({ type: 'CLEAR_CART' })
    }, [])

    const getTotal = useCallback(() => {
        return state.items.reduce((total, item) => total + item.totalPrice * item.quantity, 0)
    }, [state.items])

    const getItemCount = useCallback(() => {
        return state.items.reduce((count, item) => count + item.quantity, 0)
    }, [state.items])

    return (
        <CartContext.Provider
            value={{
                items: state.items,
                customerName: state.customerName,
                bounceKey: state.bounceKey,
                addItem,
                removeItem,
                updateQuantity,
                setCustomerName,
                clearCart,
                getTotal,
                getItemCount,
            }}
        >
            {children}
        </CartContext.Provider>
    )
}

export function useCart(): CartContextType {
    const context = useContext(CartContext)
    if (!context) {
        throw new Error('useCart must be used within a CartProvider')
    }
    return context
}
