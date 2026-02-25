import { Component, OnInit ,ChangeDetectorRef} from '@angular/core';
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
  
  newProduct = {
    name: '',
    price: 0,
    imageUrl: '',
    categoryId: 0
  };

  apiUrlProduct = 'https://localhost:7113/api/Product';
  apiUrlCategory = 'https://localhost:7113/api/Category';

  constructor(private http: HttpClient,private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.http.get<any[]>(this.apiUrlProduct).subscribe(data => {
      this.products = data;
      this.cdr.detectChanges(); // 3. Ép giao diện cập nhật
      console.log('Đã cập nhật UI cho Product');
    });
   this.http.get<any[]>(this.apiUrlCategory).subscribe(data => {
      this.categories = data;
      this.cdr.detectChanges(); // 3. Ép giao diện cập nhật
    });
  }

  addProduct() {
    if (this.newProduct.categoryId === 0 || !this.newProduct.name) {
      alert('Vui lòng nhập tên và chọn danh mục!');
      return;
    }
    
    this.http.post(this.apiUrlProduct, this.newProduct).subscribe({
      next: () => {
        alert('Thêm sản phẩm thành công!');
        this.loadData();
        // Reset form về mặc định
        this.newProduct = { name: '', price: 0, imageUrl: '', categoryId: 0 };
      },
      error: (err) => alert('Lỗi: ' + err.message)
    });
  }

  deleteProduct(id: number) {
    if(confirm('Bạn chắc chắn muốn xóa sản phẩm này?')) {
      this.http.delete(`${this.apiUrlProduct}/${id}`).subscribe(() => this.loadData());
    }
  }

  getCategoryName(id: number): string {
    const cate = this.categories.find(c => c.id === id);
    return cate ? cate.name : 'Chưa phân loại';
  }
}