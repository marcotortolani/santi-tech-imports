'use client'
import { useEffect, useState } from 'react'
import { useProductStore } from '@/store/products'
import { ProductCard } from './product-card'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'
import { Skeleton } from './ui/skeleton'
import type { Product, ProductCategory } from '@/types'
import Link from 'next/link'
import { Button } from './ui/button'

// Helper to get top 2 most expensive products from each category
const getFeaturedProducts = (products: Product[]): Product[] => {
  const productsByCategory: Record<ProductCategory, Product[]> = {} as any

  // Group products by category
  for (const product of products) {
    if (!productsByCategory[product.category]) {
      productsByCategory[product.category] = []
    }
    productsByCategory[product.category].push(product)
  }

  // Get top 2 most expensive from each category
  const featured: Product[] = []
  for (const category in productsByCategory) {
    const sortedProducts = productsByCategory[category as ProductCategory]
      .sort((a, b) => b.price - a.price)
      .slice(0, 2)
    featured.push(...sortedProducts)
  }

  return featured
}

export function FeaturedProducts() {
  const {
    products,
    isLoading: storeIsLoading,
    actions,
  } = useProductStore((state) => ({
    products: state.products,
    isLoading: state.isLoading,
    actions: state.actions,
  }))

  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    actions.fetchAllProducts()
  }, [])

  useEffect(() => {
    const initializeProducts = async () => {
      setIsLoading(true)
      // If store has products, use them
      if (products.length > 0) {
        setFeaturedProducts(getFeaturedProducts(products))
        setIsLoading(false)
      } else {
        // If store is empty, but not loading, fetch them
        if (!storeIsLoading) {
          await actions.fetchAllProducts()
        }
        // The store listener will update the products, so we wait for the next render
      }
    }
    initializeProducts()
  }, [products, storeIsLoading, actions])

  // This effect reacts to changes in the product store triggered by the fetch
  useEffect(() => {
    if (products.length > 0) {
      setFeaturedProducts(getFeaturedProducts(products))
      setIsLoading(false)
    }
  }, [products])

  if (isLoading) {
    return (
      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="text-3xl font-bold tracking-tighter text-center sm:text-4xl md:text-5xl mb-12">
            Productos Destacados
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex flex-col space-y-3">
                <Skeleton className="h-[225px] w-full rounded-xl" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[250px]" />
                  <Skeleton className="h-4 w-[200px]" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (featuredProducts.length === 0) {
    return null // Don't show the section if there are no featured products
  }

  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-secondary/20">
      <div className="container mx-auto px-4 md:px-6">
        <h2 className="text-3xl font-bold tracking-tighter text-center sm:text-4xl md:text-5xl mb-12">
          Productos Destacados
        </h2>
        <Carousel
          opts={{
            align: 'start',
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent>
            {featuredProducts.map((product, index) => (
              <CarouselItem
                key={`${product.id}-${index}`}
                className="md:basis-1/2 lg:basis-1/3 xl:basis-1/4"
              >
                <div className="p-1 h-full">
                  <ProductCard product={product} />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="ml-8" />
          <CarouselNext className="mr-8" />
        </Carousel>
        <div className="flex justify-center mt-8">
          <Button asChild>
            <Link href="/productos">Ver todos los productos</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
