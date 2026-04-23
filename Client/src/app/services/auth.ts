import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoginRequest, LoginResponse } from '../Models/user.model';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'https://localhost:7113/api/Auth'; // <--- Sửa Port ở đây

  constructor(private http: HttpClient) { }

  login(data: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, data).pipe(
      tap(res => {
        // Đăng nhập thành công thì lưu Token vào bộ nhớ trình duyệt
        localStorage.setItem('token', res.token);
        localStorage.setItem('user', JSON.stringify(res));
      })
    );
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  getToken() {
    return localStorage.getItem('token');
  }
  // Trong auth.service.ts
facebookLogin(fbToken: string): Observable<any> {
  // Gửi object { token: fbToken } để khớp với FacebookLoginRequest bên Backend
  return this.http.post<any>(`${this.apiUrl}/facebook-login`, { token: fbToken }).pipe(
    tap(res => {
      localStorage.setItem('token', res.token);
      localStorage.setItem('user', JSON.stringify(res));
    })
  );
}
}