import { Component, OnInit } from '@angular/core';

import { Core } from '../core';
import { DataAccess, DataLayer } from '../data';
import { ProductInfo, MemberInfo, SellInfo } from '../models';

@Component({
  selector: 'sell',
  templateUrl: './sell.component.html',
  styleUrls: ['./sell.component.css']
})
export class SellComponent implements OnInit {
  model: ProductInfo;
  selectedQuantity: number = 1;
  quantities: Array<number>;
  selectedMember: MemberInfo = this.DL.MemberWalkIn;
  isPaying: boolean = false;

  constructor(private core: Core, private DA: DataAccess, private DL: DataLayer) { }

  AddProduct() {
    let duplicate: SellInfo;
    let item = new SellInfo();
    item.Code = this.model.Code;
    item.Description = this.model.Description;
    item.Price = this.model.SellPrice;
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
  
  Cancel() {
    this.isPaying = false;
  }

  Paying() {
    this.isPaying = true;
  }

  Done() {
    this.DA.SellInfoDone(this.selectedMember.key, this.selectedMember.Name);
    this.selectedMember = this.DL.MemberWalkIn;
    this.isPaying = false;
  }

  ngOnInit() {
    this.DL.TITLE = "Sell Product";
  }
}
