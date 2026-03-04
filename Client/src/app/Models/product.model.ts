export interface ProductVariant {
  sku: string;
  color: string;
  size: string;
  price: number;
  stockQuantity: number;
}

export interface Product {
  id: string;
  name: string;
  imageUrl?: string;
  categoryName?: string;
  variants: ProductVariant[];
}