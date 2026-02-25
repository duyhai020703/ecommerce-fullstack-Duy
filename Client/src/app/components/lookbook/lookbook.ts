import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductItemComponent } from '../product-item/product-item';

@Component({
  selector: 'app-lookbook',
  standalone: true,
  imports: [CommonModule, ProductItemComponent],
  templateUrl: './lookbook.html',
  styleUrls: ['./lookbook.css']
})
export class LookbookComponent {
  items = [
    { name: 'Puffer Jacket Short', price: 4200000, image: 'https://image.msscdn.net/images/goods_img/20220824/2739345/2739345_1_500.jpg' },
    { name: 'Beanie NY Logo', price: 650000, image: 'https://image.msscdn.net/images/goods_img/20210427/1921319/1921319_2_500.jpg' },
    { name: 'Jogger Pants Basic', price: 1800000, image: 'https://image.msscdn.net/images/goods_img/20210826/2088806/2088806_2_500.jpg' }
  ];
}