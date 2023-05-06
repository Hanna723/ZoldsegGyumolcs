import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Product } from '../../shared/models/Product';
import { ProductService } from 'src/app/shared/services/product.service';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Order } from 'src/app/shared/models/Order';

@Component({
  selector: 'app-preview',
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.scss'],
})
export class PreviewComponent implements OnInit {
  @Output() addEvent = new EventEmitter<string>();
  product?: Product;
  productForm: FormGroup = new FormGroup({
    amount: new FormControl('', [
      Validators.required,
      Validators.min(0),
      Validators.pattern(/^\d+$/),
    ]),
  });

  constructor(private productService: ProductService, private router: Router) {}

  ngOnInit(): void {
    const url = this.router.url.split('/');
    this.productForm.setValue({ amount: 1 });
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

  onSubmit() {
    const localOrder = localStorage.getItem('order');
    if (localOrder && this.product) {
      let order: Order = JSON.parse(localOrder);
      let alreadyOrdered = order.products.find((el) => {
        return el.id === this.product?.id;
      });

      if (alreadyOrdered) {
        alreadyOrdered.amount += this.productForm.controls['amount'].value;
      } else {
        order.products.push({
          id: this.product?.id,
          amount: this.productForm.controls['amount'].value,
        });
      }

      order.price +=
        this.productForm.controls['amount'].value * this.product.price;
      localStorage.setItem('order', JSON.stringify(order));
      this.addEvent.emit('added');
    }
  }
}
