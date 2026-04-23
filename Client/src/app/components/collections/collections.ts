import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ActivatedRoute, RouterModule } from '@angular/router';

interface Product {
  id: string;
  name: string;
  imageUrl: string;
  categoryName?: string;
  labels: string[];
  variants: any[];
  image?: string; // Dùng cho UI
  price?: number; // Dùng cho UI
}

@Component({
  selector: 'app-collections',
  standalone: true,
  imports: [CommonModule, HttpClientModule, RouterModule],
  templateUrl: './collections.html',
  styleUrls: ['./collections.css']
})
export class CollectionsComponent implements OnInit {
  allProducts: Product[] = [];
  filteredProducts: Product[] = [];
  categoryTitle: string = 'Tất cả sản phẩm';
  currentCategory: string = '';
  
  private apiUrl = 'https://localhost:7113/api/Product';
private removeAccents(str: string): string {
  return str.normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/đ/g, 'd').replace(/Đ/g, 'D');
}
  constructor(
    private http: HttpClient, 
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadInitialData();
  }

  loadInitialData() {
    this.http.get<Product[]>(this.apiUrl).subscribe({
      next: (data) => {
        // Tiền xử lý dữ liệu từ API
        this.allProducts = data.map(p => ({
          ...p,
          image: p.imageUrl,
          price: p.variants?.[0]?.price || 0
        }));

        // Sau khi có data mới bắt đầu lắng nghe URL
        this.watchRoute();
      },
      error: (err) => console.error("Lỗi tải sản phẩm:", err)
    });
  }

  watchRoute() {
    this.route.queryParams.subscribe(params => {
      this.currentCategory = params['category'] || '';
      this.applyFilter();
    });
  }

 applyFilter() {
  if (!this.currentCategory) {
    this.filteredProducts = [...this.allProducts];
    this.categoryTitle = 'Tất cả sản phẩm';
  } else {
    // 1. Chuẩn hóa category từ URL: "quan-ao" -> "quan ao"
    const urlTarget = this.removeAccents(this.currentCategory.replace(/-/g, ' ')).toLowerCase().trim();
    
    this.filteredProducts = this.allProducts.filter(p => {
      if (!p.categoryName) return false;

      // 2. Chuẩn hóa category từ DB: "Quần áo" -> "quan ao"
      const dbTarget = this.removeAccents(p.categoryName).toLowerCase().trim();
      
      return dbTarget === urlTarget;
    });

    this.updateTitle(this.currentCategory);
  }
  
  console.log(`Kết quả lọc cho [${this.currentCategory}]:`, this.filteredProducts.length);
  this.cdr.detectChanges();
}

  updateTitle(cat: string) {
    const map: { [key: string]: string } = {
      'quan-ao': 'Quần Áo',
      'giay-dep': 'Giày Dép',
      'tui-vi': 'Túi & Ví',
      'phu-kien': 'Phụ Kiện'
    };
    this.categoryTitle = map[cat] || cat.toUpperCase();
  }
}