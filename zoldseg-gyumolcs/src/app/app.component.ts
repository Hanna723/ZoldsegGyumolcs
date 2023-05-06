import { Component, OnInit } from '@angular/core';
import { PreviewComponent } from './products/preview/preview.component';
import { CartComponent } from './cart/cart.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'zoldseg-gyumolcs';
  amount = 0;

  ngOnInit(): void {
    this.setAmount();
  }

  subscribeToLocalStorage(componentRef: any) {
    if (!(componentRef instanceof PreviewComponent)) {
      this.subscribeWithCart(componentRef);
      return;
    }
    const childComponent: PreviewComponent = componentRef;
    childComponent.addEvent.subscribe(() => {
      this.setAmount();
    });
  }

  subscribeWithCart(componentRef: any) {
    if (!(componentRef instanceof CartComponent)) {
      return;
    }
    const childComponent: CartComponent = componentRef;
      childComponent.removeEvent.subscribe(() => {
        this.setAmount();
      });
  }

  setAmount() {
    const localOrder = localStorage.getItem('order');
    if (localOrder) {
      const order = JSON.parse(localOrder);
      this.amount = order.products.length;
    }
  }
}
