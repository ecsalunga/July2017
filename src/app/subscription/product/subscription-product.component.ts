import { Component, OnInit } from '@angular/core';
import { Core } from '../../core';
import { DataAccess, DataLayer } from '../../data';
import { SubscriptionInfo, ProductInfo, Name2Value } from '../../data/models';

@Component({
  selector: 'subscription-product',
  templateUrl: './subscription-product.component.html',
  styleUrls: ['./subscription-product.component.css']
})
export class SubscriptionProductComponent implements OnInit {
  model: SubscriptionInfo;
  selectedProduct: ProductInfo;
  prices: Array<Name2Value>;
  price: number;

  constructor(private core: Core, private DA: DataAccess, public DL: DataLayer) {
    this.prices = new Array<Name2Value>();
    this.model = Object.assign({}, this.DL.Subscription);
    if(this.model.Prices != null && this.model.Prices.length > 0) {
      this.model.Prices.forEach(sub => {
        this.prices.push(sub);
      });
    }
  }

  CanAdd(): boolean {
    if(!this.CanSave())
      return false;
    
    if(!this.selectedProduct)
      return false;
    
    if(!this.price || this.price < 1)
      return false;

    return true;
  }

  ProductSelected() {
    this.price = this.selectedProduct.Price;
  }

  CanSave(): boolean {
    if(!this.DL.UserAccess.BorrowEdit)
      return false;

    return true;
  }

  AddItem() {
    let item = new Name2Value(this.selectedProduct.Description, this.selectedProduct.Code, this.price );
    this.prices.push(item);
    this.prices.sort((item1, item2) => item1.Name.localeCompare(item2.Name));
    this.ClearSelection();
  }

  Delete(item: Name2Value) {
    this.prices = this.prices.filter(s => !(s.Value1 == item.Value1));
  }

  ClearSelection() {
    this.selectedProduct = null;
    this.price = null;
  }

  Save() {
    this.model.Prices = this.prices;
    this.DA.SubscriptionSave(this.model);
    this.DL.Display("Product List", "Saved!");
    this.LoadList();
  }

  Exists(product: ProductInfo): boolean {
    let exists = false;
    this.prices.forEach(item => {
      if(item.Value1 == product.Code)
        exists = true;
    });
    return exists;
  }
 
  LoadList() {
    this.DL.LoadFromLink("subscription-list");
  }

  ngOnInit() {
    this.DL.TITLE = "Product List";
  }
}
