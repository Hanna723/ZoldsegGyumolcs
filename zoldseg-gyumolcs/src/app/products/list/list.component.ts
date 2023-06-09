import { Component, OnInit } from '@angular/core';

import { ProductService } from 'src/app/shared/services/product.service';
import { Product } from '../../shared/models/Product';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class ListComponent implements OnInit {
  products?: Array<Product>;

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.productService.getAll().subscribe((data: Array<Product>) => {
      this.products = data;
      this.products.forEach((prod) => {
        this.productService.getImage(prod.image).subscribe((img) => {
          prod.imageUrl = img;
        });
      });
    });
  }
}
