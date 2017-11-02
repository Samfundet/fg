import { IOrder } from './../../../model';
import { Component, OnInit } from '@angular/core';
import { StoreService } from 'app/services';

@Component({
  selector: 'fg-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit {

  orders: IOrder[];

  constructor(
    public store: StoreService
  ) { }

  ngOnInit() {
    this.store.getOrdersAction().subscribe(o => this.orders = o);
  }

}
