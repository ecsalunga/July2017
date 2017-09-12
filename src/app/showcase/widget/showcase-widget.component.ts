import { Component, OnInit } from '@angular/core';
import { DataLayer, DataAccess } from '../../data';
import { ShowcaseInfo, OrderInfo, SellInfo } from '../../data/models';

@Component({
  selector: 'showcase-widget',
  templateUrl: './showcase-widget.component.html',
  styleUrls: ['./showcase-widget.component.css']
})
export class ShowcaseWidgetComponent implements OnInit {

  constructor(private DL: DataLayer, private DA: DataAccess) { }

  AddToCart(item: ShowcaseInfo) {
    let hasSelecting = false;
    this.DL.ShowcaseUserOrders.forEach(order => {
      if(order.Status == this.DL.STATUS_SELECTING) {
        hasSelecting = true;
        let exists = false;
        order.Items.forEach(cItem => {
          // update
          if(item.Product.Code == cItem.Code) {
            exists = true;
            cItem.Quantity++;
            cItem.Total = cItem.Price * cItem.Quantity;
            
            order.Count++;
            order.Amount+= cItem.Price;
          }
        });

        // add
        if(!exists) {
          let sell = this.createSell(item);
          order.Count++;
          order.Amount+= sell.Price;
          order.Items.push(sell);
        }

        order.ActionDate = this.DL.GetActionDate();
        this.DA.ShowcaseOrderSave(order);
      }
    });

    // open a new shopping cart
    if(!hasSelecting) {
      let order = new OrderInfo();
      order.MemberKey = this.DL.User.key;
      order.BuyerName = this.DL.User.Name;
      
      order.Count = 1;
      order.Amount = item.Product.Price;
      
      order.ActionDate = this.DL.GetActionDate();
      order.Status = this.DL.STATUS_SELECTING;

      order.Items.push(this.createSell(item));
      this.DA.ShowcaseOrderSave(order);
    }

    this.DL.Display(item.Product.Description, "Added!");
  }

  createSell(item: ShowcaseInfo): SellInfo {
    let sell = new SellInfo();
    sell.Code = item.Product.Code;
    sell.Description = item.Product.Description;
    sell.Price = item.Product.Price;
    sell.Quantity = 1
    sell.Total = sell.Quantity * sell.Price;
    return sell;
  }

  ngOnInit() {
    
  }
}
