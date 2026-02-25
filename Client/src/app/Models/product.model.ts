export interface ProductVariant {
  sku: string;
  color: string;
  size: string;
  stockQuantity: number;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  imageUrl?: string;
  categoryName?: string;
  variants: ProductVariant[];
}