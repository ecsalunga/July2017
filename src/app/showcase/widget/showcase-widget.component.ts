import { Component, OnInit } from '@angular/core';
import { DataLayer, DataAccess } from '../../data';
import { ShowcaseInfo, OrderInfo, SellInfo } from '../../data/models';

@Component({
  selector: 'showcase-widget',
  templateUrl: './showcase-widget.component.html',
  styleUrls: ['./showcase-widget.component.css']
})
export class ShowcaseWidgetComponent implements OnInit {
  
  constructor(public DL: DataLayer, private DA: DataAccess) { }

  CanAdd(item: ShowcaseInfo): boolean {
    if(item.MaxCart == 0)
      return false;

    let isAllowed = true;
    let openCart = 0;
    let hasOpen = false;

    this.DL.ShowcaseUserOrders.forEach(order => {
      if(order.Status == this.DL.STATUS_SELECTING) {
        hasOpen = true;
        order.Items.forEach(cItem => {
          if(item.ProductCode == cItem.Code) {
            isAllowed = (item.MaxCart == null || cItem.Quantity < item.MaxCart);
          }
        });
      }

      if(order.Status != this.DL.STATUS_DELIVERED && order.Status != this.DL.STATUS_CANCELLED )
        openCart++;
    });

    if(isAllowed)
      isAllowed = hasOpen || openCart < this.DL.ModuleSetting.ShowcseCartItemMax;

    return isAllowed;
  }

  AddToCart(item: ShowcaseInfo) {
    let quantity = 0;
    let hasSelecting = false;
    this.DL.ShowcaseUserOrders.forEach(order => {
      if(order.Status == this.DL.STATUS_SELECTING) {
        hasSelecting = true;
        let exists = false;
        order.Items.forEach(cItem => {
          // update
          if(item.ProductCode == cItem.Code) {
            exists = true;
            cItem.Quantity++;
            cItem.Total = cItem.Price * cItem.Quantity;
            
            order.Count++;
            order.Amount+= cItem.Price;
            quantity = cItem.Quantity;
          }
        });

        // add
        if(!exists) {
          let sell = this.createSell(item);
          order.Count++;
          order.Amount+= sell.Price;
          quantity = 1;
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
      order.Amount = item.ProductPrice;
      this.DL.StatusUpdate(order, this.DL.STATUS_SELECTING);
      quantity = 1;

      order.Items.push(this.createSell(item));
      this.DA.ShowcaseOrderSave(order);
    }

    this.DL.DisplayPublic(item.ProductName, quantity + " " + (quantity == 1 ? "item":"items") + " to cart.");
  }

  createSell(item: ShowcaseInfo): SellInfo {
    let sell = new SellInfo();
    sell.Code = item.ProductCode;
    sell.Description = item.ProductName;
    sell.Price = item.ProductPrice;
    sell.Quantity = 1
    sell.Total = sell.Quantity * sell.Price;
    return sell;
  }

  ngOnInit() {
    
  }
}
