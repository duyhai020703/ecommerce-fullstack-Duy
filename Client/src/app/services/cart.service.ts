import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth'; // Import AuthService để lấy Token

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private apiUrl = 'https://localhost:7113/api/Cart'; // Sửa Port của bạn

  constructor(private http: HttpClient, private authService: AuthService) { }

  // Hàm phụ: Tự động lấy Token gắn vào Header
  private getHeaders() {
    const token = this.authService.getToken();
    return {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${token}` 
      })
    };
  }

  addToCart(item: { productId: string, sku: string, quantity: number }) {
    return this.http.post(`${this.apiUrl}/add`, item, this.getHeaders());
  }

  getCart() {
    return this.http.get(this.apiUrl, this.getHeaders());
  }
}