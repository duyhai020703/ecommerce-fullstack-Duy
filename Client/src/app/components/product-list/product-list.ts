import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductItemComponent } from '../product-item/product-item';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, ProductItemComponent],
  templateUrl: './product-list.html',
  styleUrls: ['./product-list.css']
})
export class ProductListComponent {
  products = [
    { name: 'Bigball Chunky A', price: 2390000, image: 'https://image.msscdn.net/images/goods_img/20220302/2393847/2393847_4_500.jpg' },
    { name: 'Classic Monogram', price: 1890000, image: 'https://image.msscdn.net/images/goods_img/20210826/2088806/2088806_2_500.jpg' },
    { name: 'NY Yankees Cap', price: 890000, image: 'https://image.msscdn.net/images/goods_img/20200818/1553932/1553932_1_500.jpg' },
    { name: 'Chunky Liner High', price: 3590000, image: 'https://image.msscdn.net/images/goods_img/20220114/2307527/2307527_2_500.jpg' },
    { name: 'Cross Bag Mini', price: 1590000, image: 'https://image.msscdn.net/images/goods_img/20230224/3110271/3110271_16772037494548_500.jpg' },
  ];
}