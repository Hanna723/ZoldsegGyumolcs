import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnInit,
  ViewChild,
  Output,
  EventEmitter,
} from '@angular/core';

import { FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSelectionList } from '@angular/material/list';

import { ProductService } from '../shared/services/product.service';
import { OrderService } from '../shared/services/order.service';
import { Order } from '../shared/models/Order';
import { DialogComponent } from 'src/app/shared/dialog/dialog.component';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
})
export class CartComponent implements OnInit, AfterViewInit {
  @Output() removeEvent = new EventEmitter<string>();
  @ViewChild('orderList') orderList?: MatSelectionList;
  orderForm: FormGroup = new FormGroup({});
  deleteForm: FormGroup = new FormGroup({});
  order?: Order;
  extendedOrder?: {
    id: string;
    user: string;
    products: Array<{
      id: string;
      amount: number;
      name: string;
      price: number;
    }>;
    price: number;
    time: number;
  };

  constructor(
    private productService: ProductService,
    private orderService: OrderService,
    public dialog: MatDialog,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const localOrder = localStorage.getItem('order');
    if (localOrder) {
      this.order = JSON.parse(localOrder);
      this.extendedOrder = JSON.parse(localOrder);

      this.extendedOrder?.products.forEach((prod) => {
        this.productService.getById(prod.id).subscribe((data) => {
          if (data) {
            prod.name = data.name;
            prod.price = data.price * prod.amount;
          }
        });
      });
    }
  }

  ngAfterViewInit() {
    this.changeDetectorRef.detectChanges();
  }

  onSubmit(): void {
    const localUser = localStorage.getItem('user');
    if (this.order && localUser) {
      this.order.time = new Date();
      this.orderService.create(this.order).then(() => {
        this.openDialog();
        this.createEmptyOrder(JSON.parse(localUser).uid);
        this.order = undefined;
        this.extendedOrder = undefined;
        this.removeEvent.emit('removed');
      });
    }
  }

  openDialog(): void {
    this.dialog.open(DialogComponent, {
      width: '350px',
      height: '130px',
      data: {
        title: 'Order sent!',
        button: 'Ok',
      },
    });
  }

  createEmptyOrder(uid: string): void {
    const order: Order = {
      user: uid,
      products: [],
      price: 0,
      time: new Date(),
    };

    localStorage.setItem('order', JSON.stringify(order));
  }

  onDelete(): void {
    const selected = this.orderList?.selectedOptions.selected;
    selected?.forEach((el) => {
      this.productService.getById(el.value).subscribe((data) => {
        if (this.order && this.extendedOrder && data) {
          const prod = this.order.products.find((prod) => {
            return prod.id == data.id;
          });
          if (prod) {
            this.order.price -= data?.price * prod.amount;
            this.extendedOrder.price -= data.price * prod.amount;
          }

          this.order.products = this.order.products.filter((prod) => {
            return prod.id !== el.value;
          });
          this.extendedOrder.products = this.extendedOrder.products.filter(
            (prod) => {
              return prod.id !== el.value;
            }
          );
        }
        localStorage.setItem('order', JSON.stringify(this.order));
        this.removeEvent.emit('removed');
      });
    });
  }
}
