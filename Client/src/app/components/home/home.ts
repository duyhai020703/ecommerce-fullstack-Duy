import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeroBannerComponent } from '../hero-banner/hero-banner';
import { ProductListComponent } from '../product-list/product-list';
import { LookbookComponent } from '../lookbook/lookbook';
import { NewArrivalsComponent } from '../new-arrivals/new-arrivals';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    HeroBannerComponent,
    ProductListComponent,
    LookbookComponent,
    NewArrivalsComponent
  ],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class HomeComponent {}