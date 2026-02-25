import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login';
import { ProductListComponent } from './components/product-list/product-list';
import { HomeComponent } from './components/home/home';
import { AdminLayoutComponent } from './components/admin/admin-layout/admin-layout';
import { AdminCategoryComponent } from './components/admin/admin-category/admin-category';
import { AdminProductComponent } from './components/admin/admin-product/admin-product';
export const routes: Routes = [
  { path: '', component: HomeComponent }, // <--- Mặc định vào trang Home chứa tất cả các phần trên
  { path: 'login', component: LoginComponent },
  { path: 'shop', component: ProductListComponent }, // Trang danh sách sản phẩm riêng
  // Phải có đoạn này trong mảng routes:
{ 
    path: 'admin', 
    component: AdminLayoutComponent, 
    children: [
      // Khi vào /admin thì tự động chuyển hướng vào /admin/products
      { path: '', redirectTo: 'Product', pathMatch: 'full' }, 
      
      // Định nghĩa đường dẫn con
      { path: 'Product', component: AdminProductComponent },    // Link: /admin/products
      { path: 'Category', component: AdminCategoryComponent }  // Link: /admin/categories
    ]
  },

  // 3. Nếu gõ linh tinh thì về trang chủ
  { path: '**', redirectTo: '' }
];