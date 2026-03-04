import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductItemComponent } from '../product-item/product-item';
import { HttpClient, HttpClientModule } from '@angular/common/http';

// Định nghĩa Interface để code sạch và dễ quản lý hơn
interface Product {
  id: string;
  name: string;
  imageUrl: string;
  categoryName?: string;
  labels: string[];
  variants: any[];
  // Các trường ảo dùng cho UI
  image?: string;
  price?: number;
}

@Component({
  selector: 'app-lookbook',
  standalone: true,
  imports: [CommonModule, ProductItemComponent, HttpClientModule],
  templateUrl: './lookbook.html',
  styleUrls: ['./lookbook.css']
})
export class LookbookComponent implements OnInit {
  allProducts: Product[] = [];
  filteredItems: Product[] = [];
  currentCategory: string = 'Quần áo'; // Mặc định chọn danh mục này khi load
  private apiUrl = 'https://localhost:7113/api/Product';

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.loadLookbookProducts();
  }

  loadLookbookProducts() {
    this.http.get<Product[]>(this.apiUrl).subscribe({
      next: (data) => {
        // 1. Lưu và tiền xử lý dữ liệu
        this.allProducts = data.filter(p => 
          p.labels && p.labels.some((l: string) => l.toLowerCase() === 'lookbook')
        ).map(p => ({
          ...p,
          image: p.imageUrl, // Map imageUrl sang image cho ProductItemComponent
          price: p.variants?.[0]?.price || 0 // Lấy giá từ biến thể đầu tiên
        }));

        console.log("Tổng SP Lookbook đã tải:", this.allProducts.length);

        // 2. Tự động thực hiện lọc theo danh mục mặc định ngay sau khi có dữ liệu
        this.filterByCategory(this.currentCategory);
      },
      error: (err) => console.error("Lỗi API Lookbook:", err)
    });
  }

  filterByCategory(category: string) {
    this.currentCategory = category;
    
    console.log(`--- ĐANG LỌC DANH MỤC: [${category}] ---`);

    // Chuẩn hóa chuỗi tìm kiếm (Bỏ dấu cách thừa, chuyển về chữ thường)
    const searchTarget = category.trim().toLowerCase();

    this.filteredItems = this.allProducts.filter(p => {
      // Chuẩn hóa dữ liệu từ API để so sánh chính xác
      const prodCat = p.categoryName?.trim().toLowerCase() || '';
      
      // 1. Kiểm tra theo trường categoryName
      const isCategoryMatch = prodCat === searchTarget;
      
      // 2. Kiểm tra trong mảng labels (phòng trường hợp DB lưu ở đây)
      const isLabelMatch = p.labels && p.labels.some(l => l.trim().toLowerCase() === searchTarget);
      
      // Debug chi tiết từng sản phẩm
      if (isCategoryMatch || isLabelMatch) {
        console.log(`✅ KHỚP: [${p.name}]`);
      }

      return isCategoryMatch || isLabelMatch;
    });

    console.log(`=> KẾT QUẢ: Tìm thấy ${this.filteredItems.length} sản phẩm`);
    
    // Ép Angular vẽ lại UI - Giải quyết lỗi F5 không hiện sản phẩm
    this.cdr.detectChanges();
    this.cdr.markForCheck();
  }
}