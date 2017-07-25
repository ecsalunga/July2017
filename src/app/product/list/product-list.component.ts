import { Component, OnInit } from '@angular/core';
import { Core } from '../../core';
import { Data } from '../../data';
import { ProductInfo } from '../../models';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

  constructor(public core: Core, public data: Data) {}

  SelectProduct(product: ProductInfo) {
    this.data.SelectedProduct = product;
    this.core.loadComponent("app-product-detail");
  }

  ngOnInit() { }

}
