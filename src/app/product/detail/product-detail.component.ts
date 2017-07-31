import { Component, OnInit } from '@angular/core';
import { Core } from '../../core';
import { DataAccess, DataLayer } from '../../data';
import { ProductInfo } from '../../models';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit {
  model: ProductInfo;

  constructor(private core: Core, private DA: DataAccess, private DL: DataLayer) {
    this.model = new ProductInfo("");
    if (this.DL.Product) {
      this.model.key = this.DL.Product.key;
      this.model.Code = this.DL.Product.Code;
      this.model.Description = this.DL.Product.Description;
      this.model.BuyPrice = this.DL.Product.BuyPrice;
      this.model.SellPrice = this.DL.Product.SellPrice;
      this.model.Quantity = this.DL.Product.Quantity;
    }
  }

  Save() {
    this.DA.SaveProduct(this.model);
    this.LoadProductList();
  }

  LoadProductList() {
    this.core.loadComponent("app-product-list");
  }

  ngOnInit() {

  }

}
