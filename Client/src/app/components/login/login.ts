import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class LoginComponent {
  // Dữ liệu mặc định để test nhanh
  email = 'khach@gmail.com'; 
  password = '123456';

  constructor(
    private auth: AuthService, 
    private router: Router
  ) {}

  // Đăng nhập bằng tài khoản nội bộ
  onLogin() {
    this.auth.login({ email: this.email, password: this.password }).subscribe({
      next: (res) => {
        alert(`Đăng nhập thành công! Chào ${res.fullName}`);
        this.router.navigate(['/shop']); 
      },
      error: (err) => alert('Lỗi: ' + (err.error?.message || err.message))
    });
  }

  // Đăng nhập bằng Facebook qua SDK
  loginWithFacebook() {
    if (!(window as any).FB) {
      alert('Facebook SDK chưa sẵn sàng. Vui lòng kiểm tra index.html!');
      return;
    }

    (window as any).FB.login((response: any) => {
      if (response.authResponse) {
        const fbToken = response.authResponse.accessToken;
        
        // Chuyển việc gọi API sang AuthService để quản lý tập trung
        this.auth.facebookLogin(fbToken).subscribe({
          next: (res) => {
            alert(`Chào mừng ${res.fullName} đã đăng nhập bằng Facebook!`);
            this.router.navigate(['/shop']);
          },
          error: (err) => alert('Lỗi xác thực Facebook: ' + (err.error?.message || err.message))
        });
      }
    }, { scope: 'email' });
  }
}