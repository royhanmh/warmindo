import type { ReactNode } from 'react'

interface MainLayoutProps {
    sidebar: ReactNode
    children: ReactNode
    cart: ReactNode
}

export function MainLayout({ sidebar, children, cart }: MainLayoutProps) {
    return (
        <div className="flex h-screen overflow-hidden bg-background">
            {/* Sidebar */}
            {sidebar}

            {/* Main Content */}
            <main id="main-scroll-container" className="flex-1 overflow-y-auto scrollbar-thin">
                {children}
            </main>

            {/* Cart Sidebar */}
            <aside className="w-[380px] border-l bg-white flex flex-col shrink-0 shadow-lg">
                {cart}
            </aside>
        </div>
    )
}
