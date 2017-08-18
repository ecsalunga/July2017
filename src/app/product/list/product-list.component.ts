import { Component, OnInit } from '@angular/core';
import { Core } from '../../core';
import { DataAccess, DataLayer } from '../../data';
import { ProductInfo } from '../../models';

@Component({
  selector: 'product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {
  model: ProductInfo;
  quantities: Array<number>;
  selectedQuantity: number = 0;

  constructor(private core: Core, private DA: DataAccess, private DL: DataLayer) {
    this.quantities = new Array<number>();
    for(let x = 1; x <= 100; x++){
      this.quantities.push(x);
    }
  }

  SelectProduct(product: ProductInfo) {
    this.DL.Product = product;
    this.core.loadComponent("product-detail");
  }

  AddProduct(){
    this.DL.Product = null;
    this.core.loadComponent("product-detail");
  }

  productSelected() {
    if(this.model)
      this.selectedQuantity = 1;
  }

  SuppyProduct() {
    this.model.Quantity += this.selectedQuantity;
    this.DA.ProductSave(this.model);
    this.model = null;
    this.selectedQuantity = 0;
  }

  ngOnInit() { }

}
