import { Component, OnInit ,ChangeDetectorRef} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './product-detail.html',
  styleUrls: ['./product-detail.css']
})
export class ProductDetailComponent implements OnInit {
  product: any;
  selectedSize: string = '';
  quantity: number = 1;

  constructor(private route: ActivatedRoute, private http: HttpClient,private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    // Lấy ID từ URL (ví dụ: /product/123)
    const id = this.route.snapshot.paramMap.get('id');
    this.loadProduct(id);
  }

  loadProduct(id: string | null) {
    if (id) {
      this.http.get(`https://localhost:7113/api/Product/${id}`).subscribe(res => {
        this.product = res;
        this.cdr.detectChanges();

        // Mock size nếu DB chưa có
        if (!this.product.sizes) this.product.sizes = ['XS', 'S', 'M', 'L', 'XL'];
      });
    }
  }

  selectSize(size: string) {
    this.selectedSize = size;
  }

  updateQuantity(val: number) {
    if (this.quantity + val >= 1) this.quantity += val;
  }
}