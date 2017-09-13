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

  CanAdd(item: ShowcaseInfo): boolean {
    let isAllowed = true;
    let openCart = 0;
    let hasOpen = false;
    this.DL.ShowcaseUserOrders.forEach(order => {
      if(order.Status == this.DL.STATUS_SELECTING) {
        hasOpen = true;
        order.Items.forEach(cItem => {
          if(item.Product.Code == cItem.Code) {
            isAllowed = cItem.Quantity < item.MaxCart;
          }
        });
      }

      if(order.Status != this.DL.STATUS_DELIVERED || order.Status != this.DL.STATUS_CANCELLED )
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
          if(item.Product.Code == cItem.Code) {
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
      order.Amount = item.Product.Price;
      
      order.ActionDate = this.DL.GetActionDate();
      order.Status = this.DL.STATUS_SELECTING;
      quantity = 1;

      order.Items.push(this.createSell(item));
      this.DA.ShowcaseOrderSave(order);
    }

    this.DL.Display(item.Product.Description, quantity + " " + (quantity == 1 ? "item":"items") + " to cart.");
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
