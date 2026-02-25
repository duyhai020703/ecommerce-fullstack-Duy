import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-admin-category',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-category.html',
  styleUrl: './admin-category.css'
})
export class AdminCategoryComponent implements OnInit {
  categories: any[] = [];
  newCategoryName = '';
  // 👇 Sửa PORT nếu cần
  apiUrl = 'https://localhost:7113/api/Category'; 

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadCategories();
  }

  loadCategories() {
    this.http.get<any[]>(this.apiUrl).subscribe(data => this.categories = data);
  }

  addCategory() {
    if (!this.newCategoryName.trim()) return;
    
    this.http.post(this.apiUrl, { name: this.newCategoryName }).subscribe({
      next: () => {
        this.loadCategories();
        this.newCategoryName = '';
        alert('Thêm thành công!');
      },
      error: (err) => alert('Lỗi: ' + err.message)
    });
  }

  deleteCategory(id: number) {
    if(confirm('Bạn có chắc muốn xóa danh mục này?')) {
      this.http.delete(`${this.apiUrl}/${id}`).subscribe(() => {
        this.loadCategories();
      });
    }
  }
}