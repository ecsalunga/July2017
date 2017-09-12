import { Component, OnInit } from '@angular/core';
import { Core } from '../../core';
import { DataAccess, DataLayer } from '../../data';
import { SellInfo } from '../../data/models';

@Component({
  selector: 'showcase-cart',
  templateUrl: './showcase-cart.component.html',
  styleUrls: ['./showcase-cart.component.css']
})
export class ShowcaseCartComponent implements OnInit {
  constructor(private core: Core, private DL: DataLayer, private DA: DataAccess) { }
  
  GetDate(keyDay: number): Date {
    return this.core.numberToDate(keyDay);
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
          this.DL.Display("Order", "Deleted!");
          
          if(!this.DL.ShowcaseUserHasOrder) {
            this.LoadList();
          }
        }
      }
    }); 
  }

  LoadList() {
    this.DL.LoadFromLink("dashboard-home");
  }

  ngOnInit() {
    this.DL.TITLE = "Shopping Cart";
  }
}