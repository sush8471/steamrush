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
  getWishlist,
  addWishlistItem,
  removeWishlistItem,
  mergeLocalWishlist,
  type WishlistItem,
} from '@/lib/db/wishlist-db'

// ---------------------------------------------------------------------------
// Re-export the type so consumers don't need to import from wishlist-db
// ---------------------------------------------------------------------------
export type { WishlistItem }

// ---------------------------------------------------------------------------
// Context type
// ---------------------------------------------------------------------------

interface WishlistContextType {
  wishlist: WishlistItem[]
  addToWishlist: (item: WishlistItem) => void
  removeFromWishlist: (gameId: string) => void
  isInWishlist: (gameId: string) => boolean
  count: number
  /** True while the initial DB wishlist sync is in progress */
  syncing: boolean
}

const WISHLIST_STORAGE_KEY = 'gamerbhidu-wishlist'

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

const WishlistContext = createContext<WishlistContextType | undefined>(undefined)

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------

export function WishlistProvider({ children }: { children: ReactNode }) {
  const { user, isAuthenticated, loading: authLoading } = useAuth()
  const [wishlist, setWishlist] = useState<WishlistItem[]>([])
  const [isLoaded, setIsLoaded] = useState(false)
  const [syncing, setSyncing] = useState(false)

  // Track the last user id that was synced so we don't re-sync on every render
  const syncedUserIdRef = useRef<string | null>(null)

  // ---------------------------------------------------------------------------
  // Step 1: Load from localStorage on mount (instant UI, no flash)
  // ---------------------------------------------------------------------------
  useEffect(() => {
    const saved = localStorage.getItem(WISHLIST_STORAGE_KEY)
    if (saved) {
      try {
        setWishlist(JSON.parse(saved))
      } catch {
        localStorage.removeItem(WISHLIST_STORAGE_KEY)
      }
    }
    setIsLoaded(true)
  }, [])

  // ---------------------------------------------------------------------------
  // Step 2: Once auth resolves — sync with DB
  // ---------------------------------------------------------------------------
  useEffect(() => {
    if (authLoading) return
    if (!isAuthenticated || !user) {
      syncedUserIdRef.current = null
      return
    }
    if (syncedUserIdRef.current === user.id) return

    async function loadAndMergeWishlist() {
      if (!user) return
      setSyncing(true)
      try {
        const localRaw = localStorage.getItem(WISHLIST_STORAGE_KEY)
        const localItems: WishlistItem[] = localRaw ? JSON.parse(localRaw) : []

        const merged = await mergeLocalWishlist(user.id, localItems)

        setWishlist(merged)
        syncedUserIdRef.current = user.id
        localStorage.removeItem(WISHLIST_STORAGE_KEY)

        if (localItems.length > 0 && merged.length > localItems.length) {
          toast.success('Wishlist synced across devices ☁️')
        } else if (localItems.length > 0) {
          toast.success('Wishlist saved to your account ✓')
        }
      } catch (err) {
        console.error('[WishlistContext] DB sync failed:', err)
        toast.error('Could not sync wishlist — working offline')
      } finally {
        setSyncing(false)
      }
    }

    loadAndMergeWishlist()
  }, [isAuthenticated, user, authLoading])

  // ---------------------------------------------------------------------------
  // Step 3: Persist to localStorage whenever wishlist changes (guest users)
  //         Authenticated users skip this — DB is the source of truth
  // ---------------------------------------------------------------------------
  useEffect(() => {
    if (!isLoaded) return
    if (isAuthenticated) return
    localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(wishlist))
  }, [wishlist, isLoaded, isAuthenticated])

  // ---------------------------------------------------------------------------
  // Wishlist mutations — optimistic UI, fire-and-forget DB write
  // ---------------------------------------------------------------------------

  const addToWishlist = useCallback((item: WishlistItem) => {
    setWishlist(prev => {
      if (prev.find(i => i.gameId === item.gameId)) return prev
      return [...prev, item]
    })
    toast.success(`${item.gameName} added to wishlist ❤️`)

    if (isAuthenticated && user) {
      addWishlistItem(user.id, item).catch(err =>
        console.error('[WishlistContext] addWishlistItem failed:', err)
      )
    }
  }, [isAuthenticated, user])

  const removeFromWishlist = useCallback((gameId: string) => {
    setWishlist(prev => {
      const item = prev.find(i => i.gameId === gameId)
      if (item) toast(`${item.gameName} removed from wishlist`)
      return prev.filter(i => i.gameId !== gameId)
    })

    if (isAuthenticated && user) {
      removeWishlistItem(user.id, gameId).catch(err =>
        console.error('[WishlistContext] removeWishlistItem failed:', err)
      )
    }
  }, [isAuthenticated, user])

  const isInWishlist = useCallback((gameId: string) => {
    return wishlist.some(item => item.gameId === gameId)
  }, [wishlist])

  // ---------------------------------------------------------------------------
  // Memoized computed values & context object
  // ---------------------------------------------------------------------------

  const count = useMemo(() => wishlist.length, [wishlist])

  const value = useMemo<WishlistContextType>(() => ({
    wishlist,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    count,
    syncing,
  }), [wishlist, addToWishlist, removeFromWishlist, isInWishlist, count, syncing])

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  )
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export const useWishlist = () => {
  const context = useContext(WishlistContext)
  if (!context) {
    throw new Error('useWishlist must be used within WishlistProvider')
  }
  return context
}
