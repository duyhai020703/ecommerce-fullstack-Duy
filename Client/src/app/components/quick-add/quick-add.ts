import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

// Khai báo bootstrap để dùng lệnh ẩn/hiện modal
declare var bootstrap: any;

@Component({
  selector: 'app-quick-add',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './quick-add.html',
  styleUrls: ['./quick-add.css']
})
export class QuickAddComponent {
  product: any;           // Chứa dữ liệu sản phẩm
  selectedSize: string = ''; // Size khách chọn
  quantity: number = 1;      // Số lượng mặc định là 1

  // 1. Hàm mở Modal (Được gọi từ ProductItem)
 open(productData: any) {
  this.product = productData;
  this.selectedSize = ''; 
  this.quantity = 1;      

  // Duy dùng setTimeout 1 chút để Angular kịp cập nhật ID vào DOM
  setTimeout(() => {
    // Gọi đúng cái ID có chứa mã sản phẩm
    const modalId = 'quickAddModal-' + this.product.id;
    const modalElement = document.getElementById(modalId);
    
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    }
  }, 50); 
}
  // 2. Hàm thay đổi số lượng (+ / -)
  changeQty(value: number) {
    const newQty = this.quantity + value;
    if (newQty >= 1) {
      this.quantity = newQty;
    }
  }

  // 3. Hàm xác nhận Thêm vào giỏ
  confirmAdd() {
    if (!this.selectedSize) {
      alert("Duy ơi, bạn chưa chọn kích thước (Size) kìa!");
      return;
    }

    // Tạo object thông tin giỏ hàng để lưu
    const cartItem = {
      productId: this.product.id,
      name: this.product.name,
      imageUrl: this.product.imageUrl,
      size: this.selectedSize,
      quantity: this.quantity,
      price: this.getSelectedPrice()
    };

    console.log('Đã thêm vào giỏ hàng thành công:', cartItem);
    
    // TODO: Lưu vào LocalStorage hoặc gọi API giỏ hàng ở đây
    
    // Sau khi thêm xong thì đóng modal
    const modalElement = document.getElementById('quickAddModal');
    const modal = bootstrap.Modal.getInstance(modalElement);
    modal.hide();
    
    alert(`Đã thêm ${this.quantity} sản phẩm size ${this.selectedSize} vào giỏ!`);
  }

  // Hàm phụ để lấy giá của size đã chọn (nếu các size giá khác nhau)
  getSelectedPrice(): number {
    const variant = this.product?.variants?.find((v: any) => v.size === this.selectedSize);
    return variant ? variant.price : (this.product?.price || 0);
  }
}