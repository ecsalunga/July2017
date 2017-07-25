import { Component, OnInit } from '@angular/core';
import { Core } from '../../core';
import { Data } from '../../data';
import { ProductInfo } from '../../models';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit {
  model: ProductInfo;

  constructor(public core: Core, public data: Data) {
    this.model = this.data.SelectedProduct;
  }

  LoadProductList(){
    this.core.loadComponent("app-product-list");
  }

  ngOnInit() {
    
  }

}
