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
    this.model = new ProductInfo("P00");
    if (this.DL.SelectedProduct) {
      this.model.Code = this.DL.SelectedProduct.Code;
      this.model.Description = this.DL.SelectedProduct.Description;
      this.model.BuyPrice = this.DL.SelectedProduct.BuyPrice;
      this.model.SellPrice = this.DL.SelectedProduct.SellPrice;
      this.model.Quantity = this.DL.SelectedProduct.Quantity;
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
