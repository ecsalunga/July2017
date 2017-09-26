import { Component, OnInit } from '@angular/core';
import { Core } from '../../core';
import { DataAccess, DataLayer } from '../../data';
import { SubscriptionInfo, ProductInfo, PromoInfo } from '../../data/models';

@Component({
  selector: 'subscription-product',
  templateUrl: './subscription-product.component.html',
  styleUrls: ['./subscription-product.component.css']
})
export class SubscriptionProductComponent implements OnInit {
  model: SubscriptionInfo;
  selectedProduct: ProductInfo;
  products: Array<PromoInfo>;
  price: number;
  quota: number;

  constructor(private core: Core, private DA: DataAccess, public DL: DataLayer) {
    this.products = new Array<PromoInfo>();
    this.model = Object.assign({}, this.DL.Subscription);
    if(this.model.Products != null && this.model.Products.length > 0) {
      this.model.Products.forEach(product => {
        this.products.push(product);
      });
    }
  }

  CanAdd(): boolean {
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
    if(!this.DL.UserAccess.SubscriptionProductAdd && !this.DL.UserAccess.SubscriptionProductDelete)
      return false;

    return true;
  }

  AddItem() {
    let item = new PromoInfo();
    item.Code = this.selectedProduct.Code;
    item.Name = this.selectedProduct.Description
    item.Quota = this.quota;
    item.Price = this.price;
    this.products.push(item);
    this.products.sort((item1, item2) => item1.Name.localeCompare(item2.Name));
    this.ClearSelection();
  }

  Delete(item: PromoInfo) {
    this.products = this.products.filter(s => !(s.Code == item.Code));
  }

  ClearSelection() {
    this.selectedProduct = null;
    this.price = null;
    this.quota = null;
  }

  Save() {
    this.model.Products = this.products;
    this.DA.SubscriptionSave(this.model);
    this.DL.Display("Product List", "Saved!");
    this.LoadList();
  }

  Exists(product: ProductInfo): boolean {
    let exists = false;
    this.products.forEach(item => {
      if(item.Code == product.Code)
        exists = true;
    });
    return exists;
  }
 
  LoadList() {
    this.DL.LoadFromLink("subscription-list");
  }

  ngOnInit() {
    this.DL.TITLE = "Product Bundle";
  }
}
