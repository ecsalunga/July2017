import { Component, OnInit } from '@angular/core';
import { Core } from '../../core';
import { DataAccess, DataLayer } from '../../data';
import { SellInfo, OrderInfo } from '../../data/models';

@Component({
  selector: 'showcase-cart',
  templateUrl: './showcase-cart.component.html',
  styleUrls: ['./showcase-cart.component.css']
})
export class ShowcaseCartComponent implements OnInit {
  isCheckingout: boolean = false;

  constructor(private core: Core, public DL: DataLayer, private DA: DataAccess) { }
  
  GetDate(keyDay: number): Date {
    return this.core.numberToDate(keyDay);
  }

  ShowCheckout() {
    this.isCheckingout = true;
  }

  HideCheckout() {
    this.isCheckingout = false;
  }

  Checkout(item: OrderInfo) {
    this.DL.OrderUpdateStatus(item, this.DL.STATUS_REQUESTED);
    this.DA.ShowcaseOrderSave(item);
    this.isCheckingout = false;
    this.DL.DisplayPublic("Order", "Requested!");
  }

  SetStatusDone(item: OrderInfo) {
    this.DL.OrderUpdateStatus(item, this.DL.STATUS_DONE);
    this.DA.ShowcaseOrderSave(item);
    this.DL.DisplayPublic("Order", "Hidden!");
    if(!this.DL.ShowcaseUserHasOrder) {
      this.LoadList();
    }
  }

  ViewStatus(item: OrderInfo) {
    this.DL.ShowcaseOrder = item;
    this.DL.LoadFromPublic('product-order-detail');
  }

  Delete(info: SellInfo) {
    this.DL.ShowcaseUserOrders.forEach(order => {
      if(order.Status == this.DL.STATUS_SELECTING) {
        let count = 0;
        let amount = 0;
        let items = new Array<SellInfo>();

        order.Items.forEach(sell => {
          if(sell.Code != info.Code) {
            items.push(sell);
            
            count+= sell.Quantity;
            amount+= sell.Total;
          }
        });

        // update
        if(amount > 0 || count > 0) {
          order.Items = items;
          order.Amount = amount;
          order.Count = count;
          order.ActionDate = this.DL.GetActionDate();
          this.DA.ShowcaseOrderSave(order);
        } 
        else {
          this.DA.ShowcaseOrderDelete(order);
          this.DL.DisplayPublic("Shopping Cart", "Deleted!");
          
          if(!this.DL.ShowcaseUserHasOrder) {
            this.LoadList();
          }
        }
      }
    }); 
  }

  LoadList() {
    this.DL.LoadFromLink("website-catalog");
  }

  ngOnInit() {
    this.DL.TITLE = "Shopping Cart";
  }
}
