import { Component, OnInit } from '@angular/core';
import { Product } from '../../shared/models/Product';
import { ProductService } from 'src/app/shared/services/product.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-preview',
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.scss'],
})
export class PreviewComponent implements OnInit {
  product?: Product;

  constructor(private productService: ProductService, private router: Router) {}

  ngOnInit(): void {
    const url = this.router.url.split('/');
    this.productService
      .getById(url[url.length - 1])
      .subscribe((data: Product | undefined) => {
        this.product = data;
        if (this.product) {
          this.productService.getImage(this.product.image).subscribe((img) => {
            if (this.product) {
              this.product.imageUrl = img;
            }
          });
        }
      });
  }
}
