import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Api {
  // ⚠️ LƯU Ý: Thay số 7113 bằng số port trong link Swagger của bạn
  // Ví dụ: https://localhost:5024/api/products
  private apiUrl = 'https://localhost:7113/api/Product';

  constructor(private http: HttpClient) { }

  // Hàm này thực hiện việc gọi điện sang Server
  getProducts(): Observable<any> {
    return this.http.get(this.apiUrl);
  }
}