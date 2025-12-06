import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { Product, ProductCategory } from '@/types'
import { fetchProductsForCategory, productCategories } from '@/lib/data'

interface ProductState {
  products: Product[]
  categories: ProductCategory[]
  isLoading: boolean
  lastFetched: number | null
  actions: {
    fetchAllProducts: (force?: boolean) => Promise<void>
  }
}

const CACHE_DURATION = 1000 * 60 * 60 // 1 hour

export const useProductStore = create<ProductState>()(
  persist(
    (set, get) => ({
      products: [],
      categories: Object.keys(productCategories) as ProductCategory[],
      isLoading: false,
      lastFetched: null,
      actions: {
        fetchAllProducts: async (force = false) => {
          const { isLoading, lastFetched } = get()
          const now = Date.now()

          // Avoid refetching if already loading, or if not forced and cache is still valid
          if (
            isLoading ||
            (!force && lastFetched && now - lastFetched < CACHE_DURATION)
          ) {
            return
          }

          set({ isLoading: true })
          try {
            const categoryPromises = Object.entries(productCategories).map(
              ([category, url]) =>
                fetchProductsForCategory(category as ProductCategory, url)
            )

            const results = await Promise.all(categoryPromises)
            const allProducts = results.flat()

            set({ products: allProducts, isLoading: false, lastFetched: now })
          } catch (error) {
            console.error('Error fetching products for store:', error)
            set({ isLoading: false })
          }
        },
      },
    }),
    {
      name: 'santi-techs-products-v2', // new name for the new structure
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        products: state.products,
        lastFetched: state.lastFetched,
      }),
      onRehydrateStorage: () => {
        return (state) => {
          if (state) {
            // Fetch in background on rehydration if cache is expired
            state.actions.fetchAllProducts()
          }
        }
      },
    }
  )
)

// Expose actions directly for easier access in components
export const useProductActions = () => useProductStore((state) => state.actions)
