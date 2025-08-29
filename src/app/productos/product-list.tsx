'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
import { useProductStore } from '@/store/products';
import { ProductCard } from '@/components/product-card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { RefreshCw, Trash } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import type { ProductCategory } from '@/types';

type SortOrder = 'price-asc' | 'price-desc' | 'brand-asc' | 'brand-desc';

export default function ProductList() {
  const { products, isLoading, actions, categories: availableCategories } = useProductStore((state) => ({
    products: state.products,
    isLoading: state.isLoading,
    actions: state.actions,
    categories: state.categories,
  }));
  
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | 'all'>('all');
  const [selectedBrand, setSelectedBrand] = useState<string>('all');
  const [sortOrder, setSortOrder] = useState<SortOrder>('price-asc');
  
  // Helper function to check if we have products for a specific category
  const hasProductsForCategory = useCallback((category: ProductCategory | 'all'): boolean => {
    if (category === 'all') {
      return products.length > 0;
    }
    return products.some(p => p.category === category);
  }, [products]);

  // Fetch products on mount if the store is empty
  useEffect(() => {
    if (products.length === 0) {
      actions.fetchAllProducts();
    }
  }, [actions, products.length]);

  // Auto-fetch products when category changes if we don't have products for that category
  useEffect(() => {
    if (!hasProductsForCategory(selectedCategory) && !isLoading) {
      console.log(`No products found for category: ${selectedCategory}. Fetching...`);
      actions.fetchAllProducts();
    }
  }, [selectedCategory, hasProductsForCategory, isLoading, actions]);
  
  const brands = useMemo(() => {
    const productsToFilter = selectedCategory === 'all' 
      ? products 
      : products.filter(p => p.category === selectedCategory);
    return [...new Set(productsToFilter.map(p => p.brand))].sort();
  }, [products, selectedCategory]);

  const filteredAndSortedProducts = useMemo(() => {
    let filtered = [...products];

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }

    if (selectedBrand !== 'all') {
      filtered = filtered.filter(p => p.brand === selectedBrand);
    }

    filtered.sort((a, b) => {
      switch (sortOrder) {
        case 'price-asc':
          return a.price - b.price;
        case 'price-desc':
          return b.price - a.price;
        case 'brand-asc':
          return a.brand.localeCompare(b.brand);
        case 'brand-desc':
          return b.brand.localeCompare(a.brand);
        default:
          return 0;
      }
    });

    return filtered;
  }, [products, selectedCategory, selectedBrand, sortOrder]);

  const handleCategoryChange = useCallback((category: ProductCategory | 'all') => {
    setSelectedCategory(category);
    setSelectedBrand('all');
    
    // Force fetch if we don't have products for this category
    if (!hasProductsForCategory(category)) {
      console.log(`Forcing fetch for category: ${category}`);
      actions.fetchAllProducts(true); // Force refresh
    }
  }, [hasProductsForCategory, actions]);

  const resetFilters = useCallback(() => {
    setSelectedCategory('all');
    setSelectedBrand('all');
    setSortOrder('price-asc');
  }, []);

  const forceRefresh = useCallback(() => {
    actions.fetchAllProducts(true);
  }, [actions]);

  // Determine loading states
  const showInitialLoading = isLoading && products.length === 0;
  const showCategoryLoading = isLoading && !hasProductsForCategory(selectedCategory);
  const isAnyFilterActive = selectedCategory !== 'all' || selectedBrand !== 'all' || sortOrder !== 'price-asc';

  // Show loading if we're loading and don't have products for the selected category
  const shouldShowLoading = showInitialLoading || showCategoryLoading;

  return (
    <div>
      <div className="mb-4 text-center">
        <h1 className="text-3xl font-bold">Nuestros Productos</h1>
      </div>

      <div className="mb-8 flex flex-wrap justify-center gap-2">
        <Button
          variant={selectedCategory === 'all' ? 'default' : 'outline'}
          onClick={() => handleCategoryChange('all')}
          disabled={isLoading}
        >
          Todas
        </Button>
        {availableCategories.map(category => (
          <Button
            key={category}
            variant={selectedCategory === category ? 'default' : 'outline'}
            onClick={() => handleCategoryChange(category)}
            className="capitalize"
            disabled={isLoading}
          >
            {category}
            {isLoading && selectedCategory === category && (
              <RefreshCw className="ml-2 h-3 w-3 animate-spin" />
            )}
          </Button>
        ))}
      </div>
      
      <div className="mb-8 flex flex-col md:flex-row gap-4 items-center justify-end">
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto flex-wrap justify-end">
            <Select 
              value={selectedCategory} 
              onValueChange={(value) => handleCategoryChange(value as ProductCategory | 'all')} 
              disabled={isLoading}
            >
                <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Filtrar por categoría" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">Todas las categorías</SelectItem>
                    {availableCategories.map(category => (
                        <SelectItem key={category} value={category}>
                          {category.charAt(0).toUpperCase() + category.slice(1)}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>

            <Select 
              value={selectedBrand} 
              onValueChange={setSelectedBrand} 
              disabled={brands.length === 0 || isLoading}
            >
                <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Filtrar por marca" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">Todas las marcas</SelectItem>
                    {brands.map(brand => (
                        <SelectItem key={brand} value={brand}>{brand}</SelectItem>
                    ))}
                </SelectContent>
            </Select>

            <Select 
              value={sortOrder} 
              onValueChange={(value) => setSortOrder(value as SortOrder)} 
              disabled={filteredAndSortedProducts.length === 0 || isLoading}
            >
                <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Ordenar por" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="price-asc">Precio: Menor a Mayor</SelectItem>
                    <SelectItem value="price-desc">Precio: Mayor a Menor</SelectItem>
                    <SelectItem value="brand-asc">Marca: A-Z</SelectItem>
                    <SelectItem value="brand-desc">Marca: Z-A</SelectItem>
                </SelectContent>
            </Select>

            {isAnyFilterActive && (
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={resetFilters} 
                disabled={isLoading}
                title="Limpiar filtros"
              >
                <Trash className="h-4 w-4" />
              </Button>
            )}

            <Button 
              variant="outline" 
              size="icon" 
              onClick={forceRefresh} 
              disabled={isLoading} 
              title="Refrescar productos"
            >
                <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            </Button>
        </div>
      </div>
      
      {shouldShowLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="flex flex-col space-y-3">
                    <Skeleton className="h-[225px] w-full rounded-xl" />
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-[250px]" />
                        <Skeleton className="h-4 w-[200px]" />
                    </div>
                </div>
            ))}
        </div>
      ) : filteredAndSortedProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredAndSortedProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
            <h2 className="text-2xl font-semibold">
              {isLoading ? 'Cargando productos...' : 'No se encontraron productos'}
            </h2>
            <p className="text-muted-foreground mt-2">
              {!isLoading && selectedCategory !== 'all' 
                ? `No hay productos disponibles en la categoría "${selectedCategory}".` 
                : !isLoading 
                  ? 'Intenta ajustar tus filtros de búsqueda o recargar la lista.'
                  : ''
              }
            </p>
            {!isLoading && filteredAndSortedProducts.length === 0 && (
              <Button 
                variant="outline" 
                onClick={forceRefresh} 
                className="mt-4"
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Recargar productos
              </Button>
            )}
        </div>
      )}
    </div>
  );
}