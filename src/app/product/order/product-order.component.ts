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
  constructor(private core: Core, public DL: DataLayer, private DA: DataAccess) {
    if(this.DL.SOURCE == this.DL.MENU)
      this.DL.ShowcaseOrderTabIndex = 0;
  }
  
  GetDate(keyDay: number): Date {
    return this.core.numberToDate(keyDay);
  }

  Select(item: OrderInfo, index: number) {
    this.DL.ShowcaseOrderTabIndex = index;
    this.DL.ShowcaseOrder =  item;
    this.DL.LoadFromLink('product-order-detail');
  }

  LoadUser(item: OrderInfo) {
    this.DA.ShowUserInfo(item.MemberKey);
  }

  HasClean(): boolean {
    let hasClean = false
    this.DL.ShowcaseUserDoneOrders.forEach(item => {
      if(item.Status == this.DL.STATUS_CANCELLED || (item.Status == this.DL.STATUS_DONE  && (item.IsTransaction || item.HasDelivery)))
        hasClean = true;
    });

    return hasClean;
  }

  CleanDelete() {
    this.DL.ShowcaseUserDoneOrders.forEach(item => {
      if(item.Status == this.DL.STATUS_CANCELLED || (item.Status == this.DL.STATUS_DONE  && (item.IsTransaction || item.HasDelivery)))
        this.DA.ShowcaseOrderDelete(item);
    });

    this.DL.Display("Order", "Done Status Cleared!");
  }

  ngOnInit() {
    this.DL.TITLE = "Order List";
  }
}
