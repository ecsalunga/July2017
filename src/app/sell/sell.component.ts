import { Component, OnInit } from '@angular/core';

import { Core } from '../core';
import { DataAccess, DataLayer } from '../data';
import { ProductInfo, SellInfo } from '../models';

@Component({
  selector: 'app-sell',
  templateUrl: './sell.component.html',
  styleUrls: ['./sell.component.css']
})
export class SellComponent implements OnInit {
  model: ProductInfo;
  selectedQuantity: number;
  quantities: Array<number>;

  constructor(private core: Core, private DA: DataAccess, private DL: DataLayer) { }

  AddProduct() {
    let item = new SellInfo();
    item.Code = this.model.Code;
    item.Description = this.model.Description;
    item.Quantity = this.selectedQuantity;
    this.DA.SaveSellInfo(item);
    this.clearSelection();
  }

  clearSelection() {
    this.model = new ProductInfo();
    this.quantities = new Array<number>();
    this.selectedQuantity = 0;
  }

  productSelected() {
    this.quantities = new Array<number>();
    for(let x = 1; x <= this.model.Quantity; x++){
      this.quantities.push(x);
    }
  }

  Delete(info: SellInfo) {
     this.DA.DeleteSellInfo(info);
  }

  ngOnInit() {
  }

}
