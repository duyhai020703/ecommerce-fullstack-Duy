import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // <--- QUAN TRỌNG
import { AuthService } from '../../services/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule], // <--- Nhớ dòng này
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class LoginComponent {
  email = 'khach@gmail.com'; // Điền sẵn cho nhanh test
  password = '123456';

  constructor(private auth: AuthService, private router: Router) {}

  onLogin() {
    this.auth.login({ email: this.email, password: this.password }).subscribe({
      next: (res) => {
        alert('Đăng nhập thành công! Chào ' + res.fullName);
        this.router.navigate(['/shop']); // Chuyển sang trang Shop
      },
      error: (err) => alert('Lỗi: ' + err.message)
    });
  }
}