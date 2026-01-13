// src/lib/data.ts

import Papa from 'papaparse'
import type { Product, ProductCategory } from '@/types'

const MARKUP_PERCENTAGE = parseFloat(
  process.env.PRICE_MARKUP_PERCENTAGE || '20'
)
const MARKUP_MULTIPLIER = 1 + MARKUP_PERCENTAGE / 100

// Helper function to clean and parse price
const parsePrice = (priceStr: string | undefined): number => {
  if (!priceStr) return NaN
  // Remove asterisks, dots used as thousand separators, currency symbols and spaces
  const cleanedPrice = priceStr
    .replace(/\*/g, '')
    .replace(/\./g, '')
    .replace(/U\$|\$/g, '')
    .trim()
  return parseInt(cleanedPrice, 10)
}

const convertSheetUrlToCsvUrl = (url: string): string => {
  const match = url.match(
    /spreadsheets\/d\/(?:e\/)?([^\/]+)\/.*?(?:#gid=)?(\d+)?$/
  )
  if (match) {
    const docId = match[1]
    const effectiveDocId = url.includes('/e/') ? `e/${docId}` : docId
    const gid = match[2] ? `&gid=${match[2]}` : '&gid=0'
    return `https://docs.google.com/spreadsheets/d/${effectiveDocId}/pub?output=csv${gid}`
  }
  return url.replace(
    /\/((pub|pubhtml|htmlview)(#gid=\d+)?)?$/,
    '/pub?output=csv'
  )
}

// --- Generic Product Fetching Logic ---

// Helper function to detect if a row is a brand row
const isBrandRow = (columns: string[]): boolean => {
  if (columns.length === 0) return false

  const col0 = columns[0]?.trim() || ''
  const col1 = columns[1]?.trim() || ''

  // Brand row: column 0 is empty AND column 1 starts and ends with '*'
  // AND column 1 does NOT contain 'U$' (to avoid confusing with products)
  return (
    !col0 && col1.startsWith('*') && col1.endsWith('*') && !col1.includes('U$')
  )
}

// Helper function to detect if a row is a product row
const isProductRow = (columns: string[]): boolean => {
  if (columns.length < 2) return false

  const col0 = columns[0]?.trim() || ''

  // Product row: column 0 contains 'U$' and starts/ends with '*'
  return col0.includes('U$') && col0.startsWith('*') && col0.endsWith('*')
}

// Helper function to extract brand info
const extractBrandInfo = (
  columns: string[]
): { brand: string; details: string | null } => {
  const brandString = columns[1]?.trim() || ''
  const cleanBrand = brandString.replace(/\*/g, '').trim()

  const detailsMatch = cleanBrand.match(/^([^(]+)\s*\(([^)]+)\)/)
  if (detailsMatch) {
    return {
      brand: detailsMatch[1].trim(),
      details: detailsMatch[2].trim(),
    }
  }

  return {
    brand: cleanBrand,
    details: null,
  }
}

// --- Notebook Specific Fetching Logic ---

const extractBrandFromNotebook = (producto: string): string => {
  if (producto.includes('ACER')) return 'ACER'
  if (producto.includes('HP')) return 'HP'
  if (producto.includes('LENOVO')) return 'LENOVO'
  if (producto.includes('MSI')) return 'MSI'
  if (producto.includes('SAMSUNG')) return 'SAMSUNG'
  return 'Unknown Brand'
}

const cleanNotebookModel = (producto: string): string => {
  return producto.replace(/🟤💻|🔵💻|🟣💻|🟠💻|🔴💻/g, '').trim()
}

const isNotebookProductRow = (columns: string[]): boolean => {
  if (columns.length < 2) return false
  const precio = columns[0]?.trim() || '' // ✅ Columna 0 tiene el precio
  const producto = columns[1]?.trim() || '' // ✅ Columna 1 tiene el producto
  return precio.includes('U$') && producto.includes('💻')
}

const isNotebookSpecsRow = (columns: string[]): boolean => {
  if (columns.length < 2) return false
  const precio = columns[0]?.trim() || '' // ✅ Columna 0 debería estar vacía
  const producto = columns[1]?.trim() || '' // ✅ Columna 1 tiene las specs
  return precio === '' && !producto.startsWith('*') && !producto.includes('💻')
}

export const productCategories: Record<ProductCategory, string> = {
  celulares:
    'https://docs.google.com/spreadsheets/d/e/2PACX-1vQQptMdgB5hIEGG1jx8jw7cfBFz0xt7ZrvfhJ9uRFEwi8VhnCZ7-ebg-izHrPKE6Pwi06_KE-4n5w20/pubhtml#gid=2118976812',
  cámaras:
    'https://docs.google.com/spreadsheets/d/e/2PACX-1vQQptMdgB5hIEGG1jx8jw7cfBFz0xt7ZrvfhJ9uRFEwi8VhnCZ7-ebg-izHrPKE6Pwi06_KE-4n5w20/pubhtml#gid=229651643',
  'lentes y flashes':
    'https://docs.google.com/spreadsheets/d/e/2PACX-1vQQptMdgB5hIEGG1jx8jw7cfBFz0xt7ZrvfhJ9uRFEwi8VhnCZ7-ebg-izHrPKE6Pwi06_KE-4n5w20/pubhtml#gid=1356281375',
  'ipads y tablets':
    'https://docs.google.com/spreadsheets/d/e/2PACX-1vQQptMdgB5hIEGG1jx8jw7cfBFz0xt7ZrvfhJ9uRFEwi8VhnCZ7-ebg-izHrPKE6Pwi06_KE-4n5w20/pubhtml#gid=2122100413',
  'macbooks e imacs':
    'https://docs.google.com/spreadsheets/d/e/2PACX-1vQQptMdgB5hIEGG1jx8jw7cfBFz0xt7ZrvfhJ9uRFEwi8VhnCZ7-ebg-izHrPKE6Pwi06_KE-4n5w20/pubhtml#gid=1232868761',
  notebooks:
    'https://docs.google.com/spreadsheets/d/e/2PACX-1vQQptMdgB5hIEGG1jx8jw7cfBFz0xt7ZrvfhJ9uRFEwi8VhnCZ7-ebg-izHrPKE6Pwi06_KE-4n5w20/pubhtml#gid=1820778593',
  varios:
    'https://docs.google.com/spreadsheets/d/e/2PACX-1vQQptMdgB5hIEGG1jx8jw7cfBFz0xt7ZrvfhJ9uRFEwi8VhnCZ7-ebg-izHrPKE6Pwi06_KE-4n5w20/pubhtml#gid=1031525582',
}

export async function fetchNotebooks(url: string): Promise<Product[]> {
  const csvUrl = convertSheetUrlToCsvUrl(url)

  try {
    const response = await fetch(csvUrl, { next: { revalidate: 3600 } })
    if (!response.ok) {
      console.error('Failed to fetch notebook data, status:', response.status)
      return []
    }

    const csvText = await response.text()

    const parsed = Papa.parse(csvText, {
      header: false,
      skipEmptyLines: true,
      delimiter: ',',
      quoteChar: '"',
      escapeChar: '"',
    })

    if (parsed.errors.length > 0) {
      console.error('CSV parsing errors for notebooks:', parsed.errors)
    }

    const rows = parsed.data as string[][]
    const notebooks: Product[] = []
    let idCounter = 0

    // Empezar desde 2 para saltar las filas de encabezado
    for (let i = 2; i < rows.length; i++) {
      const columns = rows[i]

      if (!columns || columns.length < 2) continue

      if (isNotebookProductRow(columns)) {
        const nextRow = i + 1 < rows.length ? rows[i + 1] : null
        let specs = ''

        if (nextRow && isNotebookSpecsRow(nextRow)) {
          specs = nextRow[1]?.trim() || '' // ✅ Columna 1 tiene las specs
          i++
        }

        const price = parsePrice(columns[0]) // ✅ Columna 0 tiene el precio
        const model = cleanNotebookModel(columns[1]) // ✅ Columna 1 tiene el modelo
        const brand = extractBrandFromNotebook(columns[1])

        if (!isNaN(price) && model) {
          notebooks.push({
            id: `notebook-${++idCounter}`,
            category: 'notebooks',
            brand: brand,
            model: model,
            price: price * MARKUP_MULTIPLIER,
            details: specs,
          })
        }
      }
    }

    return notebooks
  } catch (error) {
    console.error('Error fetching or parsing notebooks:', error)
    return []
  }
}

export async function fetchProductsForCategory(
  category: ProductCategory,
  url: string
): Promise<Product[]> {
  if (category === 'notebooks') {
    return fetchNotebooks(url)
  }

  const csvUrl = convertSheetUrlToCsvUrl(url)

  try {
    const response = await fetch(csvUrl, { next: { revalidate: 3600 } })

    if (!response.ok) {
      console.error(
        `Failed to fetch ${category} data, status:`,
        response.status
      )
      return []
    }

    const csvText = await response.text()

    const parsed = Papa.parse(csvText, {
      header: false,
      skipEmptyLines: true,
      delimiter: ',',
      quoteChar: '"',
      escapeChar: '"',
    })

    if (parsed.errors.length > 0) {
      console.error(`CSV parsing errors for ${category}:`, parsed.errors)
    }

    const rows = parsed.data as string[][]
    const products: Product[] = []
    let currentBrand = 'Sin Marca'
    let currentDetails: string | null = null
    let idCounter = 0

    // Start from index 1 to skip header row
    for (let i = 1; i < rows.length; i++) {
      const columns = rows[i]

      if (!columns || columns.length < 2) continue

      if (isBrandRow(columns)) {
        const brandInfo = extractBrandInfo(columns)
        currentBrand = brandInfo.brand
        currentDetails = brandInfo.details
        continue
      }

      if (isProductRow(columns)) {
        const price = parsePrice(columns[0]) // Price is in column 0
        const model = (columns[1]?.trim() || '') // Model is in column 1
          .replace(/📱|📷|🔭|💻|🖥️|🎧|🔋|🔌|📳|🪙/g, '')
          .trim()

        if (!isNaN(price) && model) {
          products.push({
            id: `${category}-${++idCounter}`,
            category: category,
            brand: currentBrand,
            model: model,
            price: price * MARKUP_MULTIPLIER,
            details: currentDetails,
          })
        }
      }
    }

    return products
  } catch (error) {
    console.error(`Error fetching or parsing ${category}:`, error)
    return []
  }
}

// // src/lib/data.ts

// import Papa from 'papaparse'
// import type { Product, ProductCategory } from '@/types'

// // Helper function to clean and parse price
// const parsePrice = (priceStr: string | undefined): number => {
//   if (!priceStr) return NaN
//   // Remove asterisks, dots used as thousand separators, currency symbols and spaces
//   const cleanedPrice = priceStr
//     .replace(/\*/g, '')
//     .replace(/\./g, '')
//     .replace(/U\$|\$/g, '')
//     .trim()
//   return parseInt(cleanedPrice, 10)
// }

// const convertSheetUrlToCsvUrl = (url: string): string => {
//   const match = url.match(
//     /spreadsheets\/d\/(?:e\/)?([^\/]+)\/.*?(?:#gid=)?(\d+)?$/
//   )
//   if (match) {
//     const docId = match[1]
//     // The docId for /e/ URLs is longer and needs to be used as is.
//     // For standard URLs, it's just the ID.
//     const effectiveDocId = url.includes('/e/') ? `e/${docId}` : docId
//     const gid = match[2] ? `&gid=${match[2]}` : '&gid=0' // Default to first sheet if no GID
//     return `https://docs.google.com/spreadsheets/d/${effectiveDocId}/pub?output=csv${gid}`
//   }
//   // Fallback for simpler URLs
//   return url.replace(
//     /\/((pub|pubhtml|htmlview)(#gid=\d+)?)?$/,
//     '/pub?output=csv'
//   )
// }

// // --- Generic Product Fetching Logic ---

// // Helper function to detect if a row is a brand row
// const isBrandRow = (columns: string[]): boolean => {
//   if (columns.length === 0) return false

//   // A brand row can be in the first or third column, starts with '*' and has no price-like second column.
//   const potentialBrand = columns[0]?.trim() || ''
//   const priceColumn = columns[1]?.trim() || ''
//   const productColumn = columns[2]?.trim() || ''

//   if (potentialBrand.startsWith('*') && !priceColumn.includes('U$')) {
//     return true
//   }
//   if (productColumn.startsWith('*') && !priceColumn.includes('U$')) {
//     return true
//   }

//   return false
// }

// // Helper function to detect if a row is a product row
// const isProductRow = (columns: string[]): boolean => {
//   if (columns.length < 2) return false
//   const price = columns[1]?.trim() || ''
//   // A product row has a price in the second column.
//   return price.includes('U$')
// }

// // Helper function to extract brand info
// const extractBrandInfo = (
//   columns: string[]
// ): { brand: string; details: string | null } => {
//   const brandString =
//     (columns[0]?.trim()?.startsWith('*')
//       ? columns[0].trim()
//       : columns[2]?.trim()) || ''
//   const cleanBrand = brandString.replace(/\*/g, '').trim()

//   const detailsMatch = cleanBrand.match(/^([^(]+)\s*\(([^)]+)\)/)
//   if (detailsMatch) {
//     return {
//       brand: detailsMatch[1].trim(),
//       details: detailsMatch[2].trim(),
//     }
//   }

//   return {
//     brand: cleanBrand,
//     details: null,
//   }
// }

// // --- Notebook Specific Fetching Logic ---

// const extractBrandFromNotebook = (producto: string): string => {
//   if (producto.includes('ACER')) return 'ACER'
//   if (producto.includes('HP')) return 'HP'
//   if (producto.includes('LENOVO')) return 'LENOVO'
//   if (producto.includes('MSI')) return 'MSI'
//   if (producto.includes('SAMSUNG')) return 'SAMSUNG'
//   return 'Unknown Brand'
// }

// const cleanNotebookModel = (producto: string): string => {
//   return producto.replace(/🟤💻|🔵💻|🟣💻|🟠💻|🔴💻/g, '').trim()
// }

// const isNotebookProductRow = (columns: string[]): boolean => {
//   if (columns.length < 3) return false
//   const precio = columns[1]?.trim() || ''
//   const producto = columns[2]?.trim() || ''
//   return precio.includes('U$') && producto.includes('💻')
// }

// const isNotebookSpecsRow = (columns: string[]): boolean => {
//   if (columns.length < 3) return false
//   const precio = columns[1]?.trim() || ''
//   const producto = columns[2]?.trim() || ''
//   return precio === '' && !producto.startsWith('*') && !producto.includes('💻')
// }

// export const productCategories: Record<ProductCategory, string> = {
//   celulares:
//     'https://docs.google.com/spreadsheets/d/e/2PACX-1vQQptMdgB5hIEGG1jx8jw7cfBFz0xt7ZrvfhJ9uRFEwi8VhnCZ7-ebg-izHrPKE6Pwi06_KE-4n5w20/pubhtml#gid=2118976812',
//   cámaras:
//     'https://docs.google.com/spreadsheets/d/e/2PACX-1vQQptMdgB5hIEGG1jx8jw7cfBFz0xt7ZrvfhJ9uRFEwi8VhnCZ7-ebg-izHrPKE6Pwi06_KE-4n5w20/pubhtml#gid=229651643',
//   'lentes y flashes':
//     'https://docs.google.com/spreadsheets/d/e/2PACX-1vQQptMdgB5hIEGG1jx8jw7cfBFz0xt7ZrvfhJ9uRFEwi8VhnCZ7-ebg-izHrPKE6Pwi06_KE-4n5w20/pubhtml#gid=1356281375',
//   'ipads y tablets':
//     'https://docs.google.com/spreadsheets/d/e/2PACX-1vQQptMdgB5hIEGG1jx8jw7cfBFz0xt7ZrvfhJ9uRFEwi8VhnCZ7-ebg-izHrPKE6Pwi06_KE-4n5w20/pubhtml#gid=2122100413',
//   'macbooks e imacs':
//     'https://docs.google.com/spreadsheets/d/e/2PACX-1vQQptMdgB5hIEGG1jx8jw7cfBFz0xt7ZrvfhJ9uRFEwi8VhnCZ7-ebg-izHrPKE6Pwi06_KE-4n5w20/pubhtml#gid=1232868761',
//   notebooks:
//     'https://docs.google.com/spreadsheets/d/e/2PACX-1vQQptMdgB5hIEGG1jx8jw7cfBFz0xt7ZrvfhJ9uRFEwi8VhnCZ7-ebg-izHrPKE6Pwi06_KE-4n5w20/pubhtml#gid=1820778593',
//   varios:
//     'https://docs.google.com/spreadsheets/d/e/2PACX-1vQQptMdgB5hIEGG1jx8jw7cfBFz0xt7ZrvfhJ9uRFEwi8VhnCZ7-ebg-izHrPKE6Pwi06_KE-4n5w20/pubhtml#gid=1031525582',
// }

// export async function fetchNotebooks(url: string): Promise<Product[]> {
//   const csvUrl = convertSheetUrlToCsvUrl(url)

//   try {
//     const response = await fetch(csvUrl, { next: { revalidate: 3600 } })
//     if (!response.ok) {
//       console.error('Failed to fetch notebook data, status:', response.status)
//       return []
//     }

//     const csvText = await response.text()

//     const parsed = Papa.parse(csvText, {
//       header: false,
//       skipEmptyLines: true,
//       delimiter: ',',
//       quoteChar: '"',
//       escapeChar: '"',
//     })

//     if (parsed.errors.length > 0) {
//       console.error('CSV parsing errors for notebooks:', parsed.errors)
//     }

//     const rows = parsed.data as string[][]
//     const notebooks: Product[] = []
//     let idCounter = 0

//     for (let i = 0; i < rows.length; i++) {
//       const columns = rows[i]

//       if (!columns || columns.length < 3) continue

//       if (isNotebookProductRow(columns)) {
//         const nextRow = i + 1 < rows.length ? rows[i + 1] : null
//         let specs = ''

//         if (nextRow && isNotebookSpecsRow(nextRow)) {
//           specs = nextRow[2]?.trim() || ''
//           i++ // Skip specs row in the next iteration
//         }

//         const price = parsePrice(columns[1])
//         const model = cleanNotebookModel(columns[2])
//         const brand = extractBrandFromNotebook(columns[2])

//         if (!isNaN(price) && model) {
//           notebooks.push({
//             id: `notebook-${++idCounter}`,
//             category: 'notebooks',
//             brand: brand,
//             model: model,
//             price: price * 1.3,
//             details: specs,
//           })
//         }
//       }
//     }
//     return notebooks
//   } catch (error) {
//     console.error('Error fetching or parsing notebooks:', error)
//     return []
//   }
// }

// export async function fetchProductsForCategory(
//   category: ProductCategory,
//   url: string
// ): Promise<Product[]> {
//   if (category === 'notebooks') {
//     return fetchNotebooks(url)
//   }

//   const csvUrl = convertSheetUrlToCsvUrl(url)

//   try {
//     const response = await fetch(csvUrl, { next: { revalidate: 3600 } })

//     if (!response.ok) {
//       console.error(
//         `Failed to fetch ${category} data, status:`,
//         response.status
//       )
//       return []
//     }

//     const csvText = await response.text()

//     console.log('CSV TEXT: ', csvText)

//     const parsed = Papa.parse(csvText, {
//       header: false,
//       skipEmptyLines: true,
//       delimiter: ',',
//       quoteChar: '"',
//       escapeChar: '"',
//     })

//     if (parsed.errors.length > 0) {
//       console.error(`CSV parsing errors for ${category}:`, parsed.errors)
//     }

//     const rows = parsed.data as string[][]
//     const products: Product[] = []
//     let currentBrand = 'Sin Marca'
//     let currentDetails: string | null = null
//     let idCounter = 0

//     for (let i = 0; i < rows.length; i++) {
//       const columns = rows[i]

//       if (!columns || columns.length < 2) continue

//       if (isBrandRow(columns)) {
//         const brandInfo = extractBrandInfo(columns)
//         currentBrand = brandInfo.brand
//         currentDetails = brandInfo.details
//         continue
//       }

//       if (isProductRow(columns)) {
//         const price = parsePrice(columns[1])
//         // Model can be in column 0 or 2, depending on the sheet
//         let model = (columns[2]?.trim() || columns[0]?.trim() || '')
//           .replace(/📱|📷|🔭|💻|🖥️/g, '')
//           .trim()

//         if (!isNaN(price) && model) {
//           products.push({
//             id: `${category}-${++idCounter}`,
//             category: category,
//             brand: currentBrand,
//             model: model,
//             price: price * 1.3,
//             details: currentDetails,
//           })
//         }
//       }
//     }

//     console.log('Productos fetching: ', products)

//     return products
//   } catch (error) {
//     console.error(`Error fetching or parsing ${category}:`, error)
//     return []
//   }
// }
