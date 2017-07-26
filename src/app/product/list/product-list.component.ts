import { Component, OnInit } from '@angular/core';
import { Core } from '../../core';
import { DataLayer } from '../../data';
import { ProductInfo } from '../../models';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

  constructor(private core: Core, private DL: DataLayer) {}

  SelectProduct(product: ProductInfo) {
    this.DL.SelectedProduct = product;
    this.core.loadComponent("app-product-detail");
  }

  ngOnInit() { }

}
