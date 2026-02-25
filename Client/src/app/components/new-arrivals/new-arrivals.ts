import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductItemComponent } from '../product-item/product-item';

@Component({
  selector: 'app-new-arrivals',
  standalone: true,
  imports: [CommonModule, ProductItemComponent],
  templateUrl: './new-arrivals.html',
  styleUrls: ['./new-arrivals.css']
})
export class NewArrivalsComponent {
  newProducts = [
    { name: 'T-Shirt Graffiti', price: 990000, image: 'https://image.msscdn.net/images/goods_img/20230224/3110271/3110271_16772037494548_500.jpg' },
    { name: 'Hoodie Overfit', price: 2100000, image: 'https://image.msscdn.net/images/goods_img/20220824/2739345/2739345_1_500.jpg' },
    { name: 'Varsity Jacket', price: 5500000, image: 'https://image.msscdn.net/images/goods_img/20210826/2088806/2088806_2_500.jpg' },
    { name: 'Denim Shorts', price: 1500000, image: 'https://image.msscdn.net/images/goods_img/20200818/1553932/1553932_1_500.jpg' }
  ];
}