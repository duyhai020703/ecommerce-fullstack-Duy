import { Component, Input, ViewChild } from '@angular/core'; // 1. Dùng ViewChild thay vì Output
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { QuickAddComponent } from '../quick-add/quick-add'; // Đảm bảo đường dẫn này đúng với file của Duy
import { CartService} from '../../services/cart.service';
import { ProductVariant,Product } from '../../Models/product.model'; // Đường dẫn tới file interface của Duy
@Component({
  selector: 'app-product-item',
  standalone: true,
  imports: [CommonModule, RouterModule, QuickAddComponent],
  templateUrl: './product-item.html',
  styleUrls: ['./product-item.css']
})
export class ProductItemComponent {
  @Input() product: any;
  
  // 2. "Túm" lấy component QuickAdd đang nằm trong file HTML
  @ViewChild('quickAddChild') quickAddChild!: QuickAddComponent;
constructor(public cartService: CartService) {}
  addToCart(product: Product) {
  // 1. Kiểm tra số lượng biến thể (variants)
  const hasMultipleVariants = product.variants && product.variants.length > 1;

  if (hasMultipleVariants) {
    // TRƯỜNG HỢP 1: Có nhiều biến thể (ví dụ: nhiều size hoặc nhiều màu)
    // Mở Modal Quick-Add để khách chọn đúng SKU họ muốn
    if (this.quickAddChild) {
      this.quickAddChild.open(product);
      console.log('Sản phẩm có nhiều biến thể, mở Modal cho Duy chọn:', product.name);
    } else {
      console.error('Không tìm thấy #quickAddChild trong HTML');
    }
  } else if (product.variants && product.variants.length === 1) {
    // TRƯỜNG HỢP 2: Chỉ có duy nhất 1 biến thể
    const soleVariant = product.variants[0];

    // Tạo object CartItem khớp với Backend Duy đã viết
    const itemToAdd = {
      productId: product.id,
      sku: soleVariant.sku,        // Lấy SKU duy nhất
      quantity: 1,                 // Mặc định là 1 khi bấm nút thêm nhanh
      price: soleVariant.price     // (Lưu ý: Backend Duy nên tự lấy lại giá từ DB cho an toàn)
    };

    // Gọi Service gửi lên Backend .NET
    this.cartService.addToCart(itemToAdd).subscribe({
      next: (res) => {
        console.log('Đã thêm thẳng vào giỏ hàng thành công:', product.name);
        // Duy có thể dùng Toastr để báo cho xịn xò
        alert(`Đã thêm ${product.name} vào giỏ hàng!`);
      },
      error: (err) => {
        console.error('Lỗi khi thêm vào giỏ:', err);
        if (err.status === 401) {
          alert("Duy ơi, hình như chưa đăng nhập nên không thêm được đồ rồi!");
        }
      }
    });
  } else {
    // Trường hợp mảng variants rỗng
    console.warn('Sản phẩm này hiện chưa có biến thể nào để bán:', product.name);
  }
}

  getMinPrice(product: any): number {
    if (!product.variants || product.variants.length === 0) {
      return product.price || 0;
    }
    return Math.min(...product.variants.map((v: any) => v.price || 0));
  }
}