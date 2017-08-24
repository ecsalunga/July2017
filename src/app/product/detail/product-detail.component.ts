import { Component, OnInit } from '@angular/core';
import { Core } from '../../core';
import { DataAccess, DataLayer } from '../../data';
import { ProductInfo } from '../../models';

@Component({
  selector: 'product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit {
  model: ProductInfo;

  constructor(private core: Core, private DA: DataAccess, private DL: DataLayer) {
    if (this.DL.Product)
      this.model = Object.assign({}, this.DL.Product);
    else
      this.model = new ProductInfo();
  }

  Save() {
    this.DA.ProductSave(this.model);
    this.LoadList();
  }

  LoadList() {
    this.DL.LoadFromLink("product-list");
  }

  ngOnInit() {
    this.DL.TITLE = "Product Details";
  }
}
