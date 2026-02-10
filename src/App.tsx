import { useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { AppSidebar } from '@/components/layout/AppSidebar'
import { MainLayout } from '@/components/layout/MainLayout'
import { CartSidebar } from '@/components/pos/CartSidebar'
import { CartProvider } from '@/contexts/CartContext'
import { POSPage } from '@/pages/POSPage'
import { InventoryPage } from '@/pages/InventoryPage'
import { DashboardPage } from '@/pages/DashboardPage'
import { TransactionHistoryPage } from '@/pages/TransactionHistoryPage'
import { MobileNav } from '@/components/layout/MobileNav'
import { type PageType } from '@/config/nav'

import { AuthProvider, useAuth } from '@/contexts/AuthContext'
import { LoginPage } from '@/pages/LoginPage'
import { TransactionProvider } from '@/contexts/TransactionContext'

const pageVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -12 },
}

function AppContent() {
  const { isAuthenticated, user } = useAuth()
  const [activePage, setActivePage] = useState<PageType>('pos')

  // RBAC Redirect
  if (user?.role === 'cashier' && ['inventory', 'dashboard'].includes(activePage)) {
    setActivePage('pos')
  }

  useEffect(() => {
    const main = document.getElementById('main-scroll-container')
    if (main) main.scrollTo({ top: 0, behavior: 'smooth' })
  }, [activePage])

  if (!isAuthenticated) {
    return <LoginPage />
  }

  const renderPage = () => {
    switch (activePage) {
      case 'pos':
        return <POSPage />
      case 'inventory':
        return <InventoryPage />
      case 'dashboard':
        return <DashboardPage />
      case 'transactions':
        return <TransactionHistoryPage />
    }
  }

  return (
    <MainLayout
      sidebar={
        <AppSidebar activePage={activePage} onPageChange={setActivePage} />
      }
      cart={<CartSidebar />}
      bottomNav={
        <MobileNav activePage={activePage} onPageChange={setActivePage} />
      }
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={activePage}
          variants={pageVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
        >
          {renderPage()}
        </motion.div>
      </AnimatePresence>
    </MainLayout>
  )
}

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <TransactionProvider>
          <AppContent />
        </TransactionProvider>
      </CartProvider>
    </AuthProvider>
  )
}

export default App
