import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ProductItemComponent } from '../product-item/product-item';

@Component({
  selector: 'app-new-arrivals',
  standalone: true,
  imports: [CommonModule, ProductItemComponent, HttpClientModule],
  templateUrl: './new-arrivals.html',
  styleUrls: ['./new-arrivals.css']
})
export class NewArrivalsComponent implements OnInit {
  allNewArrivals: any[] = [];    // Lưu toàn bộ sản phẩm có nhãn NewArrival
  filteredItems: any[] = [];     // Lưu sản phẩm sau khi đã lọc theo danh mục
  currentCategory: string = 'Quần áo'; // Mặc định hiển thị Quần áo
  
  private apiUrl = 'https://localhost:7113/api/Product';

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef 
  ) {}

  ngOnInit(): void {
    this.loadNewArrivals();
  }

  loadNewArrivals() {
    this.http.get<any[]>(this.apiUrl).subscribe({
      next: (data) => {
        // 1. Lọc sản phẩm có nhãn 'NewArrival' từ API
        this.allNewArrivals = data
          .filter(p => 
            p.labels && p.labels.some((l: string) => 
              l.toLowerCase().trim() === 'newarrival'
            )
          )
          .map(p => ({
            ...p,
            image: p.imageUrl, 
            price: p.variants && p.variants.length > 0 ? p.variants[0].price : 0
          }));

        console.log("Dữ liệu NewArrival gốc:", this.allNewArrivals);

        // 2. Tự động thực hiện lọc danh mục mặc định ngay sau khi tải xong dữ liệu
        this.filterByCategory(this.currentCategory);
      },
      error: (err) => console.error('Lỗi load hàng mới:', err)
    });
  }

  filterByCategory(category: string) {
    this.currentCategory = category;

    // Chuẩn hóa tên danh mục để so sánh (không phân biệt hoa thường/khoảng trắng)
    const target = category.toLowerCase().trim();

    this.filteredItems = this.allNewArrivals.filter(p => {
      // Ưu tiên lọc theo categoryName từ Backend
      const prodCatName = p.categoryName?.toLowerCase().trim() || '';
      
      // Hoặc lọc theo nhãn (labels) nếu categoryName bị trống
      const hasLabelMatch = p.labels && p.labels.some((l: string) => 
        l.toLowerCase().trim() === target
      );

      return prodCatName === target || hasLabelMatch;
    });

    console.log(`Đã lọc danh mục [${category}]:`, this.filteredItems.length, "sản phẩm");

    // Ép Angular cập nhật lại giao diện ngay lập tức
    this.cdr.detectChanges();
  }
}