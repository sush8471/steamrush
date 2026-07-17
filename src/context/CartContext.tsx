"use client"

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useMemo,
  useCallback,
  useRef,
} from 'react'
import { toast } from 'sonner'
import { useAuth } from '@/context/AuthContext'
import {
  getCartItems,
  addCartItem,
  removeCartItem,
  clearCartDb,
  mergeLocalCart,
} from '@/lib/db/cart-db'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface CartItem {
  id: string
  name: string
  price: number
  image: string
  originalPrice?: number
}

interface CartContextType {
  cart: CartItem[]
  addToCart: (item: CartItem) => void
  removeFromCart: (id: string) => void
  clearCart: () => void
  isInCart: (id: string) => boolean
  totalPrice: number
  itemCount: number
  /** True while the initial DB cart sync is in progress */
  syncing: boolean
}

const CART_STORAGE_KEY = 'gamerbhidu-cart'

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

const CartContext = createContext<CartContextType | undefined>(undefined)

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------

export function CartProvider({ children }: { children: ReactNode }) {
  const { user, isAuthenticated, loading: authLoading } = useAuth()
  const [cart, setCart] = useState<CartItem[]>([])
  const [isLoaded, setIsLoaded] = useState(false)
  const [syncing, setSyncing] = useState(false)

  // Track the last user id that was synced so we don't re-sync on every render
  const syncedUserIdRef = useRef<string | null>(null)

  // ---------------------------------------------------------------------------
  // Step 1: Load from localStorage on mount (instant UI, no flash)
  // ---------------------------------------------------------------------------
  useEffect(() => {
    const savedCart = localStorage.getItem(CART_STORAGE_KEY)
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart))
      } catch {
        // corrupted storage — start fresh
        localStorage.removeItem(CART_STORAGE_KEY)
      }
    }
    setIsLoaded(true)
  }, [])

  // ---------------------------------------------------------------------------
  // Step 2: Once auth resolves — sync with DB
  // ---------------------------------------------------------------------------
  useEffect(() => {
    if (authLoading) return                      // wait for auth to settle
    if (!isAuthenticated || !user) {
      // User signed out — clear synced marker so next sign-in triggers sync
      syncedUserIdRef.current = null
      return
    }
    if (syncedUserIdRef.current === user.id) return  // already synced this session

    async function loadAndMergeCart() {
      if (!user) return
      setSyncing(true)
      try {
        // Read localStorage items that were added before sign-in
        const localRaw = localStorage.getItem(CART_STORAGE_KEY)
        const localItems: CartItem[] = localRaw ? JSON.parse(localRaw) : []

        // Merge local → DB and get the authoritative merged list back
        const merged = await mergeLocalCart(user.id, localItems)

        setCart(merged)
        syncedUserIdRef.current = user.id

        // Clear localStorage now that DB is the source of truth
        localStorage.removeItem(CART_STORAGE_KEY)

        if (localItems.length > 0 && merged.length > localItems.length) {
          toast.success('Cart synced across devices ☁️')
        } else if (localItems.length > 0) {
          toast.success('Cart saved to your account ✓')
        }
      } catch (err) {
        console.error('[CartContext] DB sync failed:', err)
        toast.error('Could not sync cart — working offline')
      } finally {
        setSyncing(false)
      }
    }

    loadAndMergeCart()
  }, [isAuthenticated, user, authLoading])

  // ---------------------------------------------------------------------------
  // Step 3: Persist to localStorage whenever cart changes (guest users)
  //         Authenticated users skip this — DB is the source of truth
  // ---------------------------------------------------------------------------
  useEffect(() => {
    if (!isLoaded) return
    if (isAuthenticated) return  // DB handles persistence
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart))
  }, [cart, isLoaded, isAuthenticated])

  // ---------------------------------------------------------------------------
  // Cart mutations — all update local state immediately (optimistic UI),
  // then fire-and-forget DB write when authenticated
  // ---------------------------------------------------------------------------

  const addToCart = useCallback((item: CartItem) => {
    setCart(prev => {
      if (prev.find(i => i.id === item.id)) return prev  // already in cart
      return [...prev, item]
    })
    toast.success(`${item.name} added to cart 🛒`)

    if (isAuthenticated && user) {
      addCartItem(user.id, item).catch(err =>
        console.error('[CartContext] addCartItem failed:', err)
      )
    }
  }, [isAuthenticated, user])

  const removeFromCart = useCallback((id: string) => {
    setCart(prev => {
      const item = prev.find(i => i.id === id)
      if (item) toast(`${item.name} removed from cart`)
      return prev.filter(i => i.id !== id)
    })

    if (isAuthenticated && user) {
      removeCartItem(user.id, id).catch(err =>
        console.error('[CartContext] removeCartItem failed:', err)
      )
    }
  }, [isAuthenticated, user])

  const clearCart = useCallback(() => {
    setCart([])
    toast('Cart cleared')

    if (isAuthenticated && user) {
      clearCartDb(user.id).catch(err =>
        console.error('[CartContext] clearCartDb failed:', err)
      )
    }
  }, [isAuthenticated, user])

  const isInCart = useCallback((id: string) => {
    return cart.some(item => item.id === id)
  }, [cart])

  // ---------------------------------------------------------------------------
  // Memoized computed values & context object
  // ---------------------------------------------------------------------------

  const totalPrice = useMemo(() => cart.reduce((sum, item) => sum + item.price, 0), [cart])
  const itemCount = useMemo(() => cart.length, [cart])

  const value = useMemo<CartContextType>(() => ({
    cart,
    addToCart,
    removeFromCart,
    clearCart,
    isInCart,
    totalPrice,
    itemCount,
    syncing,
  }), [cart, addToCart, removeFromCart, clearCart, isInCart, totalPrice, itemCount, syncing])

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  )
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within CartProvider')
  }
  return context
}
