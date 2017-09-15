import { Component, OnInit } from '@angular/core';
import { Core } from '../../core';
import { DataAccess, DataLayer } from '../../data';
import { ProductInfo } from '../../data/models';

@Component({
  selector: 'product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {
  model: ProductInfo;
  quantities: Array<number>;
  quantitySelected: number = 0;

  constructor(private core: Core, private DA: DataAccess, public DL: DataLayer) {
    this.quantities = new Array<number>();
    for(let x = 1; x <= 100; x++){
      this.quantities.push(x);
    }
  }

  SelectProduct(product: ProductInfo) {
    this.DL.Product = product;
    this.DL.LoadFromLink("product-detail");
  }

  AddProduct(){
    this.DL.Product = null;
    this.DL.LoadFromLink("product-detail");
  }

  ProductSelected() {
    if(this.model)
      this.quantitySelected = 1;
  }

  SuppyProduct() {
    this.model.Quantity += this.quantitySelected;
    this.DA.ProductSave(this.model);
    this.DL.Display(this.model.Description, this.quantitySelected + " Added");
    this.model = null;
    this.quantitySelected = null;
  }

  ngOnInit() { 
    this.DL.TITLE = "Product List";
  }
}
