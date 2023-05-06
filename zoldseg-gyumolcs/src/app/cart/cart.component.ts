import { AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { Order } from '../shared/models/Order';
import { ProductService } from '../shared/services/product.service';
import { OrderService } from '../shared/services/order.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from 'src/app/shared/dialog/dialog.component';
import { FormGroup } from '@angular/forms';
import { MatSelectionList } from '@angular/material/list';

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
        let product = this.productService.getById(prod.id).subscribe((data) => {
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

  onSubmit() {
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

  createEmptyOrder(uid: string) {
    const order: Order = {
      user: uid,
      products: [],
      price: 0,
      time: new Date,
    };

    localStorage.setItem('order', JSON.stringify(order));
  }

  onDelete() {
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
