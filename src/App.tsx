import { useState, useEffect, lazy, Suspense } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { AppSidebar } from '@/components/layout/AppSidebar'
import { MainLayout } from '@/components/layout/MainLayout'
import { CartSidebar } from '@/components/pos/CartSidebar'
import { CartProvider } from '@/contexts/CartContext'
import { AuthProvider, useAuth } from '@/contexts/AuthContext'
import { TransactionProvider } from '@/contexts/TransactionContext'
import { Loader2 } from 'lucide-react'

// Lazy load pages to reduce initial bundle size
const POSPage = lazy(() => import('@/pages/POSPage').then(module => ({ default: module.POSPage })))
const InventoryPage = lazy(() => import('@/pages/InventoryPage').then(module => ({ default: module.InventoryPage })))
const DashboardPage = lazy(() => import('@/pages/DashboardPage').then(module => ({ default: module.DashboardPage })))
const TransactionHistoryPage = lazy(() => import('@/pages/TransactionHistoryPage').then(module => ({ default: module.TransactionHistoryPage })))
const LoginPage = lazy(() => import('@/pages/LoginPage').then(module => ({ default: module.LoginPage })))
import { MobileNav } from '@/components/layout/MobileNav'
import { type PageType } from '@/config/nav'

const pageVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -12 },
}

function AppContent() {
  const { isAuthenticated, user } = useAuth()
  const [activePage, setActivePage] = useState<PageType>(() => {
    const saved = localStorage.getItem('warmindo-active-page') as PageType | null
    return saved || 'pos'
  })

  const handlePageChange = (page: PageType) => {
    setActivePage(page)
    localStorage.setItem('warmindo-active-page', page)
  }

  // RBAC Redirect
  if (user?.role === 'cashier' && ['inventory', 'dashboard'].includes(activePage)) {
    handlePageChange('pos')
  }

  useEffect(() => {
    const main = document.getElementById('main-scroll-container')
    if (main) main.scrollTo({ top: 0, behavior: 'smooth' })
  }, [activePage])

  if (!isAuthenticated) {
    return (
      <Suspense fallback={<div className="h-screen w-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>}>
        <LoginPage />
      </Suspense>
    )
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
        <AppSidebar activePage={activePage} onPageChange={handlePageChange} />
      }
      cart={<CartSidebar />}
      bottomNav={
        <MobileNav activePage={activePage} onPageChange={handlePageChange} />
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
          <Suspense fallback={
            <div className="flex items-center justify-center h-full min-h-[50vh]">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          }>
            {renderPage()}
          </Suspense>
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
