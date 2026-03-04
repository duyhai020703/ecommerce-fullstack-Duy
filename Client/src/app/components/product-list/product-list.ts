import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ProductItemComponent } from '../product-item/product-item';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, ProductItemComponent],
  templateUrl: './product-list.html',
  styleUrls: ['./product-list.css']
})
export class ProductListComponent implements OnInit {
  allBestSellers: any[] = [];    // Lưu toàn bộ sản phẩm BestSeller từ API
  filteredItems: any[] = [];     // Danh sách hiển thị sau khi lọc theo danh mục
  currentCategory: string = 'Quần áo'; // Danh mục mặc định
  
  private apiUrl = 'https://localhost:7113/api/Product';

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.loadBestSellerProducts();
  }

  loadBestSellerProducts() {
    this.http.get<any[]>(this.apiUrl).subscribe({
      next: (data) => {
        // 1. Lọc BestSeller một cách an toàn và map lại dữ liệu
        this.allBestSellers = data.filter(product => 
          product.labels && product.labels.some((l: string) => 
            l.toLowerCase().replace(/\s/g, '') === 'bestseller'
          )
        ).map(product => ({
          ...product,
          image: product.imageUrl,
          price: product.variants && product.variants.length > 0 ? product.variants[0].price : 0
        }));

        console.log("Tổng BestSellers đã tải:", this.allBestSellers.length);

        // 2. Tự động lọc theo danh mục mặc định ngay khi có dữ liệu
        this.filterByCategory(this.currentCategory);
      },
      error: (err) => console.error('Lỗi khi gọi API Best Sellers:', err)
    });
  }

  filterByCategory(category: string) {
    this.currentCategory = category;
    
    // Chuẩn hóa chuỗi tìm kiếm
    const target = category.toLowerCase().trim();

    this.filteredItems = this.allBestSellers.filter(p => {
      // Ưu tiên khớp theo categoryName từ Backend
      const catName = p.categoryName?.toLowerCase().trim() || '';
      
      // Hoặc khớp theo nhãn (labels)
      const hasLabelMatch = p.labels && p.labels.some((l: string) => 
        l.toLowerCase().trim() === target
      );

      return catName === target || hasLabelMatch;
    });

    console.log(`Lọc BestSellers [${category}]:`, this.filteredItems.length, "kết quả");

    // Ép Angular cập nhật UI ngay lập tức (Xử lý lỗi F5 không load)
    this.cdr.detectChanges();
  }
}