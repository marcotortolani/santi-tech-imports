export type ProductCategory = 'celulares' | 'cámaras' | 'lentes y flashes' | 'ipads y tablets' | 'macbooks e imacs' | 'notebooks' | 'varios';

export interface Product {
  id: string;
  category: ProductCategory;
  brand: string;
  model: string;
  price: number;
  details: string | null;
}
