import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { HttpClientModule } from '@angular/common/http';
import { Api} from './services/api'; // Import cái file api.ts của bạn

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App implements OnInit {
  products: any[] = []; // Cái túi để đựng dữ liệu lấy về

  // Tiêm (Inject) cái api.ts vào để dùng
  constructor(private apiService: Api) {}

  ngOnInit() {
    // Gọi hàm lấy sản phẩm
    this.apiService.getProducts().subscribe({
      next: (data) => {
        this.products = data;
        console.log('Đã lấy được hàng:', data);
      },
      error: (loi) => {
        console.error('Lỗi khi gọi API:', loi);
      }
    });
  }
}