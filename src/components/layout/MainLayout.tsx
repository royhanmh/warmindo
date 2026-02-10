import { useState, type ReactNode } from 'react'
import { Sheet, SheetContent, SheetTrigger, SheetClose } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { ShoppingCart, ChefHat, X } from 'lucide-react'
import { useIsMobile } from '@/hooks/use-mobile'
import { useCart } from '@/contexts/CartContext'

interface MainLayoutProps {
    sidebar: ReactNode
    children: ReactNode
    cart: ReactNode
    bottomNav?: ReactNode
}

export function MainLayout({ sidebar, children, cart, bottomNav }: MainLayoutProps) {
    const isMobile = useIsMobile()
    const { getItemCount } = useCart()
    const itemCount = getItemCount()
    const [cartOpen, setCartOpen] = useState(false)

    return (
        <div className="flex h-screen overflow-hidden bg-background">
            {/* Desktop Sidebar */}
            {!isMobile && sidebar}

            <div className="flex-1 flex flex-col h-full overflow-hidden relative">
                {/* Mobile Header */}
                {isMobile && (
                    <header className="h-14 border-b bg-white flex items-center justify-center shrink-0 px-4 relative">
                        <div className="flex items-center gap-2 font-heading font-bold text-lg text-primary">
                            <ChefHat className="w-6 h-6" />
                            <span>Warmindo Ops</span>
                        </div>
                    </header>
                )}

                {/* Main Content */}
                <main id="main-scroll-container" className="flex-1 overflow-y-auto scrollbar-thin pb-20 md:pb-0">
                    {children}
                </main>

                {/* Mobile Bottom Nav */}
                {isMobile && bottomNav}

                {/* Mobile Cart FAB */}
                {isMobile && (
                    <Sheet open={cartOpen} onOpenChange={setCartOpen}>
                        <SheetTrigger asChild>
                            <Button
                                size="icon"
                                className="fixed bottom-20 right-4 h-14 w-14 rounded-full shadow-xl shadow-primary/30 z-40"
                            >
                                <ShoppingCart className="w-6 h-6" />
                                {itemCount > 0 && (
                                    <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white ring-2 ring-white">
                                        {itemCount}
                                    </span>
                                )}
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="bottom" className="h-[85vh] p-0 rounded-t-[20px] [&>button:last-child]:hidden">
                            {/* Custom drag handle + close header */}
                            <div className="flex items-center justify-end px-4 pt-3 pb-1">
                                <div className="absolute left-1/2 -translate-x-1/2 top-2 w-10 h-1 rounded-full bg-gray-300" />
                                <SheetClose asChild>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                                        <X className="h-4 w-4" />
                                    </Button>
                                </SheetClose>
                            </div>
                            <div className="flex-1 overflow-y-auto h-[calc(85vh-52px)]">
                                {cart}
                            </div>
                        </SheetContent>
                    </Sheet>
                )}
            </div>

            {/* Desktop Cart Sidebar */}
            {!isMobile && (
                <aside className="w-[380px] border-l bg-white flex flex-col shrink-0 shadow-lg">
                    {cart}
                </aside>
            )}
        </div>
    )
}

