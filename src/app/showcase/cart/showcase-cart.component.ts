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

  constructor(private core: Core, public DL: DataLayer, private DA: DataAccess) { 
    this.DL.ShowcaseUserOrders.forEach(item => {
      if(item.Status == this.DL.STATUS_SELECTING)
        this.removeSusbscription(item);
    });
  }
  
  GetDate(keyDay: number): Date {
    return this.core.numberToDate(keyDay);
  }

  ShowCheckout(item: OrderInfo) {
    this.isCheckingout = true;
    if(this.DL.SellSubscription(item.Items, this.DL.User))
      this.updateOrderComputation(item);
  }

  private updateOrderComputation(order: OrderInfo) {
    order.Count = 0;
    order.Amount = 0;
    order.Items.forEach(item => {
      order.Count+= item.Quantity;
      order.Amount+= item.Total;
    });
  }

  HideCheckout(item: OrderInfo) {
    this.removeSusbscription(item);
    this.isCheckingout = false;
  }

  private removeSusbscription(item: OrderInfo) {
    if(item.Items.some(sell => sell.Code == this.DL.KEYSUBSCRIPTION)) {
      item.Items = item.Items.filter(s => !(s.Code == this.DL.KEYSUBSCRIPTION));
      this.updateOrderComputation(item);
    }
  }

  Checkout(item: OrderInfo) {
    this.DL.StatusUpdate(item, this.DL.STATUS_REQUESTED);
    this.DA.ShowcaseOrderSave(item);
    this.isCheckingout = false;
    this.DL.DisplayPublic("Order", "Requested!");
  }

  SetStatusDone(item: OrderInfo) {
    this.DL.StatusUpdate(item, this.DL.STATUS_DONE);
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
        this.removeSusbscription(order);
        this.isCheckingout = false;

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
