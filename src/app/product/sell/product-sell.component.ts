import { Component, OnInit } from '@angular/core';
import { Core } from '../../core';
import { DataAccess, DataLayer } from '../../data';
import { ProductInfo, UserInfo, SellInfo } from '../../models';

@Component({
  selector: 'product-sell',
  templateUrl: './product-sell.component.html',
  styleUrls: ['./product-sell.component.css']
})
export class ProductSellComponent implements OnInit {
  model: ProductInfo;
  selectedQuantity: number = 1;
  quantities: Array<number>;
  selectedMember: UserInfo = this.DL.MemberWalkIn;
  isPaying: boolean = false;
  isDelivery: boolean = false;

  constructor(private core: Core, private DA: DataAccess, private DL: DataLayer) { }

  AddProduct() {
    let duplicate: SellInfo;
    let item = new SellInfo();
    item.Code = this.model.Code;
    item.Description = this.model.Description;
    item.Price = this.model.Price;
    item.Quantity = this.selectedQuantity;

    // merge items
    this.DL.SellInfos.forEach(info => {
      if(info.Code == item.Code) {
        duplicate = info;
        item.Quantity += info.Quantity;
      }
    });

    if(duplicate) {
       this.DA.SellInfoDelete(duplicate);
    }

    // re-evaluate quantity
    this.DL.Products.forEach(product => {
      if(product.Code == item.Code && product.Quantity < item.Quantity) {
        item.Quantity = product.Quantity;
      }
    });
    item.Total = item.Quantity * item.Price;
    
    this.DA.SellInfoSave(item);
    this.clearSelection();
  }

  clearSelection() {
    this.model = null;
    this.quantities = new Array<number>();
    this.selectedQuantity = 1;
  }

  productSelected() {
    this.quantities = new Array<number>();
    for(let x = 1; x <= this.model.Quantity; x++){
      this.quantities.push(x);
    }
  }

  Delete(info: SellInfo) {
     this.DA.SellInfoDelete(info);
     this.isPaying = false;
  }
  
  CartOpen() {
    this.isPaying = false;
  }

  CartClose() {
    this.isPaying = true;
  }

  CartDone() {
    this.DA.SellInfoDone(this.selectedMember.key, this.selectedMember.Name, this.isDelivery);
    if(this.isDelivery)
      this.DL.Display("Delivery Info", "Created!");
    else
      this.DL.Display("Transaction", "Created!");

    this.selectedMember = this.DL.MemberWalkIn;
    this.isPaying = false;
    this.isDelivery = false;
  }

  ngOnInit() {
    this.DL.TITLE = "Sell Product";
    this.DL.DeliveryToggledStamp = 0;
  }
}
