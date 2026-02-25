export interface CartItem {
  productId: string;
  sku: string;
  quantity: number;
  // Các trường dưới này dùng để hiển thị (nếu API trả về)
  productName?: string; 
  price?: number;
}

export interface Cart {
  id: string;
  userId: string;
  items: CartItem[];
  totalAmount?: number;
}