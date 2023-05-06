import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { OrderListRoutingModule } from './order-list-routing.module';
import { OrderListComponent } from './order-list.component';

import { MatListModule } from '@angular/material/list';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { OrderService } from '../shared/services/order.service';
import { OrderTableDataPipe } from '../shared/pipes/order-table-data.pipe';

@NgModule({
  declarations: [OrderListComponent],
  imports: [
    CommonModule,
    OrderListRoutingModule,
    MatListModule,
    MatTableModule,
    MatIconModule,
  ],
  providers: [OrderService, OrderTableDataPipe, DatePipe],
})
export class OrderListModule {}
