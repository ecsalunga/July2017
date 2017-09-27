import { Component, OnInit } from '@angular/core';
import { Core } from '../../core';
import { DataAccess, DataLayer } from '../../data';
import { ProductInfo, UserInfo, SellInfo, SubscriptionInfo } from '../../data/models';

@Component({
  selector: 'product-sell',
  templateUrl: './product-sell.component.html',
  styleUrls: ['./product-sell.component.css']
})
export class ProductSellComponent implements OnInit {
  model: ProductInfo;
  selectedQuantity: number = 1;
  discountPrice: number = 0;
  quantities: Array<number>;
  selectedMember: UserInfo = this.DL.MemberWalkIn;
  isPaying: boolean = false;
  isDelivery: boolean = false;
  isDiscount: boolean = false;

  constructor(private core: Core, private DA: DataAccess, public DL: DataLayer) {
    if(this.DL.UserSelected == null)
      this.DL.UserSelected = this.DL.User;

    this.DL.ComputeUserSellInfo(this.DL.UserSelected);
  }

  AddProduct() {
    let exists = false;
    let item = new SellInfo();

    item.Code = this.model.Code;
    item.Description = this.model.Description;

    if(this.isDiscount) {
      item.Price = this.discountPrice;
      item.Quantity = 1;
      item.Total = item.Price * -1;
    }
    else {
      item.Price = this.model.Price;
      item.Quantity = this.selectedQuantity;

      // merge items
      if(this.DL.UserSelected.Sells != null && this.DL.UserSelected.Sells.length > 0) {
        this.DL.UserSelected.Sells.forEach(info => {
          if(info.Code == item.Code) {
            info.Quantity += item.Quantity;
            info.Total = info.Quantity * info.Price;
            exists = true;
          }
        });
      }

      // re-evaluate quantity
      this.DL.Products.forEach(product => {
        if(product.Code == item.Code && product.Quantity < item.Quantity) {
          item.Quantity = product.Quantity;
        }
      });
      item.Total = item.Quantity * item.Price;
    }

    if(!exists)
      this.DA.SellInfoAdd(this.DL.UserSelected, item);
    else
      this.DA.UserSave(this.DL.UserSelected);

    this.DL.ComputeUserSellInfo(this.DL.UserSelected);
    this.ClearSelection();
  }

  CanAdd(): boolean {
    return ((this.model && this.selectedQuantity > 0) 
    || (this.isDiscount && this.discountPrice > 0 && this.discountPrice <= this.DL.SellInfosAmount));
  }

  ClearSelection() {
    this.model = null;
    this.quantities = new Array<number>();
    this.selectedQuantity = 1;
    this.isDiscount = false;
    this.discountPrice = 0;
  }

  ProductSelected() {
    if(this.model.Code == this.DL.KEYDISCOUNT) {
      this.isDiscount = true;
      this.selectedQuantity = 0;
    }
    else {
      this.isDiscount = false;
      this.quantities = new Array<number>();
      for(let x = 1; x <= this.model.Quantity; x++)
        this.quantities.push(x);
    }
  }

  Delete(info: SellInfo) {
    if(info.Code == this.DL.KEYSUBSCRIPTION) {
      this.DL.UserSelected.Sells = this.DL.UserSelected.Sells.filter(s => !(s.Code == this.DL.KEYSUBSCRIPTION));
      this.DL.ComputeUserSellInfo(this.DL.UserSelected);
    }
    else {
     this.DA.SellInfoDelete(this.DL.UserSelected, info);
     this.CartOpen();
    }   
  }

  RequestDelete(info: SellInfo) {
    this.DA.SellInfoRequestDelete(this.DL.UserSelected, info);
  }
  
  CartOpen() {
    this.isPaying = false;
    if(this.DL.UserSelected.Sells.some(sell => sell.Code == this.DL.KEYSUBSCRIPTION)) {
      this.DL.UserSelected.Sells = this.DL.UserSelected.Sells.filter(s => !(s.Code == this.DL.KEYSUBSCRIPTION));
      this.DL.ComputeUserSellInfo(this.DL.UserSelected);
    }
  }

  CartClose() {
    this.isPaying = true;
    if(this.selectedMember.key != this.DL.MemberWalkIn.key) {
      if(this.DL.SellSubscription(this.DL.UserSelected.Sells, this.selectedMember))
        this.DL.ComputeUserSellInfo(this.DL.UserSelected);
    }
  }

  CartDone() {
    this.DA.SellInfoDone(this.DL.UserSelected, this.selectedMember.key, this.selectedMember.Name, this.isDelivery);
    if(this.isDelivery) {
      this.DL.Display("Delivery Info", "Created!");
    }
    else
      this.DL.Display("Transaction", "Saved!");

    this.selectedMember = this.DL.MemberWalkIn;
    this.isPaying = false;
    this.isDelivery = false;
  }

  ngOnInit() {
    this.DL.TITLE = "Sell Product";
  }
}
