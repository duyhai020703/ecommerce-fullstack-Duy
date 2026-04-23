import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CartService {
  private apiUrl = 'https://localhost:7113/api/Cart'; 
  private cartCount = new BehaviorSubject<number>(0);
  cartCount$ = this.cartCount.asObservable(); // Header sẽ subscribe cái này

  constructor(private http: HttpClient) {
    this.refreshCartCount(); // Vừa vào web là check số lượng ngay
  }

  // Lấy giỏ hàng từ server
  getCart() {
    return this.http.get<any>(this.apiUrl).pipe(
      tap(cart => this.cartCount.next(this.calculateTotal(cart.items)))
    );
  }

  // Gọi API add mà Duy vừa viết ở Backend
  addToCart(item: any) {
    return this.http.post(`${this.apiUrl}/add`, item).pipe(
      tap(() => this.refreshCartCount()) // Thêm xong thì cập nhật lại số lượng
    );
  }

  private refreshCartCount() {
    this.getCart().subscribe();
  }

  private calculateTotal(items: any[]): number {
    return items.reduce((total, item) => total + item.quantity, 0);
  }
}