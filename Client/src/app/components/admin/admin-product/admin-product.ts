import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-admin-product',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-product.html',
  styleUrl: './admin-product.css'
})
export class AdminProductComponent implements OnInit {
  products: any[] = [];
  categories: any[] = [];
  
  // Cấu hình các nhãn có sẵn để chọn
  availableLabels = ['BestSeller', 'NewArrival', 'SaleOff', 'LookBook'];

  // Biến kiểm soát trạng thái Sửa/Thêm
  isEditMode = false;
  currentProductId: any = null;

  // Cấu trúc newProduct mới đồng bộ với CSDL MongoDB
  newProduct: any = {
    name: '',
    Price: 0,
    imageUrl: '',
    categoryId: 0,
    labels: [],
    variants: []
  };

  apiUrlProduct = 'https://localhost:7113/api/Product';
  apiUrlCategory = 'https://localhost:7113/api/Category';

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.http.get<any[]>(this.apiUrlProduct).subscribe(data => {
      this.products = data;
      this.cdr.detectChanges();
    });
    this.http.get<any[]>(this.apiUrlCategory).subscribe(data => {
      this.categories = data;
      this.cdr.detectChanges();
    });
  }

  // --- QUẢN LÝ BIẾN THỂ (VARIANTS) ---
  addVariant() {
    if (!this.newProduct.variants) this.newProduct.variants = [];
    this.newProduct.variants.push({
      color: '',
      size: '',
      price: 0,
      stock: 0,
      sku: ''
    });
  }

  removeVariant(index: number) {
    this.newProduct.variants.splice(index, 1);
  }

  // --- QUẢN LÝ NHÃN (LABELS) ---
  toggleLabel(label: string) {
    if (!this.newProduct.labels) this.newProduct.labels = [];
    const index = this.newProduct.labels.indexOf(label);
    if (index > -1) {
      this.newProduct.labels.splice(index, 1); // Bỏ chọn
    } else {
      this.newProduct.labels.push(label); // Thêm chọn
    }
  }

  // --- CÁC HÀNH ĐỘNG CHÍNH ---
  saveProduct() {
    console.log("--- DỮ LIỆU GỬI VỀ C# ---");
  console.log("URL ID:", this.currentProductId);
  console.log("Body JSON:", JSON.stringify(this.newProduct, null, 2)); // In đẹp để dễ đọc
  console.log("--------------------------");
    if (this.newProduct.categoryId === 0 || !this.newProduct.name) {
      alert('Vui lòng nhập tên và chọn danh mục!');
      return;
    }

    if (this.isEditMode) {
      // API Cập nhật (PUT)
      this.http.put(`${this.apiUrlProduct}/${this.currentProductId}`, this.newProduct).subscribe({
        next: () => {
          alert('Cập nhật sản phẩm thành công!');
          this.afterSave();
        },
        error: (err) => alert('Lỗi cập nhật: ' + err.message)
      });
    } else {
      // API Thêm mới (POST)
      this.http.post(this.apiUrlProduct, this.newProduct).subscribe({
        next: () => {
          alert('Thêm sản phẩm thành công!');
          this.afterSave();
        },
        error: (err) => alert('Lỗi thêm mới: ' + err.message)
      });
    }
  }

  afterSave() {
    this.loadData();
    this.resetForm();
  }

  editProduct(product: any) {
    this.isEditMode = true;
    this.currentProductId = product.id;
    // Deep copy để tránh việc chỉnh sửa trên form làm thay đổi dữ liệu bảng khi chưa lưu
    this.newProduct = JSON.parse(JSON.stringify(product));
  }

  deleteProduct(id: any) {
    if (confirm('Bạn chắc chắn muốn xóa sản phẩm này?')) {
      this.http.delete(`${this.apiUrlProduct}/${id}`).subscribe(() => this.loadData());
    }
  }

  resetForm() {
    this.isEditMode = false;
    this.currentProductId = null;
    this.newProduct = {
      name: '',
      basePrice: 0,
      imageUrl: '',
      categoryId: 0,
      labels: [],
      variants: []
    };
  }

  getCategoryName(id: any): string {
    const cate = this.categories.find(c => c.id === id);
    return cate ? cate.name : 'Chưa phân loại';
  }
  getMinPrice(product: any): number {
  if (!product.variants || product.variants.length === 0) return 0;
  return Math.min(...product.variants.map((v: any) => v.price || 0));
}

// Tìm giá cao nhất trong các biến thể
getMaxPrice(product: any): number {
  if (!product.variants || product.variants.length === 0) return 0;
  return Math.max(...product.variants.map((v: any) => v.price || 0));
}
}