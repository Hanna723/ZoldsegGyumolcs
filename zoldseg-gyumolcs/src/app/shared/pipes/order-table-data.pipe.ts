import { Pipe, PipeTransform } from '@angular/core';
import { Order } from '../models/Order';
import { OrderWithTableData } from '../models/OrderWithTableData';
import { DatePipe } from '@angular/common';

@Pipe({
  name: 'orderTableData'
})
export class OrderTableDataPipe implements PipeTransform {

  constructor(private datePipe: DatePipe) {}

  transform(value: any, ...args: unknown[]): OrderWithTableData {
    const date = new Date(value.time.seconds * 1000 + value.time.nanoseconds / 1000000);
    let date2 = new Date();
    date2.setDate(date.getDate() + 7);
    const formattedDate = this.datePipe.transform(date, 'yyyy.MM.dd HH:mm:ss');
    const formattedDate2 = this.datePipe.transform(date2, 'yyyy.MM.dd');

    let order: OrderWithTableData = {
      user: value.user,
      products: [],
      price: value.price,
      time: formattedDate ? formattedDate : date,
      time2: formattedDate2 ? formattedDate2 : date
    }
    return order;

  }

}
