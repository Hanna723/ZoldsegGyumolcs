import { Component, OnInit } from '@angular/core';
import { OrderService } from '../shared/services/order.service';
import { Order } from '../shared/models/Order';
import { OrderTableDataPipe } from '../shared/pipes/order-table-data.pipe';
import { OrderWithTableData } from '../shared/models/OrderWithTableData';

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.scss'],
})
export class OrderListComponent implements OnInit {
  tableData?: Array<OrderWithTableData>;
  columnsToDisplay = ['time', 'time2', 'price'];

  constructor(
    private orderService: OrderService,
    private tableDataPipe: OrderTableDataPipe
  ) {}

  ngOnInit(): void {
    const localUser = localStorage.getItem('user');
    if (localUser) {
      this.orderService.getAll(JSON.parse(localUser).uid).subscribe((data) => {
        this.tableData = [];
        data.forEach((el) => {
          this.tableData?.push(this.tableDataPipe.transform(el));
        });
      });
    }
  }
}
