import { Component, OnInit } from '@angular/core';
import { Core } from '../../core';
import { DataAccess, DataLayer } from '../../data';
import { OrderInfo } from '../../data/models';

@Component({
  selector: 'product-order',
  templateUrl: './product-order.component.html',
  styleUrls: ['./product-order.component.css']
})
export class ProductOrderComponent implements OnInit {
  constructor(private core: Core, private DL: DataLayer, private DA: DataAccess) { }
  
  GetDate(keyDay: number): Date {
    return this.core.numberToDate(keyDay);
  }

  Select(item: OrderInfo) {
    this.DL.ShowcaseOrder =  item;
    this.DL.LoadFromLink('product-order-detail');
  }

  ngOnInit() {
    this.DL.TITLE = "Order List";
  }
}
